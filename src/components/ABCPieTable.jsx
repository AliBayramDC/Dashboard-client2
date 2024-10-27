// ABCPieTable.jsx
import React from 'react';
import { Box, Table, TableBody, TableCell, TableHead, TableRow, useTheme } from '@mui/material';
import { tokens } from '../theme';

const ABCPieTable = ({ data }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Initialize the sales data structure
  const salesData = {
    A: { X: 0, Y: 0, Z: 0 },
    B: { X: 0, Y: 0, Z: 0 },
    C: { X: 0, Y: 0, Z: 0 },
  };

  // Populate the sales data based on the input data
  data.forEach(item => {
    const { abc, xyz, sale } = item;
    if (salesData[abc] && salesData[abc][xyz] !== undefined) {
      salesData[abc][xyz] += parseFloat(sale);
    }
  });

  return (
    <Box sx={{ backgroundColor: colors.primary[400]}}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="center" sx={{ fontSize: '1.21rem', fontWeight: 'bold' }}></TableCell>
            <TableCell align="center" sx={{ fontSize: '1.21rem', fontWeight: 'bold' }}>X</TableCell>
            <TableCell align="center" sx={{ fontSize: '1.21rem', fontWeight: 'bold' }}>Y</TableCell>
            <TableCell align="center" sx={{ fontSize: '1.21rem', fontWeight: 'bold' }}>Z</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.keys(salesData).map(rowKey => (
            <TableRow key={rowKey}>
              <TableCell align="center" sx={{ fontSize: '1.21rem', fontWeight: 'bold' }}>{rowKey}</TableCell>
              <TableCell align="center" sx={{ fontSize: '1.21rem', fontWeight: 'bold' }}>{salesData[rowKey].X.toFixed(1) + "₼"}</TableCell>
              <TableCell align="center" sx={{ fontSize: '1.21rem', fontWeight: 'bold' }}>{salesData[rowKey].Y.toFixed(1) + "₼"}</TableCell>
              <TableCell align="center" sx={{ fontSize: '1.21rem', fontWeight: 'bold' }}>{salesData[rowKey].Z.toFixed(1) + "₼"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default ABCPieTable;
