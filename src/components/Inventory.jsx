

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';
import { MdHome } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { deleteItem } from '../redux/slices/InventorySlice';


const InventoryTable = () => {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.inventory.items);

  const [filter, setFilter] = useState('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const getFilteredItems = () => {
    const today = new Date();
    return items.filter((item) => {
      const dateAdded = new Date(item.dateAdded);
      let isDateInRange = true;
  
      // Check if "From" and "To" dates are set
      if (fromDate) {
        const from = new Date(fromDate);
        isDateInRange = dateAdded >= from;
      }
      if (toDate) {
        const to = new Date(toDate);
        isDateInRange = isDateInRange && dateAdded <= to;
      }
  
      // Apply the predefined filters based on the selected option
      switch (filter) {
        case 'today':
          return dateAdded.toDateString() === today.toDateString() && isDateInRange;
        case 'yesterday':
          const yesterday = new Date(today);
          yesterday.setDate(today.getDate() - 1);
          return dateAdded.toDateString() === yesterday.toDateString() && isDateInRange;
        case 'thisWeek':
          const startOfWeek = new Date(today);
          startOfWeek.setDate(today.getDate() - today.getDay());
          return dateAdded >= startOfWeek && dateAdded <= today && isDateInRange;
        case 'lastWeek':
          const startOfLastWeek = new Date(today);
          startOfLastWeek.setDate(today.getDate() - 7);
          const endOfLastWeek = new Date(today);
          endOfLastWeek.setDate(today.getDate() - today.getDay() - 1);
          return dateAdded >= startOfLastWeek && dateAdded <= endOfLastWeek && isDateInRange;
        case 'thisMonth':
          return dateAdded.getMonth() === today.getMonth() && dateAdded.getFullYear() === today.getFullYear() && isDateInRange;
        case 'lastMonth':
          const lastMonth = new Date(today);
          lastMonth.setMonth(today.getMonth() - 1);
          return dateAdded.getMonth() === lastMonth.getMonth() && dateAdded.getFullYear() === lastMonth.getFullYear() && isDateInRange;
        case 'all':
        default:
          return isDateInRange; // No filter applied, only check date range
      }
    });
  };
  

  const filteredItems = getFilteredItems();

  const handleDelete = (id) => {
    let confirmDelete = window.confirm("Are you surely want to delete?")
    if(confirmDelete){

      dispatch(deleteItem(id));
    }
  };

  const columns = [
    {
      name: 'S.No.',
      selector: (row, index) => index + 1,
      sortable: true,
    },
    {
      name: 'Item Name',
      selector: (row) => row.itemName,
      sortable: true,
    },
    {
      name: 'Price',
      selector: (row) => row.price,
      sortable: true,
    },
    {
      name: 'Purchased',
      selector: (row) => row.purchasedQuantity,
      sortable: true,
    },
    {
      name: 'Sold',
      selector: (row) => row.sold,
      sortable: true,
    },
    {
      name: 'In Stock',
      selector: (row) => row.Instock,
      sortable: true,
    },
    {
      name: 'Actions',
      cell: (row) => (
        <button onClick={() => handleDelete(row.id)} className="btn btn-danger">
          <MdDelete />
        </button>
      ),
    },
  ];

  const customStyles = {
    head: {
      style: {
        fontWeight: 'bold', 
        fontSize: '18px', 
        textAlign: 'center', 
      },
    },
    cells: {
      style: {
        fontSize: '14px', 
        padding: '20px', 
        
      },
    },
  };

  return (
    <div className='container-fluid vh-100 vw-100' style={{ backgroundColor: '#d1d1d1', overflow: 'scroll' }}>
      <div className="row w-100 pt-3">
        <div className="col">
          <div className="home-btn fs-4">
            <button className='bg-primary border-0'>
              <Link to='/' className='text-decoration-none text-light'><MdHome /></Link>
            </button>
          </div>
        </div>
        <div className="col">
          <h2 className='fw-bold fs-1'>Inventory</h2>
        </div>
      </div>

      <div className="filter-group d-flex align-items-center justify-content-center">
      <div className="mb-3 pe-4">
        <label htmlFor="filter">Filter by Date:</label>
        <select id="filter" value={filter} onChange={(e) => setFilter(e.target.value)} className="ms-2">
          <option value="all">All Date</option>
          <option value="today">Today</option>
          <option value="yesterday">Yesterday</option>
          <option value="thisWeek">This Week</option>
          <option value="lastWeek">Last Week</option>
          <option value="thisMonth">This Month</option>
          <option value="lastMonth">Last Month</option>
        </select>
      </div>

      <div className="mb-3 pe-4">
        <label htmlFor="fromDate">From:</label>
        <input
          type="date"
          id="fromDate"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="ms-2"
        />
      </div>

      <div className="mb-3 pe-4">
        <label htmlFor="toDate">To:</label>
        <input
          type="date"
          id="toDate"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className="ms-2"
        />
      </div>
      </div>

      <div className='float-end mb-2'>
        <Link to='/ItemRequest' className='text-decoration-none me-3 fs-5'>
        <button className='bg-primary text-light border-0 rounded-2'>
        Add Items</button></Link>
      </div>

      <DataTable
        columns={columns}
        data={filteredItems} // Use filtered items
        pagination
        highlightOnHover
        striped
        customStyles={customStyles}
      />
    </div>
  );
};

export default InventoryTable;


