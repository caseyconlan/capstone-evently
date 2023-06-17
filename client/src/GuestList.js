import React, { useContext, useState, useEffect } from 'react';
import {EventContext} from './EventContext.js';
import axios from 'axios';
import './App.css';

const GuestList = ({ eventId }) => {
  const {events, setEvents} = useContext(EventContext);
  const [guests, setGuests] = useState([]);
  const [guestTitle, setGuestTitle] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [rsvp, setRsvp] = useState('');

  useEffect(() => {
    fetchGuests();
  }, []);

  const fetchGuests = async () => {
    try {
      const response = await axios.get(`/api/events/${eventId}/guests`);
      if (Array.isArray(response.data.guests)) {
        setGuests(response.data.guests);
      } else {
        console.log('Error: server response is not an array');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddGuest = async () => {
    const newGuest = {
      guestTitle,
      firstName,
      lastName,
      address,
      city,
      state,
      zip,
      rsvp: rsvp === 'Yes'
    };

    try {
      const response = await axios.post(`/api/events/${eventId}/guests`, newGuest);
      setGuests([...guests, response.data.guest]);
      clearGuestForm();
    } catch (error) {
      console.error(error);
    }
  };

  const clearGuestForm = () => {
    setGuestTitle('');
    setFirstName('');
    setLastName('');
    setAddress('');
    setCity('');
    setState('');
    setZip('');
    setRsvp('');
  };

  return (
    <div className="guest-list">
      <div className="add-guest-container">
        <h3>Add Guest</h3>
        <label>Title:</label>
        <input className="vendor-input" type="text" value={guestTitle} onChange={(e) => setGuestTitle(e.target.value)} />
        <label>First Name:</label>
        <input className="vendor-input" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        <label>Last Name:</label>
        <input className="vendor-input" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
        <label>Address:</label>
        <input className="vendor-input" type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
        <label>City:</label>
        <input className="vendor-input" type="text" value={city} onChange={(e) => setCity(e.target.value)} />
        <label>State:</label>
        <input className="vendor-input" type="text" value={state} onChange={(e) => setState(e.target.value)} />
        <label>Zip:</label>
        <input className="vendor-input" type="text" value={zip} onChange={(e) => setZip(e.target.value)} />
        <label>RSVP:</label>
        <input className="vendor-input" type="text" value={rsvp} onChange={(e) => setRsvp(e.target.value)} />
        <button className="add-guest-button" onClick={handleAddGuest}>Add Guest</button>
      </div>
      <div>
        <h3>Guests</h3>
        <table className="guest-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Address</th>
              <th>City</th>
              <th>State</th>
              <th>Zip</th>
              <th>RSVP</th>
            </tr>
          </thead>
          <tbody>
            {guests.map((guest) => (
              <tr key={guest.id}>
                <td>{guest.guest_title}</td>
                <td>{guest.first_name}</td>
                <td>{guest.last_name}</td>
                <td>{guest.address}</td>
                <td>{guest.city}</td>
                <td>{guest.state}</td>
                <td>{guest.zip}</td>
                <td>{guest.rsvp ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GuestList;