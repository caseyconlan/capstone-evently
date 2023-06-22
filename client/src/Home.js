import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import EventList from './EventList';
import './App.css';

const Home = () => {
  const { loggedIn, logout } = useContext(AuthContext);

  const handleLogout = () => {
    // Perform any additional logout logic if needed
    logout();
  };

  return (
    <div className="route-links-container">
      <div className="route-links">
        <Link className="nav-links" to="/directory">Directory</Link>
        <Link className="nav-links" to="/bookkeeping">Bookkeeping</Link>
        <Link className="nav-links" to="/todolist">To Do List</Link> 
        <Link className="nav-links" to="/archived-events">Archived Events</Link>
        {loggedIn && (
          <button className="nav-links" onClick={handleLogout}>
            Logout
          </button>
        )}
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
