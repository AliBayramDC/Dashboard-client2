import React, { useState, useEffect } from "react";
import {
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  InputAdornment,
  Box,
  Typography,
} from "@mui/material";
import Header from "../components/Header";
import transactions from "../data/transactions.json"; // Adjust the path based on the actual location

const ABC = () => {
  const initialData1 = JSON.parse(localStorage.getItem("data1")) || [
    { Code: "A", Ratio: 0.4 },
    { Code: "B", Ratio: 0.8 },
    { Code: "C", Ratio: ">0.8" },
  ];
  const initialStartDate = localStorage.getItem("startDate") || "2023-01-01";
  const initialEndDate = localStorage.getItem("endDate") || "2023-12-31";
  const initialData2 = JSON.parse(localStorage.getItem("data2")) || [];
  const initialData3 = JSON.parse(localStorage.getItem("data3")) || [
    { Category: "X", Percentage: 10 },
    { Category: "Y", Percentage: 25 },
    { Category: "Z", Percentage: 100 },
  ];

  const [data1, setData1] = useState(initialData1); // Data for the first table
  const [data2, setData2] = useState(initialData2); // Data for the second table
  const [data3, setData3] = useState(initialData3); // Data for the third table
  const [startDate, setStartDate] = useState(initialStartDate); // Initial start date
  const [endDate, setEndDate] = useState(initialEndDate); // Initial end date

  const columns1 = ["Code", "Ratio"]; // Columns for the first table
  const columns2 = ["ProductName", "Sum", "Percentage", "Code"]; // Columns for the second table
  const columns3 = ["Category", "Percentage"]; // Columns for the third table

  useEffect(() => {
    if (initialData2.length === 0) {
      // Extract unique ProductName values from transactions.json if data2 is not already set
      const uniqueProductNames = [
        ...new Set(transactions.map((item) => item.ProductName)),
      ];
      const data = uniqueProductNames.map((productName) => ({
        ProductName: productName,
        Sum: 0, // Placeholder value
        Percentage: 0, // Placeholder value
        Code: "", // Placeholder value
      }));
      setData2(data);
    } else {
      filterData();
    }
  }, []);

  useEffect(() => {
    // Save state to localStorage whenever data1, data2, data3, startDate, or endDate changes
    localStorage.setItem("data1", JSON.stringify(data1));
    localStorage.setItem("data2", JSON.stringify(data2));
    localStorage.setItem("data3", JSON.stringify(data3));
    localStorage.setItem("startDate", startDate);
    localStorage.setItem("endDate", endDate);
  }, [data1, data2, data3, startDate, endDate]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.setItem("data1", JSON.stringify(data1));
      localStorage.setItem("data2", JSON.stringify(data2));
      localStorage.setItem("data3", JSON.stringify(data3));
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [data1, data2, data3]);

  const handleRatioChange = (index, value) => {
    const updatedData = [...data1];
    updatedData[index].Ratio = value;
    setData1(updatedData);
  };

  const handlePercentageChange = (index, value) => {
    const updatedData = [...data3];
    updatedData[index].Percentage = value;
    setData3(updatedData);
    localStorage.setItem("data3", JSON.stringify(updatedData)); // Save the updated data3 to localStorage
  };

  const filterData = () => {
    const filteredData = transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.Date);
      return (
        transactionDate >= new Date(startDate) &&
        transactionDate <= new Date(endDate)
      );
    });

    const updatedData2 = data2.map((item) => {
      const sum = filteredData
        .filter((transaction) => transaction.ProductName === item.ProductName)
        .reduce((acc, transaction) => acc + transaction.Sales, 0);
      return {
        ...item,
        Sum: Math.floor(sum), // Round sum down to the nearest integer
      };
    });

    // Calculate the total sum
    const totalSum = updatedData2.reduce((acc, item) => acc + item.Sum, 0);

    // Calculate the percentage for each row and the cumulative percentage
    let cumulativePercentage = 0;
    const finalData2 = updatedData2.map((item, index) => {
      const percentage = totalSum
        ? ((item.Sum / totalSum) * 100).toFixed(0)
        : 0;
      if (index === 0) {
        cumulativePercentage = parseFloat(percentage);
      } else {
        cumulativePercentage += parseFloat(percentage);
      }
      // Determine Code based on Percentage
      let code = "";
      if (cumulativePercentage <= data1[0].Ratio * 100) {
        code = data1[0].Code;
      } else if (cumulativePercentage <= data1[1].Ratio * 100) {
        code = data1[1].Code;
      } else {
        code = data1[2].Code;
      }
      return {
        ...item,
        Percentage: `${cumulativePercentage.toFixed(2)}%`,
        Code: code,
      };
    });

    setData2(finalData2);
    // Save the second table data in localStorage for access by Details component
    localStorage.setItem("abcData", JSON.stringify(finalData2));
  };

  return (
    <Box>
      <Box m="17px">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Header title="ABC" subtitle="ABC Analysis" />
        </Box>
      </Box>
      <Box
        sx={{
          width: "calc(100% - 32px)",
          maxWidth: "100%",
          padding: 0,
          marginLeft: "4px",
          overflowX: "hidden",
          boxSizing: "border-box",
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Paper
              elevation={3}
              sx={{
                padding: "20px",
                borderRadius: "12px",
                boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
                backgroundColor: "#f5f5f5",
                width: "100%",
                boxSizing: "border-box",
              }}
            >
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    label="Start Date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
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
                <Grid item xs={12}>
                  <TextField
                    label="End Date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
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
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    onClick={filterData}
                    sx={{
                      boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
                      mb: 2,
                      backgroundColor: "#003A7D",
                      fontSize: "1rem",
                      width: "100%",
                    }}
                  >
                    Get Data
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Paper
              elevation={3}
              sx={{
                padding: "20px",
                borderRadius: "12px",
                boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
                backgroundColor: "#f5f5f5",
                width: "100%",
                boxSizing: "border-box",
              }}
            >
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      {columns1.map((column) => (
                        <TableCell
                          key={column}
                          sx={{
                            fontWeight: "bold",
                            textAlign: "center",
                            backgroundColor: "#003A7D",
                            color: "white",
                            fontSize: "1rem",
                          }}
                        >
                          {column}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data1.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell
                          sx={{ textAlign: "center", fontSize: "1rem" }}
                        >
                          {row.Code}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          <TextField
                            value={row.Ratio}
                            onChange={(e) =>
                              handleRatioChange(index, e.target.value)
                            }
                            fullWidth
                            sx={{
                              fontSize: "1rem",
                              "& .MuiInputBase-input": {
                                textAlign: "center",
                              },
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper
              elevation={3}
              sx={{
                padding: "20px",
                borderRadius: "12px",
                boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
                backgroundColor: "#f5f5f5",
                width: "100%",
                boxSizing: "border-box",
              }}
            >
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      {columns2.map((column) => (
                        <TableCell
                          key={column}
                          sx={{
                            fontWeight: "bold",
                            textAlign: "center",
                            backgroundColor: "#003A7D",
                            color: "white",
                            fontSize: "1rem",
                          }}
                        >
                          {column}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data2.map((row, index) => (
                      <TableRow key={index}>
                        {columns2.map((column) => (
                          <TableCell
                            key={column}
                            sx={{ textAlign: "center", fontSize: "1rem" }}
                          >
                            {row[column]}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper
              elevation={3}
              sx={{
                padding: "20px",
                borderRadius: "12px",
                boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
                backgroundColor: "#f5f5f5",
                width: "100%",
                boxSizing: "border-box",
              }}
            >
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      {columns3.map((column) => (
                        <TableCell
                          key={column}
                          sx={{
                            fontWeight: "bold",
                            textAlign: "center",
                            backgroundColor: "#003A7D",
                            color: "white",
                            fontSize: "1rem",
                          }}
                        >
                          {column}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data3.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell
                          sx={{ textAlign: "center", fontSize: "1rem" }}
                        >
                          {row.Category}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          <TextField
                            value={row.Percentage}
                            onChange={(e) =>
                              handlePercentageChange(index, e.target.value)
                            }
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  %
                                </InputAdornment>
                              ),
                            }}
                            fullWidth
                            sx={{
                              fontSize: "1rem",
                              "& .MuiInputBase-input": {
                                textAlign: "center",
                              },
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default ABC;
