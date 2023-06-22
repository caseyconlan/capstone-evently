import React from 'react';
import RevenueLog from './RevenueLog';
import ExpenseLog from './ExpenseLog';
import InvoiceLog from './InvoiceLog';

const Bookkeeping = () => {
    return (
        <div>
            <h1>Bookkeeping</h1>
            <RevenueLog />
            <ExpenseLog />
            <InvoiceLog />
        </div>
    );
};

export default Bookkeeping;
