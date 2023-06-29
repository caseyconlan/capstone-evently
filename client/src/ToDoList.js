import React from 'react';
import { useParams, Link, useHistory } from 'react-router-dom';
import './App.css';

const todoList = () => {
  const todoKickoff = [
    'Determine date and time',
    'Evaluate goals and expected outcomes',
    'Determine rules and regulations for event in accordance with the appropriate city and state rules and regulations',
    'Collect appropriate permits',
    'Anticipate attendance; does the space have room for activities and participants?',
    'Create Guestlist',
    'Secure site',
    'Check for potential conflicts with other events',
    'Confirm date with key participants',
    'Set rain date if applicable',
    'Anticipate alternate location, set-up, and transportation',
    'Put everything in writing: contracts, booth agreements, supplier agreements, etc',
    'Collect RSVPs',
  ];

  const todoFinance = [
    'Set target budget',
    'Inventory equipment needs',
    'Determine sponsorship opportunities',
    'Arrange payment and billing procedures',
    'Determine insurance needs',
  ];

  const todoLogistics = [
    'Site plan',
    'Accessibility plan',
    'Portable restroom facilities (150 guests per portable unit)',
    'Parking and transportation plan',
    '>Public',
    '>Vendors',
    '>VIP',
    '>Staff / volunteers',
    '>Valet',
    '>Performers',
    '>Bicycle',
    '>Other',
    'Determine needs',
    'Rental equipment:',
    '>Stages',
    '>Chairs',
    '>Refrigeration',
    '>Audio / visual',
    '>Power',
    '>Tents / canopies',
    '>Fencing',
    '>Barricades',
    '>Signage',
    '>Tables',
    '>Communication equipment',
    'Building needs',
    '>Power needs and distribution',
    '>Emergency vehicle access',
    '>Security needs',
    'Setup / tear-down schedule',
    'Trash and recycling',
    'First aid',
    'Water station(s)',
    'Policies: lost child, communications',
    'Command post / emergency procedures',
    'Onsite money collection',
    'Site preparation mow grass, plow snow, etc.',
    'Decorations',
    'Pre and post-event walk through ',
  ];

  const todoVendors = [
    'Determine what types are appropriate',
    '>Food / beverage',
    '>Merchandise and services',
    '>Community organizations',
    '>Childrens activities',
    '>Arts-visual and performing',
    '>Hands-on activities',
    '>Beer / wine',
    '>Other',
    'Recruit vendors',
    'Review and sign contracts',
    'Arrange for equipment',
    'Alert vendors of necessary permits and sales tax licenses',
    'Determine financial methods on site',
    'Survey vendors after event',
    'Determine setup / tear-down procedures',
  ];

  const indentItem = (item) => {
    if (item.startsWith('>')) {
      return <li style={{ marginLeft: '20px' }}>{item.substring(1)}</li>;
    }
    return <li>{item}</li>;
  };

  return (
    <div className="resources" style={{ background: 'var(--primary-color)', padding: '20px' }}>
    <div className="ribbon">
      <h1 className="todo-title">To Do List</h1>
      <Link to="/" className="add-event-button">Home</Link>
    </div>
    <div className="section">
        <h4 style={{ color: 'var(--dark-color)'}}>Kick Off Items</h4>
        <ul className="todo-list">
          {todoKickoff.map((item, index) => (
            <React.Fragment key={index}>{indentItem(item)}</React.Fragment>
          ))}
        </ul>
      </div>
      <div className="section">
        <h4 style={{ color: 'var(--dark-color)' }}>Financial Items</h4>
        <ul className="todo-list">
          {todoFinance.map((item, index) => (
            <React.Fragment key={index}>{indentItem(item)}</React.Fragment>
          ))}
        </ul>
      </div>
      <div className="section">
        <h4 style={{ color: 'var(--dark-color)' }}>Logistical Items</h4>
        <ul className="todo-list">
          {todoLogistics.map((item, index) => (
            <React.Fragment key={index}>{indentItem(item)}</React.Fragment>
          ))}
        </ul>
      </div>
      <div className="section">
        <h4 style={{ color: 'var(--dark-color)' }}>Vendor Items</h4>
        <ul className="todo-list">
          {todoVendors.map((item, index) => (
            <React.Fragment key={index}>{indentItem(item)}</React.Fragment>
          ))}
        </ul>
      </div>
    </div>
  );  
};  

export default todoList;