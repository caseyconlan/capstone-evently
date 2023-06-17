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
  const [eventName, setEventName] = useState('');
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
      const response = await axios.get(`/api/events/${id}`);
      setEvent(response.data.event);
      setEventName(response.data.event.name);
      setEventDate(response.data.event.date); // Set the event date state
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
      await axios.put(`/api/events/${eventId}`, { name: editedEventName, date: eventDate });
      fetchEventDetails();
      setEditEventId(null);
      setEditedEventName('');
      setEventDate(eventDate); // Update the event date state
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

  return (
    <div>
      <h1>{event.name}</h1>
      <p>Date: {event.date}</p>
      <p>Countdown: {countdown}</p>
      <button className="add-event-button" onClick={handleHomeClick}>
        Home
      </button>
      <h2>Event ID: {id}</h2>
      <div>
        <h3>Event Date</h3>
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
              <span>{eventDate}</span>
            ) : (
              <span>No event date set</span>
            )}
            <button onClick={() => handleEditEvent(event.id, event.name)}>Edit</button>
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
