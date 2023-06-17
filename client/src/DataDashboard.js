import React, { useState, useEffect } from 'react';
import { VictoryBar } from 'victory';
import axios from 'axios';

const DataDashboard = () => {
  const [vendorData, setVendorData] = useState([]);

  useEffect(() => {
    const fetchVendorData = async () => {
      try {
        const response = await axios.get('/api/events/<int:event_id>/vendors');
        const fetchedVendorData = response.data;
        setVendorData(fetchedVendorData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchVendorData();
  }, []);

  const calculateVendorFrequency = (vendorList) => {
    const frequencyMap = {};
    vendorList.forEach((vendor) => {
      frequencyMap[vendor.name] = frequencyMap[vendor.name] ? frequencyMap[vendor.name] + 1 : 1;
    });
    const frequencyData = Object.entries(frequencyMap).map(([name, frequency]) => ({
      name,
      frequency,
    }));
    return frequencyData;
  };

  const barChartData = calculateVendorFrequency(vendorData);

  return (
    <div className="data-dashboard">
      <h2>Data Dashboard</h2>
      <div className="chart-container">
        {/* Bar Chart */}
        <VictoryBar
          data={barChartData}
          x="name"
          y="frequency"
          style={{
            data: { fill: 'steelblue' },
          }}
          labels={({ datum }) => datum.frequency}
        />

        {/* Add more chart components for other metrics */}
      </div>
    </div>
  );
};

export default DataDashboard;
