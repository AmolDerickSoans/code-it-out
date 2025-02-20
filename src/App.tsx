import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import SalesDashboard from "./SalesDashboard";
import Navbar from "./component/navbar";
import Download from "./pages/download";
import Summary from "./pages/summary";

function App() {
  return (
    <BrowserRouter>
    <Navbar />
      <Routes>
        <Route path="/" element={<SalesDashboard />} />
        <Route path="/download" element={<Download />} />
        <Route path="/summary" element={<Summary />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
