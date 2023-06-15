import React, { useState } from 'react';
import axios from 'axios';

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
    <div>
      <h3>Add Vendor</h3>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" name="name" value={vendorData.name} onChange={handleInputChange} />
        </label>
        <label>
          Product/Service:
          <input
            type="text"
            name="product_service"
            value={vendorData.product_service}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Category:
          <input type="text" name="category" value={vendorData.category} onChange={handleInputChange} />
        </label>
        <label>
          Contact Person:
          <input
            type="text"
            name="contact_person"
            value={vendorData.contact_person}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Phone:
          <input type="text" name="phone" value={vendorData.phone} onChange={handleInputChange} />
        </label>
        <label>
          Email:
          <input type="text" name="email" value={vendorData.email} onChange={handleInputChange} />
        </label>
        <label>
          Address:
          <input type="text" name="address" value={vendorData.address} onChange={handleInputChange} />
        </label>
        <button type="submit">Add Vendor</button>
      </form>
    </div>
  );
};

export default AddVendorForm;
