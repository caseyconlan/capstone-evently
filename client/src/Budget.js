import React, { useContext, useState, useEffect } from 'react';
import { EventContext } from './EventContext.js';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { VictoryPie } from 'victory';

const Budget = () => {
  const { events, setEvents } = useContext(EventContext);
  const { id } = useParams();
  const [budget, setBudget] = useState(0);
  const [costName, setCostName] = useState('');
  const [costAmount, setCostAmount] = useState('');
  const [costCategory, setCostCategory] = useState('');
  const [costVendor, setCostVendor] = useState('');
  const [costs, setCosts] = useState([]);
  const [totalBudget, setTotalBudget] = useState(0);
  const [targetBudget, setTargetBudget] = useState(0);
  const [remainingBudget, setRemainingBudget] = useState(0);

  useEffect(() => {
    fetchBudget();
    retrieveStoredCosts();
  }, []);

  useEffect(() => {
    storeCosts();
  }, [costs]);

  const fetchBudget = async () => {
    try {
      const [actualResponse, targetResponse] = await Promise.all([
        axios.get(`/api/events/${id}/budget/actual`), // Fetch actual budget
        axios.get(`/api/events/${id}/budget/target`), // Fetch target budget
      ]);

      setBudget(actualResponse.data.budget);
      setTargetBudget(targetResponse.data.target_budget);
      setRemainingBudget(targetResponse.data.target_budget - actualResponse.data.budget);
    } catch (error) {
      console.error(error);
    }
  };

  const storeCosts = () => {
    sessionStorage.setItem(`weddingDetailsCosts-${id}`, JSON.stringify(costs));
  };

  const retrieveStoredCosts = () => {
    const storedCosts = sessionStorage.getItem(`weddingDetailsCosts-${id}`);
    if (storedCosts) {
      setCosts(JSON.parse(storedCosts));
      setTotalBudget(calculateTotalBudget(JSON.parse(storedCosts)));
    }
  };

  const calculateTotalBudget = (costs) => {
    return costs.reduce((sum, cost) => sum + cost.amount, 0);
  };

  const handleAddCost = () => {
    const newCost = {
      id: Date.now(),
      name: costName,
      amount: parseFloat(costAmount),
      category: costCategory,
      vendor: costVendor,
    };

    const updatedCosts = [...costs, newCost];
    setCosts(updatedCosts);

    setCostName('');
    setCostAmount('');
    setCostCategory('');
    setCostVendor('');

    const totalBudget = calculateTotalBudget(updatedCosts);
    setTotalBudget(totalBudget);

    const remainingBudget = targetBudget - totalBudget;
    setRemainingBudget(remainingBudget);
  };

  const handleSaveTargetBudget = async () => {
    try {
      await axios.post(`/api/events/${id}/budget`, { target_budget: targetBudget });
      fetchBudget();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="budget-container">
      <h1 className="event-title">Budget</h1>
      <h2 className="event-text">Target Budget: ${targetBudget}</h2>
      <div>
        <h3>Set Target Budget</h3>
        <input className="budget-input"
          type="number"
          placeholder="Enter Target Budget"
          value={targetBudget}
          onChange={(e) => setTargetBudget(parseFloat(e.target.value))}
        />
        <button className="add-event-button" onClick={handleSaveTargetBudget}>
          Save Target Budget
        </button>
      </div>
      <div>
        <h3>Add Cost</h3>
        <input className="form-input"
          type="text"
          placeholder="Cost Name"
          value={costName}
          onChange={(e) => setCostName(e.target.value)}
        />
        <input className="form-input"
          type="number"
          placeholder="Cost Amount"
          value={costAmount}
          onChange={(e) => setCostAmount(e.target.value)}
        />
        <select className="form-input"
          value={costCategory}
          onChange={(e) => setCostCategory(e.target.value)}
        >
          <option value="">Select a category</option>
          <option value="Attire">Attire</option>
          <option value="Advertising">Advertising</option>
          <option value="Cleanup">Communications</option>
          <option value="Communications">Communications</option>
          <option value="Decorations">Decorations</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Equipment">Equipment</option>
          <option value="Favors">Favors/Prizes</option>
          <option value="Food">Food</option>
          <option value="Flowers">Flowers</option>
          <option value="Music">Music</option>
          <option value="Photography/Videography">Photography/Videography</option>
          <option value="Stationary">Stationary</option>
          <option value="Transportation">Transportation</option>
          <option value="Venue">Venue</option>
          <option value="Other">Other</option>
        </select>
        <input className="form-input"
          type="text"
          placeholder="Vendor"
          value={costVendor}
          onChange={(e) => setCostVendor(e.target.value)}
        />
        <div>
        <button className="add-event-button" onClick={handleAddCost}>
          Add Cost
        </button>
        </div>
      </div>
      <div align="center">
      <div className="costs-container">
        <h1>Costs</h1>
        <table className="costs-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Amount</th>
              <th>Category</th>
              <th>Vendor</th>
            </tr>
          </thead>
          <tbody>
            {costs.map((cost) => (
              <tr key={cost.id}>
                <td>{cost.name}</td>
                <td>${cost.amount}</td>
                <td>{cost.category}</td>
                <td>{cost.vendor}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
      <div>
        <h1>Total Budget: ${totalBudget}</h1>
        <h1>Remaining Budget: ${targetBudget-totalBudget}</h1>
        <div align="center">
        <div style={{ maxWidth: '700px' }}>
        <VictoryPie
          data={[
            ...costs,
            { category: 'Remaining Budget', amount: remainingBudget },
          ]}
          x="category"
          y="amount"
          colorScale="qualitative"
        />
        </div>
        </div>
      </div>
    </div>
  );
};

export default Budget;