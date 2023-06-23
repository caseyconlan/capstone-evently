import React, { useState, useEffect } from 'react';
import { VictoryChart, VictoryStack, VictoryBar, VictoryAxis } from 'victory';

const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const Bookkeeping = () => {
  const [data, setData] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');

  useEffect(() => {
    fetchBookkeepingEntries();
  }, []);

  const fetchBookkeepingEntries = async () => {
    try {
      const response = await fetch('/bookkeeping');
      const entries = await response.json();
      setData(entries);
    } catch (error) {
      console.log('Error fetching bookkeeping entries:', error);
    }
  };

  const createBookkeepingEntry = async () => {
    try {
      const entry = {
        type: 'Expense',
        category: newCategory,
        amount: Number(newAmount),
        month: Number(selectedMonth),
        date: new Date().toISOString(),
      };

      const response = await fetch('/bookkeeping', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entry),
      });

      if (response.ok) {
        setNewCategory('');
        setNewAmount('');
        setSelectedMonth('');
        fetchBookkeepingEntries();
      } else {
        console.log('Error creating bookkeeping entry');
      }
    } catch (error) {
      console.log('Error creating bookkeeping entry:', error);
    }
  };

  const renderChart = () => {
    const groupedData = data.reduce((result, entry) => {
      const dataIndex = result.findIndex((item) => item.month === entry.month);
      if (dataIndex !== -1) {
        if (entry.type === 'Revenue') {
          result[dataIndex].revenue += entry.amount;
        } else if (entry.type === 'Expense') {
          result[dataIndex].expense += entry.amount;
        }
      } else {
        result.push({
          month: entry.month,
          revenue: entry.type === 'Revenue' ? entry.amount : 0,
          expense: entry.type === 'Expense' ? entry.amount : 0,
        });
      }
      return result;
    }, []);

    return (
      <div>
        <h2>Revenue and Expenses</h2>
        <VictoryChart>
          <VictoryAxis tickFormat={(x) => months[x]} />
          <VictoryAxis dependentAxis tickFormat={(y) => `$${y}`} />
          <VictoryStack colorScale={['green', 'red']}>
            <VictoryBar data={groupedData} x="month" y="revenue" />
            <VictoryBar data={groupedData} x="month" y="expense" />
          </VictoryStack>
        </VictoryChart>
      </div>
    );
  };

  const handleAddRevenue = () => {
    const newEntry = {
      type: 'Revenue',
      category: newCategory,
      amount: Number(newAmount),
      month: Number(selectedMonth),
      date: new Date(),
    };
    setData([...data, newEntry]);
    setNewCategory('');
    setNewAmount('');
    setSelectedMonth('');
  };

  const handleAddExpense = () => {
    const newEntry = {
      type: 'Expense',
      category: newCategory,
      amount: Number(newAmount),
      month: Number(selectedMonth),
      date: new Date(),
    };
    setData([...data, newEntry]);
    setNewCategory('');
    setNewAmount('');
    setSelectedMonth('');
  };

  return (
    <div>
      <h1>Bookkeeping Dashboard</h1>
      {renderChart()}

      <div>
        <h2>Add Entry</h2>
        <div>
          <h3>Add Revenue</h3>
          <input
            type="text"
            placeholder="Category"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <input
            type="number"
            placeholder="Amount"
            value={newAmount}
            onChange={(e) => setNewAmount(e.target.value)}
          />
          <input
            type="number"
            placeholder="Month (1-12)"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          />
          <button onClick={handleAddRevenue}>Add</button>
        </div>

        <div>
          <h3>Add Expense</h3>
          <input
            type="text"
            placeholder="Category"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <input
            type="number"
            placeholder="Amount"
            value={newAmount}
            onChange={(e) => setNewAmount(e.target.value)}
          />
          <input
            type="number"
            placeholder="Month (1-12)"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          />
          <button onClick={handleAddExpense}>Add</button>
        </div>
      </div>
    </div>
  );
};

export default Bookkeeping;
