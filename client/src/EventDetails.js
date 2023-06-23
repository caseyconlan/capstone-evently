import React, { useContext, useState, useEffect } from 'react';
import { EventContext } from './EventContext.js';
import { useParams, Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import VendorList from './VendorList';
import Budget from './Budget';
import GuestList from './GuestList';

const EventDetails = () => {
  const { events, setEvents } = useContext(EventContext);
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [editEventId, setEditEventId] = useState(null);
  const [editedEventName, setEditedEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [countdown, setCountdown] = useState('');

  const history = useHistory();

  const handleHomeClick = () => {
    history.push('/'); // Replace '/' with the path to your home page
  };

  useEffect(() => {
    fetchEventDetails();
  }, []);

  useEffect(() => {
    calculateCountdown();
  }, [eventDate]);

  const fetchEventDetails = async () => {
    try {
      const eventResponse = await axios.get(`/api/events/${id}`);
      const dateResponse = await axios.get(`/api/events/${id}/date`);
      setEvent(eventResponse.data.event);
      setEventDate(dateResponse.data.date); // Set the event date state
    } catch (error) {
      console.error(error);
    }
  };  

  const handleEditEvent = (eventId, eventName) => {
    setEditEventId(eventId);
    setEditedEventName(eventName);
  };

  const handleSaveEdit = async (eventId) => {
    try {
      await axios.put(`/api/events/${eventId}/date`, { date: eventDate });
      fetchEventDetails();
      setEditEventId(null);
      setEditedEventName('');
    } catch (error) {
      console.error(error);
    }
  };  

  const handleCancelEdit = () => {
    setEditEventId(null);
    setEditedEventName('');
  };

  const calculateCountdown = () => {
    if (eventDate) {
      const eventDateTime = new Date(eventDate).getTime();
      const now = new Date().getTime();
      const difference = eventDateTime - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        setCountdown(`${days} days to go!`);
      } else {
        setCountdown('Event date has passed');
      }
    } else {
      setCountdown('No event date set');
    }
  };

  if (!event) {
    return <div>Loading...</div>;
  }

  const formattedDate = eventDate ? eventDate.split('T')[0] : '';

  return (
    <div className="event-details">
      <h1 className="event-title">{event.name}</h1>
      {formattedDate && <h1>Date: {formattedDate}</h1>}
      <h1>Countdown: {countdown}</h1>
      <Link to="/" className="add-event-button">Home</Link>
      <h2 className="event-text">Event ID: {id}</h2>
      <div className="event-date">
        <h1>Event Date</h1>
        {editEventId === event.id ? (
          <div>
            <input
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
            />
            <button className="button-primary" onClick={() => handleSaveEdit(event.id)}>Save</button>
            <button className="button-primary" onClick={handleCancelEdit}>Cancel</button>
          </div>
        ) : (
          <div>
            {eventDate ? (
              <span>{formattedDate}</span>
            ) : (
              <span>No event date set</span>
            )}
            <button className="button-primary" onClick={() => handleEditEvent(event.id, event.name)}>Edit</button>
          </div>
        )}
      </div>
      {/* Render other event details */}
      <Budget eventId={id} />
      <VendorList eventId={id} />
      <GuestList eventId={id} />
    </div>
  );
};

export default EventDetails;