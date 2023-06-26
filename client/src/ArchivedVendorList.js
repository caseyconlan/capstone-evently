import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ArchivedVendorList = ({ eventId }) => {
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const response = await axios.get(`/api/events/archived/${eventId}/vendors`);
      if (Array.isArray(response.data.vendors)) {
        setVendors(response.data.vendors);
      } else {
        console.log('Error: server response is not an array');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="archived-vendor-list">
      <h2>Archived Vendors</h2>
      {vendors.map((vendor) => (
        <div className="archived-vendor-tile" key={vendor.id}>
          {/* Display vendor information */}
        </div>
      ))}
    </div>
  );
};

export default ArchivedVendorList;
