import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  TextField,
  MenuItem,
  Grid,
  Paper,
} from "@mui/material";
import TableView from "../components/TableView";
import transactions from "../data/transactions.json"; // Adjust the path based on the actual location
import { jStat } from "jstat"; // Import jStat for NORM.S.INV calculation
import { standardDeviation, mean } from "simple-statistics"; // Import standardDeviation and mean from simple-statistics
import Header from "../components/Header";

const columns = [
  "ProductName",
  "NS",
  "COGS",
  "AI",
  "ITR",
  "DSI",
  "GM",
  "GMRol",
  "GP",
  "Q_O",
  "SS",
  "PC",
  "PC_2",
  "CV",
  "EI",
];

const AI_VALUES = [43.4, 240, 206, 85.5, 50];

const Details = () => {
  const [data, setData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [startDate, setStartDate] = useState("2023-12-01");
  const [endDate, setEndDate] = useState("2023-12-31");
  const [abcData, setAbcData] = useState([]);
  const [selectedYear, setSelectedYear] = useState("2022");
  const [stdYear, setStdYear] = useState("2022");
  const [normSInvValue, setNormSInvValue] = useState(0.95);
  const [multiplier, setMultiplier] = useState(7);
  const [cvYear, setCvYear] = useState("2022");
  const [categories, setCategories] = useState([
    { Category: "X", Percentage: 10 },
    { Category: "Y", Percentage: 25 },
    { Category: "Z", Percentage: 100 },
  ]);

  useEffect(() => {
    setAllData(transactions);
    // Fetch the ABC data from localStorage
    const storedAbcData = JSON.parse(localStorage.getItem("abcData")) || [];
    setAbcData(storedAbcData);
    // Fetch the XYZ data from localStorage
    const storedCategories = JSON.parse(localStorage.getItem("data3")) || [
      { Category: "X", Percentage: 10 },
      { Category: "Y", Percentage: 25 },
      { Category: "Z", Percentage: 100 },
    ];
    setCategories(storedCategories);
  }, []);

  useEffect(() => {
    filterData(); // Automatically filter data when component mounts
  }, [
    allData,
    startDate,
    endDate,
    abcData,
    selectedYear,
    stdYear,
    normSInvValue,
    multiplier,
    cvYear,
    categories,
  ]);

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  const handleStdYearChange = (e) => {
    setStdYear(e.target.value);
  };

  const handleNormSInvValueChange = (e) => {
    setNormSInvValue(parseFloat(e.target.value));
  };

  const handleMultiplierChange = (e) => {
    setMultiplier(parseFloat(e.target.value));
  };

  const handleCvYearChange = (e) => {
    setCvYear(e.target.value);
  };

  const calculateStdDev = (productName, year) => {
    const yearData = allData.filter(
      (transaction) =>
        transaction.ProductName === productName &&
        new Date(transaction.Date).getFullYear() === parseInt(year)
    );
    const quantitySoldValues = yearData.map(
      (transaction) => transaction.QuantitySold
    );
    return standardDeviation(quantitySoldValues);
  };

  const calculateMean = (productName, year) => {
    const yearData = allData.filter(
      (transaction) =>
        transaction.ProductName === productName &&
        new Date(transaction.Date).getFullYear() === parseInt(year)
    );
    const quantitySoldValues = yearData.map(
      (transaction) => transaction.QuantitySold
    );
    return mean(quantitySoldValues);
  };

  const determineCategory = (cvPercentage) => {
    if (cvPercentage <= categories[0].Percentage) {
      return categories[0].Category;
    } else if (cvPercentage <= categories[1].Percentage) {
      return categories[1].Category;
    } else {
      return categories[2].Category;
    }
  };

  const getCostPrice = (productName) => {
    const product = allData.find(
      (transaction) => transaction.ProductName === productName
    );
    return product ? product.CostPrice : 0;
  };

  const filterData = () => {
    if (startDate && endDate && selectedYear && stdYear && cvYear) {
      const filteredData = allData.filter((transaction) => {
        const transactionDate = new Date(transaction.Date);
        return (
          transactionDate >= new Date(startDate) &&
          transactionDate <= new Date(endDate)
        );
      });

      const aggregatedData = filteredData.reduce((acc, transaction) => {
        const existingProduct = acc.find(
          (item) => item.ProductName === transaction.ProductName
        );
        if (existingProduct) {
          existingProduct.NS += transaction.Sales;
          existingProduct.COGS += transaction.COGS;
        } else {
          acc.push({
            ProductName: transaction.ProductName,
            NS: transaction.Sales,
            COGS: transaction.COGS,
            AI: 0, // Placeholder values
            ITR: 0,
            DSI: 0,
            GM: 0,
            GMRol: 0,
            GP: 0,
            Q_O: 0,
            SS: 0,
            PC: 0,
            PC_2: 0,
            CV: 0,
            EI: 0,
            GMRolTarget: 0,
            TfFI: 0,
            PD: 0,
          });
        }
        return acc;
      }, []);

      // Calculate total days in date range
      const start = new Date(startDate);
      const end = new Date(endDate);
      const totalDays = (end - start) / (1000 * 60 * 60 * 24);

      // Assign AI values, calculate ITR, DSI, GM, GMRol, GP, PC, Q_O, SS, CV, and EI
      const updatedAggregatedData = aggregatedData.map((item, index) => {
        const ai = AI_VALUES[index % AI_VALUES.length];
        const itr = ai !== 0 ? (item.COGS / ai).toFixed(2) : 0;
        const dsi = itr !== 0 ? (totalDays / itr).toFixed(2) : 0;
        const gm =
          item.NS !== 0
            ? (((item.NS - item.COGS) / item.NS) * 100).toFixed(2)
            : 0;
        const gmAsDecimal = gm / 100; // Convert GM from percentage to decimal for calculation
        const gmrol = ai !== 0 ? ((item.NS / ai) * gmAsDecimal).toFixed(2) : 0;
        const gp = (item.NS - item.COGS).toFixed(2); // Calculate GP as NS - COGS

        // Get the Code from abcData
        const abcProduct = abcData.find(
          (abcItem) => abcItem.ProductName === item.ProductName
        );
        const pc = abcProduct ? abcProduct.Code : "";

        // Calculate Q_O
        const quantitySold =
          (allData
            .filter(
              (transaction) =>
                transaction.ProductName === item.ProductName &&
                new Date(transaction.Date).getFullYear() ===
                  parseInt(selectedYear)
            )
            .reduce((acc, transaction) => acc + transaction.QuantitySold, 0) /
            365) *
          multiplier;

        // Calculate SS using NORM.S.INV, STDVP, and Multiplier
        const normSInvResult = jStat.normal.inv(normSInvValue, 0, 1);
        const stdDev = calculateStdDev(item.ProductName, stdYear);
        const ss = normSInvResult * stdDev * Math.sqrt(multiplier);

        // Calculate CV
        const avgQuantitySold = calculateMean(item.ProductName, cvYear);
        const cv =
          avgQuantitySold !== 0
            ? ((stdDev / avgQuantitySold) * 100).toFixed(2)
            : 0;

        // Determine PC_2
        const cvPercentage = parseFloat(cv);
        const pc2 = determineCategory(cvPercentage);

        // Calculate EI
        const costPrice = getCostPrice(item.ProductName);
        const ei = (ai - (quantitySold + ss)) * costPrice;

        return {
          ...item,
          AI: ai,
          ITR: parseFloat(itr),
          DSI: parseFloat(dsi),
          GM: `${gm}%`,
          GMRol: `${gmrol}`,
          GP: parseFloat(gp),
          PC: pc,
          Q_O: quantitySold.toFixed(2),
          SS: ss.toFixed(2),
          CV: `${cv}%`,
          PC_2: pc2,
          EI: ei.toFixed(2),
        };
      });

      // Update PC_2 based on CV values and XYZ percentages
      const updatedDataWithPC2 = updatedAggregatedData.map((item) => {
        const cvValue = parseFloat(item.CV.replace('%', ''));
        let pc2 = 'Z';
        if (cvValue < categories[0].Percentage) {
          pc2 = 'X';
        } else if (cvValue >= categories[0].Percentage && cvValue < categories[1].Percentage) {
          pc2 = 'Y';
        }
        return {
          ...item,
          PC_2: pc2,
        };
      });

      setData(updatedDataWithPC2);
    }
  };

  return (
    <Box>
      <Box m="17px">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Header title="DETAILS" subtitle="Welcome to details table" />
        </Box>
      </Box>
      <Box style={{ width: "99%", padding: 0, marginLeft: "11px" }}>
        <Box
          style={{
            overflowX: "auto",
            display: "block",
          }}
        >
          <TableView
            data={data}
            columns={columns}
            page={page}
            setPage={setPage}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
            totalRows={data.length}
            sx={{
              width: "100%",
              maxWidth: "100%",
            }}
          />
        </Box>
        <Paper
          elevation={3}
          sx={{
            padding: "1px",
            marginTop: "20px",
            borderRadius: "12px",
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
            backgroundColor: "#f5f5f5",
          }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Start Date"
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  filterData();
                }}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{
                  backgroundColor: "white",
                  borderRadius: "8px",
                  boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
                  mb: 2,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="End Date"
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  filterData();
                }}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{
                  backgroundColor: "white",
                  borderRadius: "8px",
                  boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
                  mb: 2,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Year"
                select
                value={selectedYear}
                onChange={(e) => {
                  setSelectedYear(e.target.value);
                  filterData();
                }}
                fullWidth
                sx={{
                  backgroundColor: "white",
                  borderRadius: "8px",
                  boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
                  mb: 2,
                }}
              >
                <MenuItem value="2022">2022</MenuItem>
                <MenuItem value="2023">2023</MenuItem>
                {/* Add more options as needed */}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="STD Year"
                select
                value={stdYear}
                onChange={(e) => {
                  setStdYear(e.target.value);
                  filterData();
                }}
                fullWidth
                sx={{
                  backgroundColor: "white",
                  borderRadius: "8px",
                  boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
                  mb: 2,
                }}
              >
                <MenuItem value="2022">2022</MenuItem>
                <MenuItem value="2023">2023</MenuItem>
                {/* Add more options as needed */}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="NORM.S.INV Value"
                type="number"
                value={normSInvValue}
                onChange={(e) => {
                  setNormSInvValue(parseFloat(e.target.value));
                  filterData();
                }}
                fullWidth
                sx={{
                  backgroundColor: "white",
                  borderRadius: "8px",
                  boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
                  mb: 2,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Multiplier"
                type="number"
                value={multiplier}
                onChange={(e) => {
                  setMultiplier(parseFloat(e.target.value));
                  filterData();
                }}
                fullWidth
                sx={{
                  backgroundColor: "white",
                  borderRadius: "8px",
                  boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
                  mb: 2,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="CV Year"
                select
                value={cvYear}
                onChange={(e) => {
                  setCvYear(e.target.value);
                  filterData();
                }}
                fullWidth
                sx={{
                  backgroundColor: "white",
                  borderRadius: "8px",
                  boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
                  mb: 2,
                }}
              >
                <MenuItem value="2022">2022</MenuItem>
                <MenuItem value="2023">2023</MenuItem>
                {/* Add more options as needed */}
              </TextField>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Box>
  );
  

};

export default Details;
