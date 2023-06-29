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
  const [newRevenueCategory, setNewRevenueCategory] = useState('');
  const [newRevenueAmount, setNewRevenueAmount] = useState('');
  const [newExpenseCategory, setNewExpenseCategory] = useState('');
  const [newExpenseAmount, setNewExpenseAmount] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [newRevenueMonth, setNewRevenueMonth] = useState('');
  const [newExpenseMonth, setNewExpenseMonth] = useState('');
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
      let entry = {};
  
      if (type === 'Revenue') {
        entry = {
          type: type,
          category: newRevenueCategory,
          amount: Number(newRevenueAmount),
          month: Number(newRevenueMonth),
          date: new Date().toISOString(),
        };
      } else if (type === 'Expense') {
        entry = {
          type: type,
          category: newExpenseCategory,
          amount: Number(newExpenseAmount),
          month: Number(newExpenseMonth),
          date: new Date().toISOString(),
        };
      }
  
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
  
        // Reset the state variables based on the type of entry
        if (type === 'Revenue') {
          setNewRevenueCategory('');
          setNewRevenueAmount('');
          setNewRevenueMonth('');
        } else if (type === 'Expense') {
          setNewExpenseCategory('');
          setNewExpenseAmount('');
          setNewExpenseMonth('');
        }
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
            <VictoryStack colorScale={['#12a4d9', '#d9138a']}>
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
            value={newRevenueCategory}
            onChange={(e) => setNewRevenueCategory(e.target.value)}
          />
          <input
            className="bookkeeping-input"
            type="number"
            placeholder="Amount"
            value={newRevenueAmount}
            onChange={(e) => setNewRevenueAmount(e.target.value)}
          />
            <input
              className="bookkeeping-input"
              type="number"
              placeholder="Month (1-12)"
              value={newRevenueMonth}
              onChange={(e) => setNewRevenueMonth(e.target.value)}
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
            value={newExpenseCategory}
            onChange={(e) => setNewExpenseCategory(e.target.value)}
          />
          <input
            className="bookkeeping-input"
            type="number"
            placeholder="Amount"
            value={newExpenseAmount}
            onChange={(e) => setNewExpenseAmount(e.target.value)}
          />
          <input
            className="bookkeeping-input"
            type="number"
            placeholder="Month (1-12)"
            value={newExpenseMonth}
            onChange={(e) => setNewExpenseMonth(e.target.value)}
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
