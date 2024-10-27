import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';

const SelectField = ({ options, selectedOption, handleChange }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', margin: '16px 0' }}>
      <FormControl sx={{ width: '100%', maxWidth: '1550px' }}>
        <InputLabel>Choose an Option</InputLabel>
        <Select
          value={selectedOption}
          onChange={handleChange}
          label="Choose an Option"
          sx={{
            backgroundColor: '#fff',
            borderRadius: '4px',
            '& .MuiOutlinedInput-root': {
              height: '40px', // Set a fixed height
              '& fieldset': {
                borderColor: '#ccc',
              },
              '&:hover fieldset': {
                borderColor: '#888',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#333',
              },
            },
          }}
        >
          {options.map((option, index) => (
            <MenuItem key={index} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default SelectField;
