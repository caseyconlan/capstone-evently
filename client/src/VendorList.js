import React, { useState, useEffect } from 'react';
import axios from 'axios';

const VendorList = ({ eventId }) => {
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const response = await axios.get(`/api/events/${eventId}/vendors`);
      if (Array.isArray(response.data.vendors)) {
        setVendors(response.data.vendors);
      } else {
        console.log('Error: server response is not an array');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const renderVendorList = () => {
    return vendors.map((vendor) => (
      <div key={vendor.id}>
        <h3>{vendor.name}</h3>
        <p>Product/Service: {vendor.product_service}</p>
        <p>Category: {vendor.category}</p>
        <p>Contact Person: {vendor.contact_person}</p>
        <p>Phone: {vendor.phone}</p>
        <p>Email: {vendor.email}</p>
        <p>Address: {vendor.address}</p>
      </div>
    ));
  };

  return (
    <div>
      <h2>Vendor List</h2>
      {renderVendorList()}
    </div>
  );
};

export default VendorList;
