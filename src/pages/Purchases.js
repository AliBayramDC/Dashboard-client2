import React, { useEffect, useState } from 'react';
import { Typography, Box } from '@mui/material';
import TableView from '../components/TableView';
import PurchaseForm from '../components/PurchaseForm';
import axios from 'axios';

const Purchases = () => {
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    const fetchPurchases = async () => {
      const response = await axios.get('http://localhost:5000/api/purchases');
      setPurchases(response.data);
    };

    fetchPurchases();
  }, []);

  const columns = ['purchase_id', 'ProductName', 'QuantityPurchased', 'Date'];

  return (
    <Box style={{ width: 'calc(100% - 32px)', padding: 0, marginLeft: '4px' }}>
      <Typography 
        variant="h1" 
        color="primary" 
        gutterBottom
        style={{ 
          fontFamily: 'Roboto, sans-serif', 
          fontSize: '2.5rem', 
          fontWeight: 700, 
          textAlign: 'center', 
          margin: '15px 0'
        }}
      >
        PURCHASES
      </Typography>
      <TableView data={purchases} columns={columns} />
      <PurchaseForm />
    </Box>
  );
};

export default Purchases;
