
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";

import "./index.css";
import App from "./App.jsx";
import ReportDetail from "./ReportDetailPage.jsx";
import SubmitReport from "./SubmitReport.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />

        <Route
          path="/laporan/:id"
          element={<ReportDetail />}
        />

        <Route
          path="/lapor"
          element={<SubmitReport />}
        />

        <Route
          path="*"
          element={<h1>Halaman tidak ditemukan</h1>}
        />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
