import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from '@mui/material';

const TableView = ({ data, columns, page, setPage, rowsPerPage, setRowsPerPage, totalRows }) => {
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Paper elevation={3} style={{ boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)', borderRadius: '12px', overflow: 'hidden', fontFamily: 'Roboto, sans-serif' }}>
      <TableContainer style={{ maxHeight: 800, borderRadius: '12px' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((column, index) => (
                <TableCell 
                  key={column} 
                  style={{ 
                    textAlign: 'center', 
                    fontWeight: '600', 
                    backgroundColor: '#003A7D', 
                    color: 'white',
                    fontSize: '1rem', 
                    padding: '20px 15px', // Increased padding for more height
                    ...(index === 0 && { borderTopLeftRadius: '12px' }),
                    ...(index === columns.length - 1 && { borderTopRightRadius: '12px' }),
                    borderBottom: '2px solid #e0e0e0',
                    fontFamily: 'Roboto, sans-serif'
                  }}
                >
                  {column}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow 
                key={index} 
                style={{ 
                  backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#ffffff', 
                  borderBottom: '1px solid #e0e0e0', 
                  transition: 'background-color 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    backgroundColor: '#e0e0e0',
                    boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)'
                  },
                  fontFamily: 'Roboto, sans-serif'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e0e0e0'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#f9f9f9' : '#ffffff'}
              >
                {columns.map((column) => (
                  <TableCell key={column} style={{ textAlign: 'center', fontSize: '1.1rem', fontWeight: '500', padding: '15px 19px', fontFamily: 'Roboto, sans-serif' }}> {/* Increased padding for more height */}
                    {typeof row[column] === 'number' ? row[column].toFixed(1) : row[column]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={totalRows}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default TableView;
