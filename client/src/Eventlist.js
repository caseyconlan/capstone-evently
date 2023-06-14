import React, { useEffect, useState } from 'react';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [eventName, setEventName] = useState('');

  useEffect(() => {
    // Fetch the list of events from the server or API
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events');
        const data = await response.json();
        setEvents(data.events);
      } catch (error) {
        console.log(error);
      }
    };

    fetchEvents();
  }, []);

  const handleEventNameChange = (e) => {
    setEventName(e.target.value);
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    console.log('Add Event button clicked');

    try {
      // Send a POST request to the server to create a new event
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: eventName }),
      });

      if (response.ok) {
        // Fetch the updated list of events after successfully adding the new event
        const updatedResponse = await fetch('/api/events');
        const data = await updatedResponse.json();
        setEvents(data.events);
        setEventName('');
      } else {
        console.log('Failed to add event');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h1>Event List</h1>
      <ul>
        {events.map((event) => (
          <li key={event.id}>{event.name}</li>
        ))}
      </ul>
      <form onSubmit={handleAddEvent}>
        <input
          type="text"
          value={eventName}
          onChange={handleEventNameChange}
          placeholder="Event Name"
        />
        <button type="submit">Add Event</button>
      </form>
    </div>
  );
};

export default EventList;
