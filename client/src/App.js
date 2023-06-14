import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './Home';
import Budget from './Budget';
import ProjectPlan from './ProjectPlan';
import VendorList from './VendorList';
import GuestList from './GuestList';

const App = () => {
  return (
    <Router>
      <div>
        {/* Add your header or navigation component here */}
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/budget" component={Budget} />
          <Route path="/project-plan" component={ProjectPlan} />
          <Route path="/list-of-vendors" component={VendorList} />
          <Route path="/guest-list" component={GuestList} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;
