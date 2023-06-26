import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ArchivedGuestList = ({ eventId }) => {
  const [guests, setGuests] = useState([]);

  useEffect(() => {
    fetchGuests();
  }, []);

  const fetchGuests = async () => {
    try {
      const response = await axios.get(`/api/events/archived/${eventId}/guests`);
      if (Array.isArray(response.data.guests)) {
        setGuests(response.data.guests);
      } else {
        console.log('Error: server response is not an array');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="archived-guest-list">
      <h2>Archived Guests</h2>
      {guests.map((guest) => (
        <div className="archived-guest-tile" key={guest.id}>
          {/* Display guest information */}
        </div>
      ))}
    </div>
  );
};

export default ArchivedGuestList;
