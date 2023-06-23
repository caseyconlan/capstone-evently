import React, { useState, useEffect } from 'react';
import { useParams, Link, useHistory } from 'react-router-dom';
import './App.css';

const Directory = () => {
  const [type, setType] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [directoryEntries, setDirectoryEntries] = useState([]);

  const history = useHistory();

  const handleHomeClick = () => {
    history.push('/'); // Replace '/' with the path to your home page
  };

  useEffect(() => {
    fetch('/directory')
      .then(response => response.json())
      .then(data => {
        setDirectoryEntries(data);
      })
      .catch(error => {
        // Handle error
      });
  }, []);

  const handleSubmit = e => {
    e.preventDefault();
    const newEntry = {
      type,
      name,
      phone,
      email,
      address,
      notes
    };
    fetch('/directory', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newEntry)
    })
      .then(response => response.json())
      .then(data => {
        // Handle success or error
        if (data.message === 'Entry created successfully') {
          setDirectoryEntries([...directoryEntries, newEntry]);
          setType('');
          setName('');
          setPhone('');
          setEmail('');
          setAddress('');
          setNotes('');
        }
      })
      .catch(error => {
        // Handle error
      });
  };

  return (
    <div className="directory-container">
      <h1 className="todo-title">Directory</h1>
      <Link to="/" className="add-event-button">Home</Link>
      <h1>Add Entry</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="type">Type:</label>
          <select
            id="type"
            value={type}
            onChange={e => setType(e.target.value)}
          >
            <option value="">-- Select Type --</option>
            <option value="Client">Client</option>
            <option value="Vendor">Vendor</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone:</label>
          <input
            type="text"
            id="phone"
            value={phone}
            onChange={e => setPhone(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="address">Address:</label>
          <input
            type="address"
            id="address"
            value={address}
            onChange={e => setAddress(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="notes">Notes:</label>
          <textarea
            id="notes"
            value={notes}
            onChange={e => setNotes(e.target.value)}
          />
        </div>
        <button type="submit">Add</button>
      </form>

      <h2>Directory</h2>
      {directoryEntries.length > 0 ? (
        <table className="directory-table">
          <thead>
            <tr>
            <th>Type</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Address</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {directoryEntries.map((entry, index) => (
              <tr key={index}>
                <td>{entry.type}</td>
                <td>{entry.name}</td>
                <td>{entry.phone}</td>
                <td>{entry.email}</td>
                <td>{entry.address}</td>
                <td>{entry.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No entries found.</p>
      )}
    </div>
  );
};

export default Directory;