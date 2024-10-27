// components/Sidebar.js

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { List, ListItem, ListItemText, Drawer, ListItemIcon, Box } from '@mui/material';
import { ShoppingCart, Paid, Warehouse, Info, TrendingUp, Abc, BarChart as BarChartIcon } from '@mui/icons-material'; // Import icon for BarChart

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { text: 'Dashboard', icon: <Paid />, path: '/dashboard' },
    { text: 'Transactions', icon: <Paid />, path: '/transactions' },
    { text: 'Purchases', icon: <ShoppingCart />, path: '/purchases' },
    { text: 'Stocks', icon: <Warehouse />, path: '/stocks' },
    { text: 'Details', icon: <Info />, path: '/details' },
    { text: 'ABC', icon: <Abc />, path: '/abc' },
    { text: 'Sales Forecast', icon: <TrendingUp />, path: '/sales-forecast' },
  ];

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        '& .MuiDrawer-paper': {
          width: '220px',
          boxSizing: 'border-box',
          backgroundColor: '#497db6', // Dark blue background
          color: 'white',
          fontFamily: 'Roboto, sans-serif',
        }
      }}
    >
      <Box sx={{ mt: 2 }}>
        <List>
          {menuItems.map((item, index) => (
            <ListItem
              button
              component={Link}
              to={item.path}
              key={index}
              sx={{
                backgroundColor: location.pathname === item.path ? '#ffe3a3' : 'inherit', // Active color
                '&:hover': {
                  backgroundColor: '#6faefc', // Light version of background color
                },
                '& .MuiListItemIcon-root': {
                  color: location.pathname === item.path ? '#000046' : 'white', // Active icon color
                },
                '& .MuiListItemText-primary': {
                  color: location.pathname === item.path ? '#000046' : 'inherit', // Active text color
                  fontWeight: '400', // Ensure text is not bold
                }
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: '1rem',
                  fontWeight: '400', // Ensure text is not bold
                }}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
