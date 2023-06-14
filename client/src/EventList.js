import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [eventName, setEventName] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('/api/events');
      if (Array.isArray(response.data.events)) {
        setEvents(response.data.events);
      } else {
        console.log('Error: server response is not an array');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const addEvent = async () => {
    try {
      await axios.post('/api/events', { name: eventName });
      fetchEvents();
      setEventName('');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {events.map((event) => (
        <div key={event.id}>
          <span>{event.name}</span>
        </div>
      ))}
      <input value={eventName} onChange={(e) => setEventName(e.target.value)} />
      <button onClick={addEvent}>Add Event</button>
    </div>
  );
};

export default EventList;
