import React, { useState, useEffect } from 'react';
import { useParams, Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import VendorList from './VendorList';
import Budget from './Budget';
import GuestList from './GuestList';

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const history = useHistory();

  const handleHomeClick = () => {
    history.push('/'); // Replace '/' with the path to your home page
  };

  useEffect(() => {
    fetchEventDetails();
  }, []);

  const fetchEventDetails = async () => {
    try {
      const response = await axios.get(`/api/events/${id}`);
      setEvent(response.data.event);
    } catch (error) {
      console.error(error);
    }
  };

  if (!event) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{event.name}</h1>
      <button className="add-event-button" onClick={handleHomeClick}>Home</button>
      <h2>Event ID: {id}</h2>
      {/* Render other event details */}
      <Budget eventId={id} />
      <VendorList eventId={id} />
      <GuestList eventId={id} />
    </div>
  );
};


export default EventDetails;
