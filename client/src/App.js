import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './Home';
import Budget from './Budget';
import ProjectPlan from './ProjectPlan';
import VendorList from './VendorList';
import GuestList from './GuestList';
import EventList from './EventList';
import EventDetails from './EventDetails';
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
          </Switch>
        </div>
      </Router>
    </EventProvider>
  );
};

export default App;
