import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const AddVendorForm = ({ eventId, onVendorAdded }) => {
  const [vendorData, setVendorData] = useState({
    name: '',
    product_service: '',
    category: '',
    contact_person: '',
    phone: '',
    email: '',
    address: ''
  });

  const handleInputChange = (e) => {
    setVendorData({ ...vendorData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`/api/events/${eventId}/vendors`, vendorData);
      onVendorAdded(response.data.vendor);
      setVendorData({
        name: '',
        product_service: '',
        category: '',
        contact_person: '',
        phone: '',
        email: '',
        address: ''
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="add-guest-container">
      <h1>Add Vendor</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input className="login-field" type="text" name="name" value={vendorData.name} onChange={handleInputChange} />
        </label>
        <label>
          Product/Service:
          <input className="login-field"
            type="text"
            name="product_service"
            value={vendorData.product_service}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Category:
          <select className="login-field" name="category" value={vendorData.category} onChange={handleInputChange}>
            <option value="">Select a category</option>
            <option value="Attire">Attire</option>
            <option value="Marketing">Mktg</option>
            <option value="Cleanup">Cleanup</option>
            <option value="Communications">Comm</option>
            <option value="Decorations">Decor</option>
            <option value="Entertainment">Entm't</option>
            <option value="Equipment">Equip</option>
            <option value="Favors">Favors</option>
            <option value="Food">Food</option>
            <option value="Flowers">Flowers</option>
            <option value="Music">Music</option>
            <option value="Photography">Photo</option>
            <option value="Prizes">Prizes</option>
            <option value="Stationary">Stationary</option>
            <option value="Transportation">Transport</option>
            <option value="Venue">Venue</option>
            <option value="Videography">Video</option>
            <option value="Other">Other</option>
          </select>
        </label>
        <label>
          Contact Person:
          <input className="login-field"
            type="text"
            name="contact_person"
            value={vendorData.contact_person}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Phone:
          <input className="login-field" type="text" name="phone" value={vendorData.phone} onChange={handleInputChange} />
        </label>
        <label>
          Email:
          <input className="login-field" type="text" name="email" value={vendorData.email} onChange={handleInputChange} />
        </label>
        <label>
          Address:
          <input className="login-field" type="text" name="address" value={vendorData.address} onChange={handleInputChange} />
        </label>
        <button className="add-vendor-button" type="submit">Add Vendor</button>
      </form>
    </div>
  );
};

export default AddVendorForm;