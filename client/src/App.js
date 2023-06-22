import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Directory from './Directory';
import GuestList from './GuestList';
import EventDetails from './EventDetails';
import Bookkeeping from './Bookkeeping';
import ToDoList from './ToDoList';
import ArchivedEvents from './ArchivedEvents';
import { EventProvider } from './EventContext';
import './App.css';

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
      setLoggedIn(true);
    }

  }, []);

  return (
    <EventProvider>
      <Router>
        <div>
          {/* Add your header or navigation component here */}
          <Switch>
            {loggedIn ? (
              <>
                <Route exact path="/" component={Home} />
                <Route path="/directory" component={Directory} />
                <Route path="/guest-list" component={GuestList} />
                <Route path="/events/:id" component={EventDetails} />
                <Route path="/bookkeeping" component={Bookkeeping} />
                <Route path="/todolist" component={ToDoList} />
                <Route path="/archived-events" component={ArchivedEvents} />
              </>
            ) : (
              <Route path="/" component={() => <Login setLoggedIn={setLoggedIn} />} />
            )}
          </Switch>
        </div>
      </Router>
    </EventProvider>
  );
};

export default App;
