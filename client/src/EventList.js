import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [eventName, setEventName] = useState('');
  const [editEventId, setEditEventId] = useState(null);
  const [editedEventName, setEditedEventName] = useState('');

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

  const handleEditEvent = (eventId, eventName) => {
    setEditEventId(eventId);
    setEditedEventName(eventName);
  };

  const handleSaveEdit = async (eventId) => {
    try {
      await axios.put(`/api/events/${eventId}`, { name: editedEventName });
      fetchEvents();
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

  const handleDeleteEvent = async (eventId) => {
    try {
      await axios.delete(`/api/events/${eventId}`);
      fetchEvents();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="event-list">
      {events.map((event) => (
        <div key={event.id} className="event-tile">
          {editEventId === event.id ? (
            <div className="edit-event">
              <input
                className="event-input"
                type="text"
                value={editedEventName}
                onChange={(e) => setEditedEventName(e.target.value)}
              />
              <button className="save-event-button" onClick={() => handleSaveEdit(event.id)}>
                Save
              </button>
              <button className="cancel-event-button" onClick={handleCancelEdit}>
                Cancel
              </button>
            </div>
          ) : (
            <>
              <Link to={`/events/${event.id}`}>
                <span className="event-name">{event.name}</span>
              </Link>
              <div className="event-actions">
                <button className="edit-event-button" onClick={() => handleEditEvent(event.id, event.name)}>
                  Edit Event Name
                </button>
                <button className="delete-event-button" onClick={() => handleDeleteEvent(event.id)}>
                  Delete Event
                </button>
              </div>
            </>
          )}
        </div>
      ))}
      <div className="add-event">
        <input
          className="event-input"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
        />
        <button className="add-event-button" onClick={addEvent}>
          Add Event
        </button>
      </div>
    </div>
  );
};

export default EventList;
