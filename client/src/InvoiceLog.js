import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { VictoryPie, VictoryChart, VictoryTheme } from 'victory';

const InvoiceLog = () => {
    const [invoices, setInvoices] = useState([]);
    const [newInvoice, setNewInvoice] = useState({ invoiceId: '', paid: false });

    useEffect(() => {
        axios.get('/api/invoices').then((response) => {
            setInvoices(response.data);
        });
    }, []);

    const updateInvoice = (invoiceId, paidStatus) => {
        axios.put(`/api/invoices/${invoiceId}`, { paid: paidStatus }).then((response) => {
            setInvoices(invoices.map(inv => inv.invoiceId === invoiceId ? response.data : inv));
        });
    };

    return (
        <div>
            <ul>
                {invoices.map(invoice => 
                    <li key={invoice.invoiceId}>
                        {invoice.invoiceId} - {invoice.paid ? 'Paid' : 'Outstanding'}
                        {!invoice.paid && <button onClick={() => updateInvoice(invoice.invoiceId, true)}>Mark as Paid</button>}
                    </li>
                )}
            </ul>

            <VictoryChart theme={VictoryTheme.material}>
                <VictoryPie
                    data={invoices.map(invoice => ({ x: invoice.invoiceId, y: invoice.paid ? 1 : 0 }))}
                    labels={({ datum }) => datum.y ? 'Paid' : 'Outstanding'}
                />
            </VictoryChart>
        </div>
    );
};

export default InvoiceLog;
