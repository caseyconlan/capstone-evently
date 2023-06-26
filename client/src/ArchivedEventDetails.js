// ArchivedEventDetails.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

const ArchivedEventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const eventResponse = await axios.get(`/api/events/archived/${id}`);
        console.log(eventResponse.data);
        setEvent(eventResponse.data.event);
      } catch (error) {
        console.error(error);
        setError("There was an error fetching the event data. Please try again.");
      }
    };
    fetchEventDetails();
  }, [id]);

  if (error) {
    return <div>{error}</div>
  }

  if (!event) {
    return <div>Loading...</div>;
  }

  const formattedDate = event.date ? new Date(event.date).toISOString().split('T')[0] : '';

  return (
    <div className="event-details">
      <h1 className="event-title">{event.name}</h1>
      <h2 className="event-text">Event ID: {id}</h2>
      <h1>Date: {formattedDate}</h1>
      <h2 className="event-text">Budget: ${event.target_budget}</h2>
      <h2 className="event-text">Archive Date: {event.date_archived}</h2>
      {event.guests && event.guests.length > 0 && (
        <h2 className="event-text">
          Guests:
          {event.guests.map(guest => <p key={guest.id}>{guest.name}</p>)}
        </h2>
      )}
      {event.vendors && event.vendors.length > 0 && (
        <h2 className="event-text">
          Vendors:
          {event.vendors.map(vendor => <p key={vendor.id}>{vendor.name}</p>)}
        </h2>
      )}
      <Link to="/archived-events" className="add-event-button">Back to Archived Events</Link>
    </div>
  );
};

export default ArchivedEventDetails;
