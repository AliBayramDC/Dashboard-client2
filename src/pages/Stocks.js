import React, { useEffect, useState } from 'react';
import { Typography, Box } from '@mui/material';
import TableView from '../components/TableView';
import StockForm from '../components/StockForm';
import axios from 'axios';

const Stocks = () => {
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    const fetchStocks = async () => {
      const response = await axios.get('http://localhost:5000/api/stocks');
      setStocks(response.data);
    };

    fetchStocks();
  }, []);

  const columns = ['stock_id', 'ProductName', 'StockQuantity'];

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
        STOCKS
      </Typography>
      <TableView data={stocks} columns={columns} />
      <StockForm />
    </Box>
  );
};

export default Stocks;
