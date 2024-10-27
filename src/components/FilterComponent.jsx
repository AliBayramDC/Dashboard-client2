import React, { useState, useEffect } from 'react';
import transactions from '../data/transactions.json';
import { Button, MenuItem, Checkbox, FormControlLabel, Popper, ClickAwayListener, Paper, useTheme, Typography } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { tokens } from '../theme';

const FilterComponent = ({ onFilterChange, defaultFilters }) => {
  const [yearOptions, setYearOptions] = useState([]);
  const [productOptions, setProductOptions] = useState([]);
  const [abcOptions] = useState(['A', 'B', 'C']);
  const [xyzOptions] = useState(['X', 'Y', 'Z']);
  const [selectedFilters, setSelectedFilters] = useState(defaultFilters);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentFilter, setCurrentFilter] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    const years = [...new Set(transactions.map(item => new Date(item.Date).getFullYear()))];
    const products = [...new Set(transactions.map(item => item.ProductName))];
    setYearOptions(years);
    setProductOptions(products);
  }, []);

  useEffect(() => {
    onFilterChange(selectedFilters);
  }, [selectedFilters, onFilterChange]);

  const handleHoverEnter = (event, filterType) => {
    setAnchorEl(event.currentTarget);
    setCurrentFilter(filterType);
    setMenuOpen(true);
  };

  const handleHoverLeave = () => {
    setMenuOpen(false);
  };

  const handleCheckboxChange = (filterType, value) => {
    setSelectedFilters(prevState => {
      const newFilters = { ...prevState };
      if (newFilters[filterType].includes(value)) {
        newFilters[filterType] = newFilters[filterType].filter(item => item !== value);
      } else {
        newFilters[filterType].push(value);
      }
      return newFilters;
    });
  };

  const renderMenuItems = (options) => (
    options.map(option => (
      <MenuItem key={option} dense sx={{ padding: '4px 8px', color: "#003A7D" }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={selectedFilters[currentFilter].includes(option)}
              onChange={() => handleCheckboxChange(currentFilter, option)}
              sx={{ padding: '0 13px', color: "#003A7D" }}
            />
          }
          label={option}
          sx={{ margin: 0, fontSize: '0.875rem' }}
        />
      </MenuItem>
    ))
  );

  return (
    <div style={{ display: 'flex', gap: '30px' }}>
      <div 
        onMouseEnter={(e) => handleHoverEnter(e, 'Year')}
        onMouseLeave={handleHoverLeave}
      >
        <Button
          variant="outlined"
          endIcon={<ArrowDropDownIcon />}
          sx={{
            color: "#003A7D",
            borderColor: "#003A7D",
            borderWidth: '3px',
            '&:hover': {
              borderWidth: '3px',
              borderColor: "#003A7D",
            },
          }}
        >
          <Typography fontWeight="bold">Year</Typography>
        </Button>
      </div>
      <div 
        onMouseEnter={(e) => handleHoverEnter(e, 'Product')}
        onMouseLeave={handleHoverLeave}
      >
        <Button
          variant="outlined"
          endIcon={<ArrowDropDownIcon />}
          sx={{
            color: "#003A7D",
            borderColor: "#003A7D",
            borderWidth: '3px',
            '&:hover': {
              borderWidth: '3px',
              borderColor: "#003A7D",
            },
          }}
        >
          <Typography fontWeight="bold">Product</Typography>
        </Button>
      </div>
      {/* <div 
        onMouseEnter={(e) => handleHoverEnter(e, 'ABC')}
        onMouseLeave={handleHoverLeave}
      >
        <Button
          variant="outlined"
          endIcon={<ArrowDropDownIcon />}
          sx={{
            color: "#003A7D",
            borderColor: "#003A7D",
            borderWidth: '3px',
            '&:hover': {
              borderWidth: '3px',
              borderColor: "#003A7D",
            },
          }}
        >
          <Typography fontWeight="bold">ABC</Typography>
        </Button>
      </div>
      <div 
        onMouseEnter={(e) => handleHoverEnter(e, 'XYZ')}
        onMouseLeave={handleHoverLeave}
      >
        <Button
          variant="outlined"
          endIcon={<ArrowDropDownIcon />}
          sx={{
            color: "#003A7D",
            borderColor: "#003A7D",
            borderWidth: '3px',
            '&:hover': {
              borderWidth: '3px',
              borderColor: "#003A7D",
            },
          }}
        >
          <Typography fontWeight="bold">XYZ</Typography>
        </Button>
      </div> */}

      <Popper
        open={menuOpen}
        anchorEl={anchorEl}
        placement="bottom-start"
        onMouseEnter={() => setMenuOpen(true)}
        onMouseLeave={() => setMenuOpen(false)}
      >
        <ClickAwayListener onClickAway={() => setMenuOpen(false)}>
          <Paper sx={{ backgroundColor: colors.primary[400], color: "#003A7D" }}>
            {currentFilter && renderMenuItems(
              currentFilter === 'Year' ? yearOptions :
              currentFilter === 'Product' ? productOptions :
              currentFilter === 'ABC' ? abcOptions :
              xyzOptions
            )}
          </Paper>
        </ClickAwayListener>
      </Popper>
    </div>
  );
};

export default FilterComponent;
