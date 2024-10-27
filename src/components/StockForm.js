import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';
import axios from 'axios';

const StockForm = () => {
  const [formData, setFormData] = useState({
    stock_id: '',
    ProductName: '',
    StockQuantity: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/stocks', formData);
      alert('Stock added successfully');
    } catch (error) {
      console.error('There was an error adding the stock!', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {Object.keys(formData).map(key => (
        <TextField
          key={key}
          name={key}
          label={key}
          value={formData[key]}
          onChange={handleChange}
          margin="normal"
          fullWidth
        />
      ))}
      <Button type="submit" variant="contained" color="primary">Add Stock</Button>
    </form>
  );
};

export default StockForm;
