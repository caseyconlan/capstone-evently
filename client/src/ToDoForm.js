import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import EventList from './EventList'; 

const ToDoForm = ({ todoItems }) => {
  const { eventId } = useParams();
  const [selectedEvent, setSelectedEvent] = useState(eventId);
  const [selectedToDo, setSelectedToDo] = useState('');
  const [toDoItems, setToDoItems] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newToDoItem = {
      event: selectedEvent,
      toDo: selectedToDo,
    };

    setToDoItems([...toDoItems, newToDoItem]);

    setSelectedEvent(eventId);
    setSelectedToDo('');
  };

  return (
    <div>
      <h2>Add To-Do Item</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="event">Event:</label>
        <select
          id="event"
          value={selectedEvent}
          onChange={(e) => setSelectedEvent(e.target.value)}
        >
          <option value="">Select an event</option>
          {EventList.map((event) => (
            <option key={event.id} value={event.id}>
              {event.name}
            </option>
          ))}
        </select>

        <label htmlFor="toDo">To-Do Item:</label>
        <select
          id="toDo"
          value={selectedToDo}
          onChange={(e) => setSelectedToDo(e.target.value)}
        >
          <option value="">Select a to-do item</option>
          {todoItems.map((item, index) => (
            <option key={index} value={item}>
              {item}
            </option>
          ))}
        </select>

        <button type="submit">Add</button>
      </form>

      <h2>Selected To-Do Items</h2>
      <table>
        <thead>
          <tr>
            <th>Event</th>
            <th>To-Do Item</th>
          </tr>
        </thead>
        <tbody>
          {toDoItems.map((item, index) => (
            <tr key={index}>
              <td>{item.event}</td>
              <td>{item.toDo}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ToDoForm;
