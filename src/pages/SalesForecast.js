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
import productData from "../data/product_data.json"; // Adjust the path based on the actual location
import LineChart from "../components/LineChart"; // Import the LineChart component
import Header from "../components/Header";

const columns = [
  "#",
  "MONTH",
  "2022",
  "2023",
  "SPOLY",
  "CPOLY",
  "MA",
  "LA",
  "ESA",
  "ESA_LC",
  "ESA_UC",
  "LR",
];

const columnsMAD = [
  "SPOLY",
  "CPOLY",
  "MA",
  "LA",
  "ESA",
  "ESA_LC",
  "ESA_UC",
  "LR",
];

const initialData = [
  {
    "#": 1,
    MONTH: "January",
    2022: 0,
    2023: 0,
    SPOLY: 0,
    CPOLY: 0,
    MA: 0,
    LA: 0,
    ESA: 0,
    ESA_LC: 0,
    ESA_UC: 0,
    LR: 0,
  },
  {
    "#": 2,
    MONTH: "February",
    2022: 0,
    2023: 0,
    SPOLY: 0,
    CPOLY: 0,
    MA: 0,
    LA: 0,
    ESA: 0,
    ESA_LC: 0,
    ESA_UC: 0,
    LR: 0,
  },
  {
    "#": 3,
    MONTH: "March",
    2022: 0,
    2023: 0,
    SPOLY: 0,
    CPOLY: 0,
    MA: 0,
    LA: 0,
    ESA: 0,
    ESA_LC: 0,
    ESA_UC: 0,
    LR: 0,
  },
  {
    "#": 4,
    MONTH: "April",
    2022: 0,
    2023: 0,
    SPOLY: 0,
    CPOLY: 0,
    MA: 0,
    LA: 0,
    ESA: 0,
    ESA_LC: 0,
    ESA_UC: 0,
    LR: 0,
  },
  {
    "#": 5,
    MONTH: "May",
    2022: 0,
    2023: 0,
    SPOLY: 0,
    CPOLY: 0,
    MA: 0,
    LA: 0,
    ESA: 0,
    ESA_LC: 0,
    ESA_UC: 0,
    LR: 0,
  },
  {
    "#": 6,
    MONTH: "June",
    2022: 0,
    2023: 0,
    SPOLY: 0,
    CPOLY: 0,
    MA: 0,
    LA: 0,
    ESA: 0,
    ESA_LC: 0,
    ESA_UC: 0,
    LR: 0,
  },
  {
    "#": 7,
    MONTH: "July",
    2022: 0,
    2023: 0,
    SPOLY: 0,
    CPOLY: 0,
    MA: 0,
    LA: 0,
    ESA: 0,
    ESA_LC: 0,
    ESA_UC: 0,
    LR: 0,
  },
  {
    "#": 8,
    MONTH: "August",
    2022: 0,
    2023: 0,
    SPOLY: 0,
    CPOLY: 0,
    MA: 0,
    LA: 0,
    ESA: 0,
    ESA_LC: 0,
    ESA_UC: 0,
    LR: 0,
  },
  {
    "#": 9,
    MONTH: "September",
    2022: 0,
    2023: 0,
    SPOLY: 0,
    CPOLY: 0,
    MA: 0,
    LA: 0,
    ESA: 0,
    ESA_LC: 0,
    ESA_UC: 0,
    LR: 0,
  },
  {
    "#": 10,
    MONTH: "October",
    2022: 0,
    2023: 0,
    SPOLY: 0,
    CPOLY: 0,
    MA: 0,
    LA: 0,
    ESA: 0,
    ESA_LC: 0,
    ESA_UC: 0,
    LR: 0,
  },
  {
    "#": 11,
    MONTH: "November",
    2022: 0,
    2023: 0,
    SPOLY: 0,
    CPOLY: 0,
    MA: 0,
    LA: 0,
    ESA: 0,
    ESA_LC: 0,
    ESA_UC: 0,
    LR: 0,
  },
  {
    "#": 12,
    MONTH: "December",
    2022: 0,
    2023: 0,
    SPOLY: 0,
    CPOLY: 0,
    MA: 0,
    LA: 0,
    ESA: 0,
    ESA_LC: 0,
    ESA_UC: 0,
    LR: 0,
  },
];

const SalesForecast = () => {
  const [data, setData] = useState(initialData);
  const [madData, setMadData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedProduct, setSelectedProduct] = useState("Product1");
  const [multiplierSPOLY, setMultiplierSPOLY] = useState(1.1);
  const [multiplierCPOLY, setMultiplierCPOLY] = useState(1.06);
  const [smallestMADColumn, setSmallestMADColumn] = useState("");

  const uniqueProductNames = Object.keys(productData);

  useEffect(() => {
    if (selectedProduct) {
      const salesData2022 = new Array(12).fill(0);
      const salesData2023 = new Array(12).fill(0);

      transactions.forEach((transaction) => {
        if (transaction.ProductName === selectedProduct) {
          const transactionDate = new Date(transaction.Date);
          const month = transactionDate.getMonth();
          const year = transactionDate.getFullYear();

          if (year === 2022) {
            salesData2022[month] += transaction.Sales;
          } else if (year === 2023) {
            salesData2023[month] += transaction.Sales;
          }
        }
      });

      const lastThreeMonths2022 = salesData2022
        .slice(9, 12)
        .reduce((acc, sales) => acc + sales, 0);
      const lastThreeMonths2023 = salesData2023
        .slice(9, 12)
        .reduce((acc, sales) => acc + sales, 0);
      const calculatedCPOLYMultiplier =
        lastThreeMonths2023 / lastThreeMonths2022 || 1;

      const newData = initialData.map((row, index) => {
        const salesForMonth2022 = salesData2022[index];
        const salesForMonth2023 = salesData2023[index];
        const spolY = salesForMonth2022 * multiplierSPOLY;
        const cpolY = salesForMonth2022 * calculatedCPOLYMultiplier;
        return {
          ...row,
          2022: salesForMonth2022,
          2023: salesForMonth2023,
          SPOLY: spolY,
          CPOLY: cpolY,
          ESA: productData[selectedProduct].ESA[index] || 0,
          ESA_LC: productData[selectedProduct].ESA_LC[index] || 0,
          ESA_UC: productData[selectedProduct].ESA_UC[index] || 0,
          LR: productData[selectedProduct].LR[index] || 0,
        };
      });

      // Calculate the MA values
      for (let i = 0; i < newData.length; i++) {
        if (i === 0) {
          newData[i]["MA"] =
            (salesData2022[6] + salesData2022[7] + salesData2022[8]) / 3;
        } else if (i === 1) {
          newData[i]["MA"] =
            (salesData2022[7] + salesData2022[8] + salesData2022[9]) / 3;
        } else if (i === 2) {
          newData[i]["MA"] =
            (salesData2022[8] + salesData2022[9] + salesData2022[10]) / 3;
        } else if (i === 3) {
          newData[i]["MA"] =
            (salesData2022[9] + salesData2022[10] + salesData2022[11]) / 3;
        } else if (i === 4) {
          newData[i]["MA"] =
            (salesData2022[10] + salesData2022[11] + newData[0]["MA"]) / 3;
        } else if (i === 5) {
          newData[i]["MA"] =
            (salesData2022[11] + newData[0]["MA"] + newData[1]["MA"]) / 3;
        } else if (i === 6) {
          newData[i]["MA"] =
            (newData[0]["MA"] + newData[1]["MA"] + newData[2]["MA"]) / 3;
        } else if (i === 7) {
          newData[i]["MA"] =
            (newData[1]["MA"] + newData[2]["MA"] + newData[3]["MA"]) / 3;
        } else if (i === 8) {
          newData[i]["MA"] =
            (newData[2]["MA"] + newData[3]["MA"] + newData[4]["MA"]) / 3;
        } else if (i === 9) {
          newData[i]["MA"] =
            (newData[3]["MA"] + newData[4]["MA"] + newData[5]["MA"]) / 3;
        } else if (i === 10) {
          newData[i]["MA"] =
            (newData[4]["MA"] + newData[5]["MA"] + newData[6]["MA"]) / 3;
        } else if (i === 11) {
          newData[i]["MA"] =
            (newData[5]["MA"] + newData[6]["MA"] + newData[7]["MA"]) / 3;
        }
      }

      // Calculate the LA values
      for (let i = 0; i < newData.length; i++) {
        if (i === 0) {
          newData[i]["LA"] =
            (salesData2022[8] - salesData2022[6]) / 2 + salesData2022[8];
        } else if (i === 1) {
          newData[i]["LA"] =
            (salesData2022[9] - salesData2022[7]) / 2 + salesData2022[9];
        } else if (i === 2) {
          newData[i]["LA"] =
            (salesData2022[10] - salesData2022[8]) / 2 + salesData2022[10];
        } else if (i === 3) {
          newData[i]["LA"] =
            (salesData2022[11] - salesData2022[9]) / 2 + salesData2022[11];
        } else if (i === 4) {
          newData[i]["LA"] =
            (newData[0]["LA"] - salesData2022[10]) / 2 + newData[0]["LA"];
        } else if (i === 5) {
          newData[i]["LA"] =
            (newData[1]["LA"] - salesData2022[11]) / 2 + newData[1]["LA"];
        } else if (i === 6) {
          newData[i]["LA"] =
            (newData[2]["LA"] - newData[0]["LA"]) / 2 + newData[2]["LA"];
        } else if (i === 7) {
          newData[i]["LA"] =
            (newData[3]["LA"] - newData[1]["LA"]) / 2 + newData[3]["LA"];
        } else if (i === 8) {
          newData[i]["LA"] =
            (newData[4]["LA"] - newData[2]["LA"]) / 2 + newData[4]["LA"];
        } else if (i === 9) {
          newData[i]["LA"] =
            (newData[5]["LA"] - newData[3]["LA"]) / 2 + newData[5]["LA"];
        } else if (i === 10) {
          newData[i]["LA"] =
            (newData[6]["LA"] - newData[4]["LA"]) / 2 + newData[6]["LA"];
        } else if (i === 11) {
          newData[i]["LA"] =
            (newData[7]["LA"] - newData[5]["LA"]) / 2 + newData[7]["LA"];
        }
      }

      // Format the "#" column
      newData.forEach(row => {
        row["#"] = Number(row["#"]).toString();
      });

      setMultiplierCPOLY(calculatedCPOLYMultiplier);
      setData(newData);

      // Calculate MAD for each column
      const madSPOLY =
        newData.reduce(
          (acc, row) => acc + Math.abs(row["2023"] - row["SPOLY"]),
          0
        ) / newData.length;
      const madCPOLY =
        newData.reduce(
          (acc, row) => acc + Math.abs(row["2023"] - row["CPOLY"]),
          0
        ) / newData.length;
      const madMA =
        newData.reduce(
          (acc, row) => acc + Math.abs(row["2023"] - row["MA"]),
          0
        ) / newData.length;
      const madLA =
        newData.reduce(
          (acc, row) => acc + Math.abs(row["2023"] - row["LA"]),
          0
        ) / newData.length;
      const madESA =
        newData.reduce(
          (acc, row) => acc + Math.abs(row["2023"] - row["ESA"]),
          0
        ) / newData.length;
      const madESALC =
        newData.reduce(
          (acc, row) => acc + Math.abs(row["2023"] - row["ESA_LC"]),
          0
        ) / newData.length;
      const madESAUC =
        newData.reduce(
          (acc, row) => acc + Math.abs(row["2023"] - row["ESA_UC"]),
          0
        ) / newData.length;
      const madLR =
        newData.reduce(
          (acc, row) => acc + Math.abs(row["2023"] - row["LR"]),
          0
        ) / newData.length;

      const madResult = [
        {
          SPOLY: madSPOLY,
          CPOLY: madCPOLY,
          MA: madMA,
          LA: madLA,
          ESA: madESA,
          ESA_LC: madESALC,
          ESA_UC: madESAUC,
          LR: madLR,
        },
      ];

      setMadData(madResult);

      // Find the column with the smallest MAD value
      const smallestMADColumn = Object.keys(madResult[0]).reduce((a, b) =>
        madResult[0][a] < madResult[0][b] ? a : b
      );
      setSmallestMADColumn(smallestMADColumn);
    }
  }, [selectedProduct, multiplierSPOLY]);

  const handleProductChange = (e) => {
    setSelectedProduct(e.target.value);
  };

  const handleMultiplierSPOLYChange = (e) => {
    setMultiplierSPOLY(parseFloat(e.target.value));
  };

  return (
    <Box
      sx={{
        width: "1249px",
      }}
    >
      <Box ml="17px" mt="14px">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Header
            title="SALES FORECAST"
            subtitle="Welcome to Sales Forecast page"
          />
        </Box>
      </Box>
      <Box
        sx={{
          padding: 0,
          marginLeft: "11px",
          overflowX: "auto",
          boxSizing: "border-box",
        }}
      >
        <Typography
          variant="h1"
          color="#172b4d"
          gutterBottom
          sx={{
            fontFamily: "Roboto, sans-serif",
            fontSize: "2rem",
            fontWeight: 700,
            textAlign: "center",
            margin: "15px 0",
          }}
        >
          MAD
        </Typography>
        <TableView
          data={madData}
          columns={columnsMAD}
          page={page}
          setPage={setPage}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          totalRows={madData.length}
        />
        <Paper
          elevation={3}
          sx={{
            padding: "20px",
            marginTop: "20px",
            borderRadius: "12px",
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
            backgroundColor: "#fff",
          }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Select Product"
                select
                value={selectedProduct}
                onChange={handleProductChange}
                fullWidth
                sx={{
                  backgroundColor: "white",
                  borderRadius: "8px",
                  boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
                  mb: 2,
                }}
              >
                <MenuItem value="">Select a product</MenuItem>
                {uniqueProductNames.map((product) => (
                  <MenuItem key={product} value={product}>
                    {product}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="SPOLY Multiplier"
                type="number"
                value={multiplierSPOLY}
                onChange={handleMultiplierSPOLYChange}
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
                label="CPOLY Multiplier"
                type="number"
                value={multiplierCPOLY}
                readOnly
                fullWidth
                sx={{
                  backgroundColor: "white",
                  borderRadius: "8px",
                  boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
                  mb: 2,
                }}
              />
            </Grid>
          </Grid>
        </Paper>
        <Typography
          variant="h1"
          color="#172b4d"
          gutterBottom
          sx={{
            fontFamily: "Roboto, sans-serif",
            fontSize: "2rem",
            fontWeight: 700,
            textAlign: "center",
            margin: "15px 0",
          }}
        >
          FORECAST
        </Typography>
        <TableView
          data={data}
          columns={columns}
          page={page}
          setPage={setPage}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          totalRows={data.length}
        />
      </Box>
      <Box
      sx={{
        marginLeft: "11px",
      }}>
        <LineChart data={data} smallestMADColumn={smallestMADColumn} />
      </Box>
    </Box>
  );
};

export default SalesForecast;
