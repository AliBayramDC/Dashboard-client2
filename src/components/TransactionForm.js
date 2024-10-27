import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';
import axios from 'axios';

const TransactionForm = () => {
  const [formData, setFormData] = useState({
    transaction_id: '',
    ProductName: '',
    QuantitySold: '',
    CostPrice: '',
    COGS: '',
    SalesPrice: '',
    Sales: '',
    Date: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/transactions', formData);
      alert('Transaction added successfully');
    } catch (error) {
      console.error('There was an error adding the transaction!', error);
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
      <Button type="submit" variant="contained" color="primary">Add Transaction</Button>
    </form>
  );
};

export default TransactionForm;
