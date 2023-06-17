import React from 'react';
import EventList from './EventList';
import VendorList from './VendorList';
import { Link } from 'react-router-dom';
import './App.css';

const Home = () => {
  return (
    <div className="route-links-container"> {/* Separate container for the route links */}
      <h2>Navigation</h2>
      <div className="route-links">
        <Link to="/vendors">Vendor List</Link>
        {/* Add any other route links you want to display */}
      </div>
      <div className="home-container">
        <h1>Welcome to the Event Planner App!</h1>
        <h2>Events</h2>
        <EventList />
      </div>
    </div>
  );
};

export default Home;
