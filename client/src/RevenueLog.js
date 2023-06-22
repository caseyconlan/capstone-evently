import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme } from 'victory';
import { useEvents } from './EventList';

const RevenueLog = () => {
    const [revenues, setRevenues] = useState([]);
    const [newRevenue, setNewRevenue] = useState({ event: '', amount: 0 });
    const [events] = useEvents();

    useEffect(() => {
        axios.get('/api/revenues').then((response) => {
            setRevenues(response.data);
        });
    }, []);

    const addRevenue = () => {
        axios.post('/api/revenues', newRevenue).then((response) => {
            setRevenues([...revenues, response.data]);
            setNewRevenue({ event: '', amount: 0 });
        });
    };

    return (
        <div>
            <form onSubmit={addRevenue}>
                <select 
                    value={newRevenue.event} 
                    onChange={e => setNewRevenue({ ...newRevenue, event: e.target.value })}
                >
                    <option value="">Select Event</option>
                    {events.map(event => <option key={event.id} value={event.name}>{event.name}</option>)}
                </select>
                <input 
                    value={newRevenue.amount} 
                    onChange={e => setNewRevenue({ ...newRevenue, amount: e.target.value })} 
                    placeholder="Amount"
                />
                <button type="submit">Add Revenue</button>
            </form>

            <VictoryChart theme={VictoryTheme.material}>
                <VictoryAxis />
                <VictoryAxis dependentAxis />
                <VictoryBar data={revenues} x="event" y="amount" />
            </VictoryChart>
        </div>
    );
};

export default RevenueLog;