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

  const history = useHistory();

  const handleHomeClick = () => {
    history.push('/'); // Replace '/' with the path to your home page
  };

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
        <h1>Revenue and Expenses</h1>
        <div style={{maxWidth: "800px"}}>
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

  return (
    <div>
      <h1 className="todo-title">Bookkeeping Dashboard</h1>
      <Link to="/" className="add-event-button">Home</Link>
      {renderChart()}

      <div className="accounting-container-large">
        <h1 className="todo-title">Add Entry</h1>
        <div className="accounting-container">
          <h3>Add Revenue</h3>
          <div>
          <input className="bookkeeping-input"
            type="text"
            placeholder="Description"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <input className="bookkeeping-input"
            type="number"
            placeholder="Amount"
            value={newAmount}
            onChange={(e) => setNewAmount(e.target.value)}
          />
          <input className="bookkeeping-input"
            type="number"
            placeholder="Month (1-12)"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          />
          </div>
          <button className="button-primary" onClick={() => createBookkeepingEntry('Revenue')}>Add</button>
        </div>

        <div className="accounting-container">
          <h3>Add Expense</h3>
          <div>
          <input className="bookkeeping-input"
            type="text"
            placeholder="Description"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <input className="bookkeeping-input"
            type="number"
            placeholder="Amount"
            value={newAmount}
            onChange={(e) => setNewAmount(e.target.value)}
          />
          <input className="bookkeeping-input"
            type="number"
            placeholder="Month (1-12)"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          />
          </div>
          <button className="button-primary" onClick={() => createBookkeepingEntry('Expense')}>Add</button>
        </div>
      </div>
    </div>
  );
};

export default Bookkeeping;
