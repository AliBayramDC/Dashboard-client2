import React from "react";
import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import {Routes, Route} from "react-router-dom"
import Sidebar from "./scenes/global/Sidebar"
import Dashboard from "./scenes/dashboard"
import Transactions from "./pages/Transactions"
import Details from "./pages/Details"
import SalesForecast from "./pages/SalesForecast"
import ABC from "./pages/ABC"



function App() {
  const [theme, colorMode] = useMode();
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline/>
        <div className="app">
          <Sidebar/>
          <main className="content">
            <Routes>
              <Route path="/" element={<Dashboard/>} />
              <Route path="/Transactions" element={<Transactions/>} />
              <Route path="/ABC" element={<ABC/>} />
              <Route path="/details" element={<Details/>} />
              <Route path="/SalesForecast" element={<SalesForecast/>} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
