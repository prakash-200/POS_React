import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addItem } from '../redux/slices/InventorySlice';
import { Link, useNavigate } from 'react-router-dom';
import { MdHome } from "react-icons/md";

const ItemForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    itemName: '',
    price: '',
    purchasedQuantity: '',
    stock: '',
    category: 'snack',
    image: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === 'category' && value === 'snack') {
      setFormData((prevData) => ({
        ...prevData,
        image: null,
      }));
    }
  };

  const handleImageUpload = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      image: e.target.files[0],
    }));
  };

  // Function to convert image to base64
  const handleImageConversion = (imageFile, callback) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      callback(reader.result); // Base64-encoded image data
    };
    reader.readAsDataURL(imageFile);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.image) {
      handleImageConversion(formData.image, (base64Image) => {
        // Dispatch the formData with base64-encoded image
        dispatch(addItem({
          itemName: formData.itemName,
          price: formData.price,
          purchasedQuantity: formData.purchasedQuantity,
          sold: formData.sold,
          Instock: formData.purchasedQuantity - formData.sold,
          category: formData.category,
          image: base64Image, // Store base64-encoded image
        }));

        setFormData({
          itemName: '',
          price: '',
          purchasedQuantity: '',
          stock: '',
          category: 'snack',
          image: null,
        });

        navigate('/Inventory');
      });
    } else {
      // If no image, dispatch the formData without the image
      dispatch(addItem({
        itemName: formData.itemName,
        price: formData.price,
        purchasedQuantity: formData.purchasedQuantity,
        sold: formData.sold,
        Instock: formData.purchasedQuantity - formData.sold,
        category: formData.category,
        image: null,
      }));

      setFormData({
        itemName: '',
        price: '',
        purchasedQuantity: '',
        stock: '',
        category: 'snack',
        image: null,
      });

      navigate('/Inventory');
    }
  };

  return (
    <div className="contaier-fluid vh-100 vw-100 d-flex flex-column align-items-center" style={{ backgroundColor: "#d1d1d1" }}>
      <div className="home-btn w-100 ms-5 mt-3 fs-4">
        <button className='bg-primary border-0'>
          <Link to='/' className='text-decoration-none text-light'><MdHome />
          </Link>
        </button>
      </div>
      <h1 className='mb-4'>Add Inventory Item</h1>
      <form className='w-50 d-flex flex-column align-items-center' onSubmit={handleSubmit}>
        <div>
          <label className='fw-bold'>Item Name:</label><br />
          <input
            type="text"
            name="itemName"
            value={formData.itemName}
            onChange={handleChange}
            required
            className='form-control ps-2'
            placeholder='Enter Item Name'
            style={{ height: "40px", width: "400px" }}
          />
        </div>
        <div>
          <label className='mt-3 fw-bold'>Price:</label><br />
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            className='form-control ps-2'
            placeholder='Enter Item Price'
            style={{ height: "40px", width: "400px" }}
          />
        </div>
        <div>
          <label className='mt-3 fw-bold'>Purchased Quantity:</label><br />
          <input
            type="number"
            name="purchasedQuantity"
            value={formData.purchasedQuantity}
            onChange={handleChange}
            required
            className='form-control ps-2'
            placeholder='Enter Purchased Quantity'
            style={{ height: "40px", width: "400px" }}
          />
        </div>
        <div>
          <label className='mt-3 fw-bold'>Sold:</label><br />
          <input
            type="number"
            name="sold"
            value={formData.sold}
            onChange={handleChange}
            required
            className='form-control ps-2'
            placeholder='Enter Stock'
            style={{ height: "40px", width: "400px" }}
          />
        </div>
        <div>
          <label className='mt-3 fw-bold'>Category:</label><br />
          <select name="category" className='form-control ' value={formData.category} onChange={handleChange}
            style={{ height: "40px", width: "400px" }}>
            <option value="snack">Snack</option>
            <option value="drink">Drink</option>
          </select>
        </div>
        {formData.category === 'drink' && (
          <div>
            <label className='mt-3'>Upload Image:</label><br />
            <input type="file" accept="image/*" onChange={handleImageUpload} required/>
          </div>
        )}
        <div className="btn-grp w-50 d-flex justify-content-between">
          <button className='mt-3 bg-danger me-2 border-0 rounded-3' style={{ height: '40px', width: '70px' }} type="cancel">
            <Link to='/' className='text-decoration-none text-light'>Cancel</Link>
          </button>
          <button className='mt-3 bg-primary text-light border-0 rounded-3' style={{ height: '40px', width: '70px' }} type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default ItemForm;
