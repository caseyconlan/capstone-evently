import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { VictoryPie } from 'victory';

const Budget = () => {
  const { id } = useParams();
  const [budget, setBudget] = useState(0);
  const [costName, setCostName] = useState('');
  const [costAmount, setCostAmount] = useState('');
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
    sessionStorage.setItem('weddingDetailsCosts', JSON.stringify(costs));
  };

  const retrieveStoredCosts = () => {
    const storedCosts = sessionStorage.getItem('weddingDetailsCosts');
    if (storedCosts) {
      setCosts(JSON.parse(storedCosts));
    }
  };

  const handleAddCost = () => {
    const newCost = {
      id: Date.now(),
      name: costName,
      amount: parseFloat(costAmount),
    };

    const updatedCosts = [...costs, newCost];
    setCosts(updatedCosts);

    setCostName('');
    setCostAmount('');

    setTotalBudget(calculateTotalBudget());
  };

  const calculateTotalBudget = () => {
    return costs.reduce((sum, cost) => sum + cost.amount, 0);
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
    <div>
      <h2>Budget</h2>
      <p>Target Budget: ${targetBudget}</p>
      <div>
        <h3>Set Target Budget</h3>
        <input
          type="number"
          placeholder="Enter Target Budget"
          value={targetBudget}
          onChange={(e) => setTargetBudget(parseFloat(e.target.value))}
        />
        <button className="add-event-button" onClick={handleSaveTargetBudget}>Save Target Budget</button>
      </div>
      <div>
        <h3>Add Cost</h3>
        <input
          type="text"
          placeholder="Cost Name"
          value={costName}
          onChange={(e) => setCostName(e.target.value)}
        />
                <input
          type="number"
          placeholder="Cost Amount"
          value={costAmount}
          onChange={(e) => setCostAmount(e.target.value)}
        />
        <button className="add-event-button" onClick={handleAddCost}>Add Cost</button>
      </div>
      <div>
        <h3>Costs</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {costs.map((cost) => (
              <tr key={cost.id}>
                <td>{cost.name}</td>
                <td>${cost.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <h3>Total Budget: ${totalBudget}</h3>
        <h3>Remaining Budget: ${remainingBudget}</h3>
        <VictoryPie
          data={[
            ...costs,
            { name: 'Remaining Budget', amount: remainingBudget },
          ]}
          x="name"
          y="amount"
          colorScale="qualitative"
        />
      </div>
    </div>
  );
};

export default Budget;

