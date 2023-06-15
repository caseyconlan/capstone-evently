import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import VendorList from './VendorList';
import Budget from './Budget';

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);

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
      <h2>Event ID: {id}</h2>
      {/* Render other event details */}
      <VendorList eventId={id} />
      <Budget eventId={id} />
    </div>
  );
};

export default EventDetails;
