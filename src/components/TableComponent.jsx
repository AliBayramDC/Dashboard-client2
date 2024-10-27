import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, useTheme } from '@mui/material';
import { tokens } from '../theme';

const TableComponent = ({ data }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <TableContainer
      component={Paper}
      sx={{
        backgroundColor: colors.primary[400],
        maxHeight: '233px',
        overflow: 'auto',
        '&::-webkit-scrollbar': {
          width: '4px', // Make scrollbar narrower
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: colors.grey[500], // Customize the scrollbar thumb color
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: colors.primary[500], // Customize the scrollbar track color
        },
      }}
    >
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell align="center" sx={{ fontSize: '1.2rem', fontWeight: 'bold' }}></TableCell>
            <TableCell align="center" sx={{ fontSize: '1.2rem', fontWeight: 'bold' }}>ABC</TableCell>
            <TableCell align="center" sx={{ fontSize: '1.2rem', fontWeight: 'bold' }}>XYZ</TableCell>
            <TableCell align="center" sx={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Sale</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              <TableCell align="center" sx={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{row.product}</TableCell>
              <TableCell align="center" sx={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{row.abc}</TableCell>
              <TableCell align="center" sx={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{row.xyz}</TableCell>
              <TableCell align="center" sx={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{row.sale + "₼"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableComponent;
