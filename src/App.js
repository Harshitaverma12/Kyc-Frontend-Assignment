import React from "react";
import "./index.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductTable from "./Components/Main Pages/ProductTable";
import ProductComparison from "./Components/Main Pages/ProductComparison";
import Sidebar from "./Components/Common Pages/Sidebar";

function App() {
  return (
    <>
      <Router>
        <Sidebar />
        <Routes>
          <Route exact path="/dashboard" element={<ProductTable />} />
          <Route
            exact
            path="/product-comparison"
            element={<ProductComparison />}
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
