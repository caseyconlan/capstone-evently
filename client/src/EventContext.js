import React, { createContext, useState } from 'react';

// Create the EventContext
export const EventContext = createContext();

// Create the EventProvider component
export const EventProvider = ({ children }) => {
    // Define the shared state and update function
    const [events, setEvents] = useState([]);
  
    return (
      <EventContext.Provider value={[events, setEvents]}>
        {children}
      </EventContext.Provider>
    );
  };
  
