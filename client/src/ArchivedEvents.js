import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';


const ArchivedEvents = () => {
  const [archivedEvents, setArchivedEvents] = useState([]);

  useEffect(() => {
    const fetchArchivedEvents = async () => {
      try {
        const response = await axios.get('/api/events/archived');
        const fetchedArchivedEvents = response.data.events || []; // Handle undefined or empty array
        console.log('Fetched Archived Events:', fetchedArchivedEvents);
        setArchivedEvents(fetchedArchivedEvents);
        sessionStorage.setItem('archivedEvents', JSON.stringify(fetchedArchivedEvents));
      } catch (error) {
        console.error(error);
      }
    };

    fetchArchivedEvents();
  }, []);

  console.log('Rendered Archived Events:', archivedEvents);

  if (archivedEvents.length === 0) {
    return <div className="archived-events">No archived events found.</div>; // Return a message when no archived events are available
  }

  return (
    <div className="archived-events">
      <h1 className="todo-title">Archived Events</h1>
      {archivedEvents.map((event) => (
        <div key={event.id} className="archived-event-tile">
          <Link to={`/archived-events/${event.id}`}>
            <span className="event-name">{event.name}</span>
          </Link>
        </div>
      ))}
      <Link to="/" className="add-event-button">Home</Link>
    </div>
  );
};

export default ArchivedEvents;
