import React, { Component } from 'react'
import { connect } from 'react-redux';
import '../styles/billing.css'
import { FaArrowUp } from "react-icons/fa";
import { FaArrowDown } from "react-icons/fa";
import { FaPlay } from "react-icons/fa";
import { Link } from 'react-router-dom'
import { updateStock } from '../redux/slices/InventorySlice';
import { addItem } from '../redux/slices/AddedItemsSlice'
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';

const StyledAutocomplete = styled(Autocomplete)({
    '& .MuiAutocomplete-popupIndicator': {
        display: 'none', // Hide the dropdown icon
    },
    '& .MuiAutocomplete-clearIndicator': {
        display: 'none', // Hide the clear (delete) icon
    },
});

class Billing extends Component {
    constructor(props) {
        super(props);
        this.snackListRef = React.createRef();
        this.state = {
            selectedItem: '',
            quantity: 1,
            errorMessage: '',
            displayBill: 'none',
            addedItems: [],
            isDragging: false,
            startY: 0,
            scrollTop: 0,
            tenderAmount: 0,
            changeAmount: 0,
        };
    }

    // Handle item selection from dropdown
    handleSelectChange = (event, value) => {
        console.log(value.itemName);

        this.setState({ selectedItem: value.itemName });
    };

    // Handle quantity input
    handleQuantityChange = (e) => {
        this.setState({ quantity: Number(e.target.value) });
    };

    // Handle number butttons
    handleNumberClick = (number) => {
        this.setState((prevState) => ({
            quantity: prevState.quantity + number
        }))
    }

    // Handle AC button
    handleAC = () => {
        this.setState((prevState) => {
            // Convert the quantity to a string, remove the last character, and convert back to a number
            const newQuantityString = prevState.quantity.toString().slice(0, -1);
            // Handle the case when the string is empty or not a valid number
            const newQuantity = newQuantityString ? parseInt(newQuantityString, 10) : 0;

            return {
                quantity: newQuantity
            };
        });
    };


    // Handle Clear Button
    handleClear = () => {
        this.setState({ quantity: '' })
    }

    // Calculate the total price of all items
    calculateTotalPrice = () => {
        return this.state.addedItems.reduce((total, item) => total + item.totalPrice, 0).toFixed(2);
    };

    // Calculate GST Amount (7% of total price)
    calculateGSTAmount = (totalPrice) => {
        const gst = (totalPrice * 0.07).toFixed(2);
        return gst;
    };

    // Calculate Payable Amount (Total price + GST)
    calculatePayableAmount = (totalPrice) => {
        const payableAmount = (parseFloat(totalPrice) + parseFloat(this.calculateGSTAmount(totalPrice))).toFixed(2);
        return payableAmount;
    };

    // Handle tender button clicks
    handleTenderClick = (amount) => {
        this.setState((prevState) => {
            const newTenderAmount = prevState.tenderAmount + amount;
            const payableAmount = parseFloat(this.calculatePayableAmount(this.calculateTotalPrice()));
            const newChangeAmount = newTenderAmount - payableAmount;

            return {
                tenderAmount: newTenderAmount,
                changeAmount: newChangeAmount
                // changeAmount: newChangeAmount > 0 ? newChangeAmount : 0,  // Ensure change is non-negative
            };
        });
    };

    handlePrint = () => {
        try {
            if (!this.state.addedItems.length) {
                alert('No items to print!');
                return;
            }

            const billContent = `
                <div>
                <center class="h2 mb-3 fw-bold">Bill Receipt</center>
                    <div class="total-price"><span class='fw-bold'>Total Price:</span> $${this.calculateTotalPrice()}</div>
                    <div class="table">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Item</th>
                                    <th>Quantity</th>
                                    <th>Unit Price</th>
                                    <th>Total Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${this.state.addedItems.map((addedItem, index) => `
                                    <tr key="${index}">
                                        <td>${addedItem.itemName}</td>
                                        <td>${addedItem.quantity}</td>
                                        <td>$${addedItem.price}</td>
                                        <td>$${addedItem.totalPrice}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <div class="mt-3" style="border: 2px solid black;">
                            <p class="ps-3 pt-2 fw-bold">Change: $${this.state.changeAmount.toFixed(2)}</p>
                        </div>
                        <div class="row mt-3">
                            <div class="col">
                                <p class="ps-3 fw-bold">Amount</p>
                                <p class="ps-3 fw-bold">GST Amount</p>
                            </div>
                            <div class="col">
                                <p class="text-end pe-3 fw-bold">$${this.calculateTotalPrice()}</p>
                                <p class="text-end pe-3 fw-bold">$${this.calculateGSTAmount(this.calculateTotalPrice())}</p>
                            </div>
                        </div>
                        <div class="row">
                            <hr class="text-dark" />
                            <div class="col">
                                <p class="ps-3 text-danger fw-bold fs-5">Payable Amount</p>
                            </div>
                            <div class="col">
                                <p class="text-end pe-3 text-danger fw-bold fs-5">$${this.calculatePayableAmount(this.calculateTotalPrice())}</p>
                            </div>
                            <hr />
                        </div>
                        <div class="row">
                            <div class="col">
                                <p class="ps-3 fw-bold text-primary">Tender:</p>
                                <p class="ps-3 fw-bold text-primary">Change:</p>
                            </div>
                            <div class="col">
                                <p class="text-end pe-3 fw-bold text-primary">$${this.state.tenderAmount.toFixed(2)}</p>
                                <p class="text-end pe-3 fw-bold text-primary">$${this.state.changeAmount.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            const printWindow = window.open('', '_blank');
            if (!printWindow) {
                alert('Popup blocked! Please allow popups for this site.');
                console.log("popup blocked!");
                return;
            }

            printWindow.document.write(`
                <html>
                    <head>
                        <title>Print Bill</title>
                        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
                        <style>
                            body { font-family: Times New Roman', Times, serif; }
                            table { width: 100%; border-collapse: collapse; }
                            th, td { border: 1px solid black; padding: 8px; text-align: center; }
                        </style>
                    </head>
                    <body>
                        ${billContent}
                    </body>
                </html>
            `);
            printWindow.document.close();

            printWindow.onload = () => {
                console.log("print window!");
                printWindow.print();

                // Close the print window after printing or handle navigation if necessary
                printWindow.onafterprint = () => {
                    printWindow.close();
                };
            };
        } catch (error) {
            console.error('Error printing bill:', error);
            alert('An error occurred while trying to print. Please try again.');
        }
    }


    // Handle drop last row in table
    handleCancelItem = () => {
        this.setState((prevState) => {
            // Check if there are any items to remove
            if (prevState.addedItems.length === 0) return null;

            const updatedItems = prevState.addedItems.slice(0, -1); // Remove the last item

            return { addedItems: updatedItems }; // Return new state
        });
    }

    // Handle New Bill
    handleNewBill = () => {
        window.location.reload();
    }

    // Handle Scrollbar
    handleScrollUp = () => {
        this.snackListRef.current.scrollBy({ top: -100, behavior: 'smooth' });
    };

    handleScrollDown = () => {
        this.snackListRef.current.scrollBy({ top: 100, behavior: 'smooth' });
    };

    handleMouseDown = (e) => {
        this.setState({
            isDragging: true,
            startY: e.pageY - this.snackListRef.current.offsetTop,
            scrollTop: this.snackListRef.current.scrollTop,
        });
    };

    handleMouseMove = (e) => {
        if (!this.state.isDragging) return;

        const y = e.pageY - this.snackListRef.current.offsetTop;
        const walk = y - this.state.startY; // Calculate how much we have moved
        this.snackListRef.current.scrollTop = this.state.scrollTop - walk;
    };

    handleMouseUp = () => {
        this.setState({ isDragging: false });
    };

    // Handle add item click
    handleAddItem = (e) => {
        console.log("from Image click!");
        
        e.preventDefault();
        const { inventory } = this.props;
        const { selectedItem, quantity, addedItems } = this.state;
        // filter inventory items based on selected item
        const item = inventory.find(i => i.itemName === selectedItem);

        // console.log(`item: ${item.itemName}`);
        

        const currentDate = new Date().toLocaleDateString();
        if (item) {
            if (quantity <= item.Instock) {
                const totalPrice = item.price * quantity; // Calculate total price

                // find existing item in table & returns index
                const existingItemIndex = addedItems.findIndex(addedItem => addedItem.itemName === selectedItem);

                if (existingItemIndex !== -1) {
                    // Item already exists in the table, update quantity and total price
                    const updatedItems = [...addedItems];
                    const existingItem = updatedItems[existingItemIndex];
                    existingItem.quantity += Number(quantity);
                    console.log(existingItem);

                    existingItem.totalPrice += totalPrice;
                    existingItem.date = currentDate;

                    this.setState({
                        addedItems: updatedItems,
                        errorMessage: '',
                        selectedItem: '',
                        quantity: 1
                    });

                    this.props.updateStock({ itemName: selectedItem, quantity });
                
                } else {
                    // Item doesn't exist, add as a new row
                    this.setState(prevState => ({
                        addedItems: [...prevState.addedItems, { ...item, quantity, totalPrice }],
                        errorMessage: '',
                        selectedItem: '',
                        quantity: 1,
                        date: currentDate
                    }));

                    this.props.updateStock({ itemName: selectedItem, quantity });
                }

                // Dispatch action to change stock
                updateStock(selectedItem, quantity);
            } else {
                // Show error message for insufficient stock
                alert('Not enough Stock !!!')
                this.setState({ errorMessage: `Not enough stock for ${item.itemName}. Only ${item.Instock} left.` });
            }
        }
    };

    // Handle image click
    handleImageClick = (item) => {
        const { addedItems, quantity } = this.state;

        // Check if the item exists in the addedItems table
        const existingItemIndex = addedItems.findIndex(addedItem => addedItem.itemName === item.itemName);

        // Check if stock is available
        if (quantity <= item.Instock) {
            if (existingItemIndex !== -1) {
                // If the item already exists, update its quantity and total price
                const updatedItems = [...addedItems];
                const existingItem = updatedItems[existingItemIndex];
                existingItem.quantity += quantity;
                existingItem.totalPrice += existingItem.price * quantity; // Update total price
                existingItem.date = new Date().toLocaleString();

                this.setState({
                    addedItems: updatedItems,
                    errorMessage: '',
                });

                // Dispatch action to update stock
                this.props.updateStock({ itemName: item.itemName, quantity });
            } else {
                // If the item doesn't exist, add it as a new row
                const totalPrice = item.price * quantity; // Calculate total price
                const currentDate = new Date().toLocaleString();
                this.setState(prevState => ({
                    addedItems: [...prevState.addedItems, { ...item, quantity, totalPrice, date: currentDate }],
                    errorMessage: '',
                }));

                // Dispatch action to update stock
                this.props.updateStock({ itemName: item.itemName, quantity });

            }

            // Dispatch action to update stock
            this.props.updateStock(item.itemName, quantity);
        } else {
            // Show error message for insufficient stock
            alert('Not enough Stock !!!');
            this.setState({ errorMessage: `Not enough stock for ${item.itemName}. Only ${item.Instock} left.` });
        }
    };

    // Handle bill
    handleBill = () => {
        if (this.state.addedItems.length > 0) {
            const { addedItems } = this.state;

            // Dispatch each added item to the store
            addedItems.forEach(item => {
                this.props.addItem(item);
            });
            this.setState({
                displayBill: '',
            }, () => {
                // console.log(this.state.displayBill); 
                // console.log(this.state.displayTable);  
            });
        }
        else alert('Add Items in table !!!')
    };

    render() {
        const { inventory } = this.props;
        const { selectedItem, quantity, errorMessage, addedItems, displayBill, isDragging } = this.state;

        const drinkItems = inventory.filter(item => item.category === 'drink')
        const snackItems = inventory.filter(item => item.category === 'snack')

        return (
            <main className='vh-100 vw-100'>
                <div className="left-section d-flex flex-column justify-content-between" style={{ width: '35%' }}>
                    <div className="bill-section" >

                        <div className="left-start-section" style={{ display: displayBill ? '' : 'none' }}>
                            <div className="total-price"><span className='fw-bold'>Total Price:</span> ${(this.calculateTotalPrice())}</div>

                            <div className="table">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Item</th>
                                            <th>Quantity</th>
                                            <th>Unit Price</th>
                                            <th>Total Price</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {addedItems.map((addedItem, index) => (
                                            <tr key={index}>
                                                <td className='text-start'>{addedItem.itemName}</td>
                                                <td>{addedItem.quantity}</td>
                                                <td>${addedItem.price}</td>
                                                <td>${addedItem.totalPrice}</td>
                                            </tr>
                                        ))}

                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div style={{ display: displayBill }}>
                            <div className='' style={{ border: '2px solid black' }}><p className='ps-3 pt-2 fw-bold'>Change: $ {this.state.changeAmount.toFixed(2)}</p></div>
                            <div className="row">
                                <div className="col">
                                    <p className='ps-3 fw-bold'>Amount</p>
                                    <p className='ps-3 fw-bold'>GST Amount</p>
                                </div>
                                <div className="col">
                                    <p className='text-end pe-3 fw-bold'>$ {this.calculateTotalPrice()}</p>
                                    <p className='text-end pe-3 fw-bold'>$ {this.calculateGSTAmount(this.calculateTotalPrice())}</p>
                                </div>
                            </div>
                            <div className="row">
                                <hr className='text-dark' />
                                <div className="col">
                                    <p className='ps-3 text-danger fw-bold fs-5'>Payable Amount</p>
                                </div>
                                <div className="col">
                                    <p className='text-end pe-3 text-danger fw-bold fs-5'>$ {this.calculatePayableAmount(this.calculateTotalPrice())}</p>
                                </div>
                                <hr />
                            </div>
                            <div className="row">
                                <div className="col">
                                    <p className='ps-3 fw-bold text-primary'>Tender:</p>
                                    <p className='ps-3 fw-bold text-primary'>Change:</p>
                                </div>
                                <div className="col">
                                    <p className='text-end pe-3 fw-bold text-primary'>$ {this.state.tenderAmount.toFixed(2)}</p>
                                    <p className='text-end pe-3 fw-bold text-primary'>$ {this.state.changeAmount.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="left-end-section p-2">
                        <div className="left-end-top">
                            <form onSubmit={this.handleAddItem}>
                                <div>
                                    Item Name:

                                    <StyledAutocomplete
                                        options={inventory}
                                        getOptionLabel={(option) => option.itemName} // Specify how to display the item name
                                        onChange={this.handleSelectChange} // Handle the selection change
                                        renderInput={(params) => (
                                            <TextField {...params} label="Select an item" variant="outlined" required />
                                        )}
                                        filterSelectedOptions
                                        freeSolo // Allows free typing without selecting from dropdown
                                        disableClearable // Prevents clear button from showing
                                    />

                                </div>
                                <div>
                                    Quantity <br />
                                    <input
                                        type="number"
                                        value={quantity}
                                        onChange={this.handleQuantityChange}
                                        required
                                        min="1"
                                    />
                                </div>
                                <div><br />
                                    <button type="submit" id="add">Add</button>
                                </div>
                            </form>
                            {errorMessage && <div className="error">{errorMessage}</div>}
                        </div><br />
                        <div className="left-end-bottom">
                            <div className="left-end-bottom-start">
                                <div style={{ position: 'relative', bottom: '10px' }}>
                                    <button name="lang">Language</button>
                                    <div>
                                        <center>Table No</center>
                                        <input type="number" name="table-no" id="table-no" />
                                    </div>
                                    <div>
                                        <center>No of Cover</center>
                                        <input type="number" name="cover-nos" id="cover-nos" />
                                    </div>
                                </div>
                            </div>
                            <div className="left-end-bottom-center">
                                <div className="number-grid">
                                    {
                                        [7, 8, 9, 4, 5, 6, 1, 2, 3, 0].map((num) => (
                                            <button key={num} onClick={() => this.handleNumberClick(num.toString())}>{num}</button>
                                        ))
                                    }
                                    <button name="cal">.</button>
                                    <button name="cal">-</button>
                                </div>
                            </div>
                            <div className="left-end-bottom-end">
                                <div>
                                    <button name="ac" onClick={this.handleAC}>AC</button>
                                </div>
                                <div>
                                    <button name="clear" onClick={this.handleClear} className='ps-3'>Clear</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="right-section" style={{ width: '64%' }}>
                    <div className="right-top-section" style={{ height: '63%' }}>
                        <div className="sidebar m-2" style={{ width: '100px' }}>
                            {/* Static buttons for scrolling */}
                            <div className="scroll-buttons">
                                <button className="up-btn text-dark w-100" style={{ height: '50px' }} onClick={this.handleScrollUp}>
                                    <FaArrowUp />
                                </button>
                            </div>

                            {/* Scrollable snack items with drag-to-scroll functionality */}
                            <div
                                className="sidebar-nav"
                                ref={this.snackListRef}
                                style={{
                                    height: '350px',
                                    width: '100px',
                                    overflow: 'hidden', // Hide scrollbar
                                    cursor: isDragging ? 'grabbing' : 'grab', // Change cursor during dragging
                                }}
                                onMouseDown={this.handleMouseDown}
                                onMouseMove={this.handleMouseMove}
                                onMouseUp={this.handleMouseUp}
                                onMouseLeave={this.handleMouseUp} // Stop dragging if the mouse leaves the area
                            >
                                {
                                    snackItems.map((item) => (
                                        <button key={item.id} onClick={() => this.handleImageClick(item)} className='bg-primary text-light fw-bold ps-3 pt-3' style={{ marginLeft: '-20px', }}>
                                            <p>{item.itemName}</p>
                                        </button>
                                    ))
                                }
                            </div>

                            <div className="scroll-buttons">
                                <button className="down-btn text-dark w-100" style={{ height: '50px' }} onClick={this.handleScrollDown}>
                                    <FaArrowDown />
                                </button>
                            </div>
                        </div>
                        <div className="inventory" style={{ width: '87%' }}>
                            {drinkItems.map((item) => {

                                return (
                                    <button key={item.id} className='m-1' onClick={() => this.handleImageClick(item)} style={{ border: '2px solid blue', height: '100px' }}>
                                        <img src={item.image} alt={item.itemName} style={{ height: '70px', width: '150px' }} />

                                    </button>
                                );
                            })}

                        </div>
                    </div>

                    <div className="right-bottom-section" style={{ height: '35%' }}>
                        <div className="box1">
                            <button className="box1-btn1" onClick={this.handleNewBill}>New Bill</button>
                            <button className="box1-btn2">Price Amendment</button>
                        </div>
                        <div className="box2">
                            <button className="box2-btn1" onClick={() => this.handleTenderClick(2)}>$2</button>
                        </div>
                        <div className="box3">
                            <button className="box3-btn1" onClick={() => this.handleTenderClick(10)}>$10</button>
                        </div>
                        <div className="box4">
                            <button className="box4-btn1">Open Cash Box</button>
                            <button className="box4-btn2">Terminate Transaction</button>
                        </div>
                        <div className="box5">
                            <button className="box5-btn1">Goods Return</button>
                            <button className="box5-btn2" onClick={this.handlePrint}>Print</button>
                        </div>
                        <div className="box6">
                            <button className="box6-btn1" onClick={this.handleCancelItem}>Cancel Item</button>
                        </div>
                        <div className="box7">
                            <button className="box7-btn1">Add Item</button>
                        </div>
                        <div className="box8">
                            <button className="box8-btn1 d-flex gap-1" onClick={this.handleBill}>
                                <FaPlay className='mt-1' style={{ color: 'black' }} />Bill
                            </button>
                        </div>
                        <div className="box9">
                            <button className="box9-btn1" onClick={() => this.handleTenderClick(5)}>$5</button>
                        </div>
                        <div className="box10">
                            <button className="box10-btn1" onClick={() => this.handleTenderClick(50)}>$50</button>
                        </div>
                        <div className="box11">
                            <button className="box11-btn1">Gift Voucher</button>
                        </div>
                        <div className="box12">
                            <button className="box12-btn1">Reserved Transaction</button>
                            <button className="box12-btn2">Restore</button>
                        </div>
                        <div className="box13">
                            <button className="box13-btn1" onClick={() => this.setState({ addedItems: [] })}>Delete All Transaction</button>
                        </div>
                        <div className="box14">
                            <Link to='/'>
                                <button className="box14-btn1">Main Menu</button>
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

        )
    }
}
// Map Redux state to component props
const mapStateToProps = (state) => {

    return {
        inventory: state.inventory.items || [] // Make sure to access the items array
    };
};

// Connect the component to the Redux store and map the updateStock action
const mapDispatchToProps = { updateStock, addItem };

// Connect the component to the Redux store
export default connect(mapStateToProps, mapDispatchToProps)(Billing);
