import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default () => {
  const [seenIndexes, setSeenIndexes] = useState([]);
  const [index, setIndex] = useState('');
  const [values, setValues] = useState({});

  const fetchValues = async () => {
    const retValues = await axios.get('/api/values/current');
    setValues({ ...retValues.data });
  };

  const fetchIndexes = async () => {
    const seenIndexes = await axios.get('/api/values/all');
    setSeenIndexes(seenIndexes.data);
  };

  const renderSeenIndexes = () => {
    return seenIndexes.map(({ number }) => number).join(', ');
  };

  const renderValues = () => {
    const entries = [];
    for (const [key, value] of Object.entries(values)) {
      entries.push(
        <div key={key}>
          For index {key} I calculated {value}
        </div>
      );
    }
    return entries;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('/api/values', {
      index: index,
    });
    setIndex('');
    fetchIndexes();
    fetchValues();
  };

  useEffect(() => {
    fetchIndexes();
    fetchValues();
  }, []);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>Enter your index:</label>
        <input
          type="text"
          value={index}
          onChange={(e) => setIndex(e.target.value)}
        />
        <button>Submit</button>
      </form>
      <h3>Indexes I have seen:</h3>
      {renderSeenIndexes()}

      <h3>Calculated Values:</h3>
      {renderValues()}
    </div>
  );
};
