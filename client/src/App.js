import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Directory from './Directory';
import GuestList from './GuestList';
import EventDetails from './EventDetails';
import Bookkeeping from './Bookkeeping';
import ToDoList from './ToDoList';
import ArchivedEvents from './ArchivedEvents';
import ArchivedEventDetails from './ArchivedEventDetails';
import { EventProvider } from './EventContext';
import { AuthContext } from './AuthContext';
import './App.css';

const App = () => {
  const { loggedIn, logout } = useContext(AuthContext);

  return (
    <EventProvider>
      <Router>
        <div>
          <Switch>
            {loggedIn ? (
              <>
                <Route exact path="/" component={Home} />
                <Route path="/directory" component={Directory} />
                <Route path="/guest-list" component={GuestList} />
                <Route path="/events/:id" component={EventDetails} />
                <Route path="/bookkeeping" component={Bookkeeping} />
                <Route path="/todolist" component={ToDoList} />
                <Route exact path="/archived-events" component={ArchivedEvents} />
                <Route path="/archived-events/:id" component={ArchivedEventDetails} />
              </>
            ) : (
              <>
                <Route exact path="/" component={Login} />
                <Redirect to="/" />
              </>
            )}
          </Switch>
        </div>
      </Router>
    </EventProvider>
  );
};

export default App;
