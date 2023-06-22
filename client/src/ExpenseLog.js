import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme } from 'victory';

const ExpenseLog = () => {
    const [expenses, setExpenses] = useState([]);
    const [newExpense, setNewExpense] = useState({ event: '', amount: 0 });

    useEffect(() => {
        axios.get('/api/expenses').then((response) => {
            setExpenses(response.data);
        });
    }, []);

    const addExpense = () => {
        axios.post('/api/expenses', newExpense).then((response) => {
            setExpenses([...expenses, response.data]);
            setNewExpense({ event: '', amount: 0 });
        });
    };

    return (
        <div>
            <form onSubmit={addExpense}>
                <input 
                    value={newExpense.event} 
                    onChange={e => setNewExpense({ ...newExpense, event: e.target.value })} 
                    placeholder="Event Name"
                />
                <input 
                    value={newExpense.amount} 
                    onChange={e => setNewExpense({ ...newExpense, amount: e.target.value })} 
                    placeholder="Amount"
                />
                <button type="submit">Add Expense</button>
            </form>

            <VictoryChart theme={VictoryTheme.material}>
                <VictoryAxis />
                <VictoryAxis dependentAxis />
                <VictoryBar data={expenses} x="event" y="amount" />
            </VictoryChart>
        </div>
    );
};

export default ExpenseLog;
