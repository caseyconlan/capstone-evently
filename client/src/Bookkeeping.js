import React, { useState, useEffect } from 'react';
import { VictoryChart, VictoryAxis, } from 'victory';
import axios from 'axios';

const Bookkeeping = () => {
  const [heatmapData, setHeatmapData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/data/bookkeeping');
        const fetchedData = response.data;
        setHeatmapData(fetchedData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bookkeeping">
      <h2>Bookkeeping</h2>
      <div className="chart-container">
        <VictoryChart domainPadding={20}>
        </VictoryChart>
      </div>
    </div>
  );
};

export default Bookkeeping;
