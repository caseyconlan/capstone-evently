import React from 'react';
import EventList from './EventList';
import './App.css';

const Home = () => {
  return (
    <div className="home-container">
      <h1>Welcome to the Event Planner App!</h1>
      <h2>Events</h2>
      <EventList />
    </div>
  );
};

export default Home;
