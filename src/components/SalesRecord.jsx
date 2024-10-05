import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import DataTable from 'react-data-table-component';

const SalesRecord = () => {
    const addedItems = useSelector(state => state.addedItems.items);
    const [filter, setFilter] = useState('all'); // State for filter selection

    // Function to filter added items based on selected filter
    const filterItems = (items, filter) => {
        const currentDate = new Date();
        return items.filter(item => {
            const itemDate = new Date(item.date);
            const dayDifference = Math.floor((currentDate - itemDate) / (1000 * 60 * 60 * 24));

            switch (filter) {
                case 'today':
                    return dayDifference === 0;
                case 'yesterday':
                    return dayDifference === 1;
                case 'thisWeek':
                    return itemDate.getTime() >= (currentDate.setDate(currentDate.getDate() - currentDate.getDay()));
                case 'lastWeek':
                    return itemDate.getTime() < (currentDate.setDate(currentDate.getDate() - currentDate.getDay())) && 
                           itemDate.getTime() >= (currentDate.setDate(currentDate.getDate() - 7));
                case 'previousWeek':
                    return itemDate.getTime() < (currentDate.setDate(currentDate.getDate() - 7)) && 
                           itemDate.getTime() >= (currentDate.setDate(currentDate.getDate() - 14));
                case 'all':
                default:
                    return true;
            }
        });
    };

    const filteredItems = filterItems(addedItems, filter); // Apply filter to added items

    const columns = [
        {
            name: 'Item Name',
            selector: row => row.itemName,
            sortable: true,
        },
        {
            name: 'Quantity',
            selector: row => row.quantity,
            sortable: true,
        },
        {
            name: 'Price',
            selector: row => row.price,
            sortable: true,
        },
        {
            name: 'Total Price',
            selector: row => row.totalPrice,
            sortable: true,
        },
    ];

    return (
        <div>
            <h2 className='text-center fw-bold pt-2'>Sales Record</h2>

            {/* Dropdown for filtering */}
         <div className="row mb-3 d-flex justify-content-center">

                <div className="col col-lg-2 col-sm-4 d-flex">
                <label htmlFor="filter" className="form-label text-end w-100 pt-2">Filter by Date:</label>
                <select id="filter" className="form-select" style={{ }} value={filter} onChange={(e) => setFilter(e.target.value)}>
                    <option value="all">All Dates</option>
                    <option value="today">Today</option>
                    <option value="yesterday">Yesterday</option>
                    <option value="thisWeek">This Week</option>
                    <option value="lastWeek">Last Week</option>
                    <option value="previousWeek">Previous Week</option>
                </select>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={filteredItems}
                pagination
                paginationPerPage={10} // Show 10 entries per page
                highlightOnHover
                striped
            />
        </div>
    );
};

export default SalesRecord;
