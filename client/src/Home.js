import React from 'react';
import EventList from './EventList';
import Directory from './Directory';
import { Link } from 'react-router-dom';
import './App.css';

const Home = () => {
  return (
    <div className="route-links-container">
      <div className="route-links">
        <Link className="nav-links" to="/directory">Directory</Link>
        <Link className="nav-links" to="/bookkeeping">Bookkeeping</Link>
        <Link className="nav-links" to="/todolist">To Do List</Link> 
        <Link className="nav-links" to="/archived-events">Archived Events</Link>
      </div>
      <div className="home-container">
        <h1>Welcome to Eventable!</h1>
        <h2>Events</h2>
        <EventList />
      </div>
    </div>
  );
};

export default Home;
