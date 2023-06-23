import React from 'react';
import RevenueLog from './RevenueLog';
import ExpenseLog from './ExpenseLog';
import InvoiceLog from './InvoiceLog';
import { useParams, Link, useHistory } from 'react-router-dom';

const Bookkeeping = () => {

    const history = useHistory();

  const handleHomeClick = () => {
    history.push('/'); // Replace '/' with the path to your home page
  };

    return (
        <div>
            <h1>Bookkeeping</h1>
            <Link to="/" className="add-event-button">Home</Link>
            <RevenueLog />
            <ExpenseLog />
            <InvoiceLog />
        </div>
    );
};

export default Bookkeeping;
