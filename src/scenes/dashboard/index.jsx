import React, { useState, useEffect } from "react";
import { Box, TextField, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import NumbersIcon from "@mui/icons-material/Numbers";
import LoopIcon from "@mui/icons-material/Loop";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrafficIcon from "@mui/icons-material/Traffic";
import Header from "../../components/Header";
import StatBox from "../../components/StatBox";
import FilterComponent from "../../components/FilterComponent"; // Adjust the import path if necessary
import transactions from "../../data/transactions.json"; // Adjust the import path if necessary
import { jStat } from "jstat"; // Make sure to install jstat library
import { standardDeviation, mean } from "simple-statistics"; // Make sure to install simple-statistics library
import TableComponent from "../../components/TableComponent"; // Adjust the import path if necessary
import ABCPieTable from "../../components/ABCPieTable"; // Adjust the import path if necessary

const averageInventoryData = {
  Product1: 43.4,
  Product2: 240,
  Product3: 206,
  Product4: 85.5,
  Product5: 50,
};

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Set default filters
  const defaultYear = [2023];
  const defaultProducts = [
    ...new Set(transactions.map((item) => item.ProductName)),
  ];

  const [filters, setFilters] = useState({
    Year: defaultYear,
    Product: defaultProducts,
    ABC: [],
    XYZ: [],
  });

  const [averageInventory, setAverageInventory] = useState(0);
  const [totalCOGS, setTotalCOGS] = useState(0);
  const [inventoryTurnover, setInventoryTurnover] = useState(0);
  const [netSales, setNetSales] = useState(0);
  const [grossMargin, setGrossMargin] = useState(0);
  const [returnOnInventory, setReturnOnInventory] = useState(0);
  const [preferredInventory, setPreferredInventory] = useState(0);
  const [daysOfStock, setDaysOfStock] = useState(7);
  const [normSInvValue, setNormSInvValue] = useState(0.95);
  const [safetyStock, setSafetyStock] = useState(0);
  const [yourSave, setYourSave] = useState(0);
  const [tableData, setTableData] = useState([]);
  const [abcCategories, setAbcCategories] = useState({});

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  useEffect(() => {
    // Precompute ABC categories based on selected years
    const selectedYears = filters.Year;
    let totalSales = 0;

    // Calculate total sales for the selected years
    transactions.forEach((transaction) => {
      const transactionYear = new Date(transaction.Date).getFullYear();
      if (
        selectedYears.length === 0 ||
        selectedYears.includes(transactionYear)
      ) {
        totalSales += transaction.Sales || 0;
      }
    });

    // Calculate the percentage of total sales for each product
    let productSalesData = transactions.reduce((acc, transaction) => {
      const transactionYear = new Date(transaction.Date).getFullYear();
      if (
        selectedYears.length === 0 ||
        selectedYears.includes(transactionYear)
      ) {
        const productName = transaction.ProductName;
        if (!acc[productName]) {
          acc[productName] = { sales: 0 };
        }
        acc[productName].sales += transaction.Sales || 0;
      }
      return acc;
    }, {});

    productSalesData = Object.entries(productSalesData).map(
      ([product, data]) => ({
        product,
        sales: data.sales,
        percentage: totalSales > 0 ? (data.sales / totalSales) * 100 : 0,
      })
    );

    // Sort products by sales percentage in descending order
    productSalesData.sort((a, b) => b.percentage - a.percentage);

    // Calculate cumulative percentages starting from the second highest
    let cumulativePercentage = 0;
    productSalesData.forEach((item, index) => {
      if (index > 0) {
        cumulativePercentage += productSalesData[index - 1].percentage;
        item.cumulativePercentage = cumulativePercentage + item.percentage;
      } else {
        item.cumulativePercentage = item.percentage;
      }
    });

    // Determine ABC category based on cumulative percentages
    const abcCategories = {};
    productSalesData.forEach((item) => {
      if (item.cumulativePercentage < 40) {
        abcCategories[item.product] = "A";
      } else if (
        item.cumulativePercentage >= 40 &&
        item.cumulativePercentage < 80
      ) {
        abcCategories[item.product] = "B";
      } else {
        abcCategories[item.product] = "C";
      }
    });

    setAbcCategories(abcCategories);
  }, [filters.Year]);

  useEffect(() => {
    // Generate table data based on selected products
    const selectedProducts = filters.Product;
    const data = selectedProducts.map((product) => {
      const productTransactions = transactions.filter((transaction) => {
        const transactionYear = new Date(transaction.Date).getFullYear();
        return (
          transaction.ProductName === product &&
          (filters.Year.length === 0 || filters.Year.includes(transactionYear))
        );
      });

      const quantities = productTransactions.map(
        (transaction) => transaction.QuantitySold || 0
      );
      const productMean = mean(quantities);
      const productStandardDeviation = standardDeviation(quantities);
      const cv =
        productMean > 0 ? (productStandardDeviation / productMean) * 100 : 0;

      let xyzCategory = "";
      if (cv < 10) {
        xyzCategory = "X";
      } else if (cv >= 10 && cv < 50) {
        xyzCategory = "Y";
      } else {
        xyzCategory = "Z";
      }

      return {
        product,
        abc: abcCategories[product] || "",
        xyz: xyzCategory,
        sale: productTransactions
          .reduce((acc, transaction) => acc + (transaction.Sales || 0), 0)
          .toFixed(2),
      };
    });

    // Sort data by sales in descending order
    data.sort((a, b) => b.sale - a.sale);

    setTableData(data);
  }, [filters, abcCategories]);

  useEffect(() => {
    // Calculate Average Inventory
    const selectedProducts = filters.Product;
    let totalAverage = 0;

    selectedProducts.forEach((product) => {
      totalAverage += averageInventoryData[product] || 0;
    });

    setAverageInventory(totalAverage);

    // Calculate total COGS, Net Sales, and Quantity Sold based on selected Year and Product
    const selectedYears = filters.Year;
    let cogsSum = 0;
    let salesSum = 0;
    let totalQuantitySold = 0;
    let quantities = [];
    let totalDays = 0;
    let costPriceSum = 0;

    if (selectedYears.length === 0 && selectedProducts.length === 0) {
      cogsSum = 0;
      salesSum = 0;
      totalQuantitySold = 0;
    } else {
      transactions.forEach((transaction) => {
        const transactionYear = new Date(transaction.Date).getFullYear();
        if (
          (selectedYears.length === 0 ||
            selectedYears.includes(transactionYear)) &&
          (selectedProducts.length === 0 ||
            selectedProducts.includes(transaction.ProductName))
        ) {
          cogsSum += transaction.COGS || 0;
          salesSum += transaction.Sales || 0;
          totalQuantitySold += transaction.QuantitySold || 0;
          quantities.push(transaction.QuantitySold || 0);
          totalDays++;
          costPriceSum +=
            (transaction.CostPrice || 0) * (transaction.QuantitySold || 0);
        }
      });
    }

    setTotalCOGS(cogsSum);
    setNetSales(salesSum);

    // Calculate Inventory Turnover
    const turnover = totalAverage > 0 ? cogsSum / totalAverage : 0;
    setInventoryTurnover(turnover);

    // Calculate Gross Margin
    const margin = salesSum > 0 ? ((salesSum - cogsSum) / salesSum) * 100 : 0;
    setGrossMargin(margin);

    // Calculate Return on Inventory
    const roi =
      totalAverage > 0 ? (salesSum / totalAverage) * (margin / 100) : 0;
    setReturnOnInventory(roi);

    // Calculate Preferred Inventory
    const avgDailyQuantitySold =
      totalDays > 0 ? totalQuantitySold / totalDays : 0;
    const preferredInventoryValue = avgDailyQuantitySold * daysOfStock;
    setPreferredInventory(preferredInventoryValue);

    // Calculate Safety Stock
    const standardDeviation = jStat.stdev(quantities);
    const safetyStockValue =
      jStat.normal.inv(normSInvValue, 0, 1) *
      standardDeviation *
      Math.sqrt(daysOfStock);
    setSafetyStock(safetyStockValue);

    // Calculate Your Save
    const avgCostPrice =
      totalQuantitySold > 0 ? costPriceSum / totalQuantitySold : 0;
    const yourSaveValue =
      (totalAverage - (preferredInventoryValue + safetyStockValue)) *
      avgCostPrice;
    setYourSave(yourSaveValue);
  }, [filters, daysOfStock, normSInvValue]);

  const filteredTableData = tableData.filter(
    (item) =>
      (filters.ABC.length === 0 || filters.ABC.includes(item.abc)) &&
      (filters.XYZ.length === 0 || filters.XYZ.includes(item.xyz))
  );

  return (
    <Box ml="5px" width="100%">
      {/* HEADER */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        m="15px"
      >
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(16, 1fr)"
        gridTemplateRows="repeat(3, 1fr)"
        gridAutoRows="100px"
        gap="8.7px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn="span 12"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{ boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)" }}
        >
          <FilterComponent
            onFilterChange={handleFilterChange}
            defaultFilters={filters}
          />
        </Box>
        <Box
          gridColumn="span 2"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#003A7D",
                borderWidth: "3px",
              },
              "&:hover fieldset": {
                borderColor: "#003A7D",
                borderWidth: "3px",
              },
            },
          }}
        >
          <TextField
            label="Days of Stock"
            type="number"
            value={daysOfStock}
            onChange={(e) => setDaysOfStock(Number(e.target.value))}
            inputProps={{ min: 1 }}
            fullWidth
            sx={{
              width: "100px",
              height: "65px",
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#003A7D",
                  borderWidth: "3px",
                },
                "&:hover fieldset": {
                  borderColor: "#003A7D",
                  borderWidth: "3px",
                },
              },
              "& .MuiInputLabel-root": {
                fontWeight: "500", // Set label to medium weight
                color: "#003A7D",
              },
              "& .MuiInputBase-input": {
                fontWeight: "bold",
                fontSize: '1.5rem',
                color:'#003A7D' // Set input text to bold
              },
            }}
          />
        </Box>
        <Box
          gridColumn="span 2"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#003A7D",
                borderWidth: "3px",
              },
              "&:hover fieldset": {
                borderColor: "#003A7D",
                borderWidth: "3px",
              },
            },
          }}
        >
          <TextField
            label="Norm Inv Value"
            type="number"
            value={normSInvValue}
            onChange={(e) => setNormSInvValue(Number(e.target.value))}
            inputProps={{ min: 0, max: 1, step: 0.01 }}
            fullWidth
            sx={{
              width: "100px",
              height: "65px",
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#003A7D",
                  borderWidth: "3px",
                },
                "&:hover fieldset": {
                  borderColor: "#003A7D",
                  borderWidth: "3px",
                },
              },
              "& .MuiInputLabel-root": {
                fontWeight: "500", // Set label to medium weight
                color: "#003A7D",
              },
              "& .MuiInputBase-input": {
                fontWeight: "bold",
                fontSize: "1.5rem",
                color: '#003A7D' // Set input text to bold
              },
            }}
          />
        </Box>

        {/* ROW 2 */}
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            borderRadius: "10px",
          }}
        >
          <StatBox
            title={"#" + filters.Product.length}
            subtitle="Selected Products"
            progress="0.75"
            increase="+14%"
            icon={
              <NumbersIcon
                sx={{
                  color: colors.greenAccent[600],
                  fontSize: "26px",
                  marginTop: "4px",
                }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            borderRadius: "10px",
          }}
        >
          <StatBox
            title={inventoryTurnover.toFixed(2)}
            subtitle="Inventory Turnover"
            progress="0.50"
            increase="+21%"
            icon={
              <LoopIcon
                sx={{
                  color: colors.greenAccent[600],
                  fontSize: "26px",
                  marginTop: "4px",
                }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            borderRadius: "10px",
          }}
        >
          <StatBox
            title={totalCOGS.toFixed(2) + "₼"}
            subtitle="COGS"
            progress="0.30"
            increase="+5%"
            icon={
              <PersonAddIcon
                sx={{
                  color: colors.greenAccent[600],
                  fontSize: "26px",
                  marginTop: "4px",
                }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            borderRadius: "10px",
          }}
        >
          <StatBox
            title={averageInventory.toFixed(0)}
            subtitle="Average Inventory"
            progress="0.80"
            increase="+43%"
            icon={
              <TrafficIcon
                sx={{
                  color: colors.greenAccent[600],
                  fontSize: "26px",
                  marginTop: "4px",
                }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 4"
          backgroundColor="#fff4de"
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            borderRadius: "10px",
          }}
        >
          <StatBox
            title={safetyStock.toFixed(0)}
            subtitle="Safety Stock"
            progress="0.80"
            increase="+43%"
            icon={
              <TrafficIcon
                sx={{
                  color: colors.greenAccent[600],
                  fontSize: "26px",
                  marginTop: "4px",
                }}
              />
            }
          />
        </Box>
        {/* ROW 3 */}
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            borderRadius: "10px",
          }}
        >
          <StatBox
            title={grossMargin.toFixed(2) + "%"}
            subtitle="Gross Margin"
            progress="0.80"
            increase="+43%"
            icon={
              <TrafficIcon
                sx={{
                  color: colors.greenAccent[600],
                  fontSize: "26px",
                  marginTop: "4px",
                }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            borderRadius: "10px",
          }}
        >
          <StatBox
            title={netSales.toFixed(2) + "₼"}
            subtitle="Net Sales"
            progress="0.80"
            increase="+43%"
            icon={
              <TrafficIcon
                sx={{
                  color: colors.greenAccent[600],
                  fontSize: "26px",
                  marginTop: "4px",
                }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            borderRadius: "10px",
          }}
        >
          <StatBox
            title={returnOnInventory.toFixed(2) + "₼"}
            subtitle="Return on Inventory"
            progress="0.80"
            increase="+43%"
            icon={
              <TrafficIcon
                sx={{
                  color: colors.greenAccent[600],
                  fontSize: "26px",
                  marginTop: "4px",
                }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            borderRadius: "10px",
          }}
        >
          <StatBox
            title={preferredInventory.toFixed(0)}
            subtitle="Preferred Inventory"
            progress="0.80"
            increase="+43%"
            icon={
              <TrafficIcon
                sx={{
                  color: colors.greenAccent[600],
                  fontSize: "26px",
                  marginTop: "4px",
                }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 4"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            borderRadius: "10px",
          }}
        >
          <StatBox
            title={
              <span style={{ color: "#168118" }}>
                {yourSave.toFixed(2) + "₼"}
              </span>
            }
            subtitle="Your Save"
            progress="0.80"
            increase="+43%"
            icon={
              <TrafficIcon
                sx={{
                  color: colors.greenAccent[600],
                  fontSize: "26px",
                  marginTop: "4px",
                }}
              />
            }
          />
        </Box>
        {/* ABCPieTable Component */}
        <Box
          gridColumn="span 8"
          sx={{ boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)" }}
        >
          <ABCPieTable data={filteredTableData} />
        </Box>
        {/* Table Component */}
        <Box
          gridColumn="span 8"
          sx={{ boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)" }}
        >
          <TableComponent data={filteredTableData} />
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
