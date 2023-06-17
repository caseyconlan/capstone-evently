import React, { useContext, useState, useEffect } from 'react';
import {EventContext} from './EventContext.js';
import axios from 'axios';
import AddVendorForm from './AddVendorForm';
import './App.css';

const VendorList = ({ eventId }) => {
  const {events, setEvents} = useContext(EventContext);
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    const storedVendors = sessionStorage.getItem('vendors');
    if (storedVendors) {
      setVendors(JSON.parse(storedVendors));
    } else {
      fetchVendors();
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem('vendors', JSON.stringify(vendors));
  }, [vendors]);

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

  const handleVendorAdded = (vendor) => {
    setVendors([...vendors, vendor]);
  };

  return (
    <div className="vendor-list">
      <AddVendorForm eventId={eventId} onVendorAdded={handleVendorAdded} />
      {vendors.map((vendor) => (
        <div className="vendor-tile" key={vendor.id}>
          <h3 className="vendor-name">{vendor.name}</h3>
          <p>Product/Service: {vendor.product_service}</p>
          <p>Category: {vendor.category}</p>
          <p>Contact Person: {vendor.contact_person}</p>
          <p>Phone: {vendor.phone}</p>
          <p>Email: {vendor.email}</p>
          <p>Address: {vendor.address}</p>
        </div>
      ))}
    </div>
  );
};

export default VendorList;