import React, { useEffect, useState } from "react";
import { Typography, Box } from "@mui/material";
import TableView from "../components/TableView";
import Header from "../components/Header";
import axios from "axios";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 10); // Format as 'YYYY-MM-DD'
  };

  const formatTransactionId = (id) => {
    return Number(id).toString(); // Remove decimal points
  };

  const fetchTransactions = async (page = 0, rowsPerPage = 10) => {
    const response = await axios.get("http://localhost:5000/api/transactions", {
      params: { page: page + 1, limit: rowsPerPage },
    });

    const formattedTransactions = response.data.transactions.map(transaction => ({
      ...transaction,
      Date: formatDate(transaction.Date), // Format the Date field
      transaction_id: formatTransactionId(transaction.transaction_id) // Format the transaction_id field
    }));

    setTransactions(formattedTransactions);
    setTotalRows(response.data.totalPages * rowsPerPage);
  };

  useEffect(() => {
    fetchTransactions(page, rowsPerPage);
  }, [page, rowsPerPage]);

  const columns = [
    "transaction_id",
    "ProductName",
    "QuantitySold",
    "CostPrice",
    "COGS",
    "SalesPrice",
    "Sales",
    "Date",
  ];

  return (
    <Box>
      <Box m="17px">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Header title="TRANSACTIONS" subtitle="Welcome to Transaction" />
        </Box>
      </Box>
      <Box
        style={{ width: "calc(1237px)", padding: 0, marginLeft: "11px" }}
      >
        <TableView
          data={transactions}
          columns={columns}
          page={page}
          setPage={setPage}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          totalRows={totalRows}
        />
      </Box>
    </Box>
  );
};

export default Transactions;
