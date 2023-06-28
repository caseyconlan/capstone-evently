import React, { useState, useEffect } from 'react';
import { VictoryChart, VictoryStack, VictoryBar, VictoryAxis } from 'victory';
import { useParams, Link, useHistory } from 'react-router-dom';

const months = [
  '0',
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
  const [entries, setEntries] = useState([]);

  const history = useHistory();

  const handleHomeClick = () => {
    history.push('/');
  };

  useEffect(() => {
    fetchBookkeepingEntries();
  }, []);

  const fetchBookkeepingEntries = async () => {
    try {
      const response = await fetch('/bookkeeping');
      const entries = await response.json();
      setData(entries);
      setEntries(entries);
    } catch (error) {
      console.log('Error fetching bookkeeping entries:', error);
    }
  };

  const createBookkeepingEntry = async (type) => {
    try {
      const entry = {
        type: type,
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
        const responseData = await response.json();
        setData([...data, responseData]);
        setEntries([...entries, responseData]);
        setNewCategory('');
        setNewAmount('');
        setSelectedMonth('');
      } else {
        console.error('Error adding bookkeeping entry:', response.status);
      }
    } catch (error) {
      console.error('Error adding bookkeeping entry:', error);
    }
  };

  const renderChart = () => {
    const maxMonth = Math.max(...data.map((entry) => entry.month));
  
    const groupedData = Array.from({ length: maxMonth }, (_, index) => {
      const month = index + 1;
      const filteredEntries = data.filter((entry) => entry.month === month);
      const revenue = filteredEntries.reduce(
        (total, entry) => (entry.type === 'Revenue' ? total + entry.amount : total),
        0
      );
      const expense = filteredEntries.reduce(
        (total, entry) => (entry.type === 'Expense' ? total + entry.amount : total),
        0
      );
      return { month, revenue, expense };
    });
  
    return (
      <div align="center">
        <h1 className="event-title">Revenue and Expenses</h1>
        <div style={{ maxWidth: '800px' }}>
          <VictoryChart padding={{ top: 20, right: 20, bottom: 50, left: 70 }}>
            <VictoryAxis independentAxis tickFormat={(x) => months[x]} />
            <VictoryAxis dependentAxis tickFormat={(y) => `$${y}`} />
            <VictoryStack colorScale={['#14A098', '#CB2F6F']}>
              <VictoryBar data={groupedData} x="month" y="revenue" />
              <VictoryBar data={groupedData} x="month" y="expense" />
            </VictoryStack>
          </VictoryChart>
        </div>
      </div>
    );
  };  

  const renderTable = () => {
    return (
      <div align="center">
        <h1 className="event-title">Bookkeeping Entries</h1>
        <table className="table">
          <thead>
            <tr>
              <th>Month</th>
              <th>Description</th>
              <th>Revenue</th>
              <th>Expense</th>
            </tr>
          </thead>
          <tbody>
            {data.map((entry) => (
              <tr
                key={entry.id}
                className={entry.type === 'Revenue' ? 'revenue-entry' : 'expense-entry'}
              >
                <td>{months[entry.month]}</td>
                <td>{entry.category}</td>
                <td>{entry.type === 'Revenue' ? `$${entry.amount}` : ''}</td>
                <td>{entry.type === 'Expense' ? `$${entry.amount}` : ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div>
      <div className="directory-container">
      <h1 className="todo-title">Bookkeeping Dashboard</h1>
      <Link to="/" className="add-event-button">
        Home
      </Link>
      </div>
      {renderChart()}
      {renderTable()}

      <div className="accounting-container-large">
        <h1 className="todo-title">Add Entry</h1>
        <div className="accounting-container">
          <h3>Add Revenue</h3>
          <div>
            <input
              className="bookkeeping-input"
              type="text"
              placeholder="Description"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <input
              className="bookkeeping-input"
              type="number"
              placeholder="Amount"
              value={newAmount}
              onChange={(e) => setNewAmount(e.target.value)}
            />
            <input
              className="bookkeeping-input"
              type="number"
              placeholder="Month (1-12)"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            />
            <div>
            <button className="button-primary" onClick={() => createBookkeepingEntry('Revenue')}>
              Add
            </button>
            </div>
          </div>
        </div>

        <div className="accounting-container">
          <h3>Add Expense</h3>
          <div>
            <input
              className="bookkeeping-input"
              type="text"
              placeholder="Description"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <input
              className="bookkeeping-input"
              type="number"
              placeholder="Amount"
              value={newAmount}
              onChange={(e) => setNewAmount(e.target.value)}
            />
            <input
              className="bookkeeping-input"
              type="number"
              placeholder="Month (1-12)"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            />
            <div>
            <button className="button-primary" onClick={() => createBookkeepingEntry('Expense')}>
              Add
            </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bookkeeping;
