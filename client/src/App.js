import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './Home';
import Budget from './Budget';
import ProjectPlan from './ProjectPlan';
import VendorList from './VendorList';
import GuestList from './GuestList';
import EventList from './EventList';
import EventDetails from './EventDetails';  // make sure to import the new component
import './App.css';

const App = () => {
  return (
    <Router>
      <div>
        {/* Add your header or navigation component here */}
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/project-plan" component={ProjectPlan} />
          <Route path="/list-of-vendors" component={VendorList} />
          <Route path="/guest-list" component={GuestList} />
          <Route path="/events/:id" component={EventDetails} /> 
        </Switch>
      </div>
    </Router>
  );
};

export default App;
