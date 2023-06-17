import React from 'react';
import { BrowserRouter as Router, Route, Switch, useHistory } from 'react-router-dom';
import Home from './Home';
import VendorList from './VendorList';
import GuestList from './GuestList';
import EventDetails from './EventDetails';
import DataDashboard from './DataDashboard';
import Resources from './Resources';
import ArchivedEvents from './ArchivedEvents';
import { EventProvider } from './EventContext'; // Import the EventProvider component
import './App.css';

const App = () => {
  return (
    <EventProvider> {/* Wrap the components with the EventProvider */}
      <Router>
        <div>
          {/* Add your header or navigation component here */}
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/vendors" component={VendorList} />
            <Route path="/guest-list" component={GuestList} />
            <Route path="/events/:id" component={EventDetails} />
            <Route path="/datadashboard" component={DataDashboard} />
            <Route path="/resources" component={Resources} />
            <Route path="/archived-events" component={ArchivedEvents} />
          </Switch>
        </div>
      </Router>
    </EventProvider>
  );
};

export default App;
