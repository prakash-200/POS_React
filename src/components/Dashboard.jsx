import React from 'react'
import { Link } from 'react-router-dom'

function Dashboard() {
  return (
    <div className="vh-100 vw-100" style={{ backgroundColor: "#D1D1D1" }}>
        <h1 className='text-center pt-3'>Main Menu</h1>
        <div className="services m-5 pt-5">
            <div className="row row-12 mb-3 ms-1 d-flex">
            <div className="box text-light fs-4 fw-medium me-3" style={{height: "150px", width: "300px", backgroundColor: "#337AB7"}}>
            <Link className='text-light text-decoration-none h-100 w-100 d-flex align-items-center justify-content-center' to='/Billing'>Billing</Link>
            </div>
            <div className="box text-light fs-4 fw-medium me-3" style={{height: "150px", width: "300px", backgroundColor: "#337AB7"}}>
              <Link className='text-light text-decoration-none h-100 w-100 d-flex align-items-center justify-content-center' to='/Inventory'>Inventory</Link>
            </div>
            <div className="box fs-4 fw-medium " style={{height: "150px", width: "300px", backgroundColor: "#337AB7"}}>
              <Link className='text-light text-decoration-none h-100 w-100 d-flex align-items-center justify-content-center' to='/ItemRequest'>Item Request</Link>
            </div>
            </div>
            <div className="row float-start">
              <Link className='text-light text-decoration-none h-100 w-100 d-flex align-items-center justify-content-center' to='/record' >
            <div className="box text-light fs-4 fw-medium d-flex align-items-center justify-content-center" style={{height: "150px", width: "300px", backgroundColor: "#337AB7"}}>Sales Report</div>
              </Link>
            </div>
        </div>
    </div>
  )
}

export default Dashboard