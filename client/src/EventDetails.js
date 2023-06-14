import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState({});

  useEffect(() => {
    axios.get(`http://localhost:4000/api/events/${id}`)
      .then(res => {
        setEvent(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  }, [id]);

  return (
    <div>
      <h1>{event.name}</h1>
      {/* add your forms for budget, vendors, etc here */}
    </div>
  );
}

export default EventDetails;
