import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';
import axios from 'axios';

const PurchaseForm = () => {
  const [formData, setFormData] = useState({
    purchase_id: '',
    ProductName: '',
    QuantityPurchased: '',
    Date: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/purchases', formData);
      alert('Purchase added successfully');
    } catch (error) {
      console.error('There was an error adding the purchase!', error);
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
      <Button type="submit" variant="contained" color="primary">Add Purchase</Button>
    </form>
  );
};

export default PurchaseForm;
