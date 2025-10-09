// src/Routes.jsx
import { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/home/Home";
import Information from "./pages/Information/Information";
import Manager from "./pages/Information/Manager";
import Address from "./pages/Information/Address";
import Location from "./pages/Information/Location";

function Loading() {
  return <div>Loading...</div>;
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/information" element={<Information />} />
          <Route path="/information/manager" element={<Manager />} />
          <Route path="/information/address" element={<Address />} />
          <Route path="/information/location" element={<Location />} />
          {/* <Route path="/aboute" element={<Aboute />} /> */}

          {/* <Route path="/index.html" element={<Navigate to="/" replace />} /> */}

          <Route path="*" element={<div>404 — Page not found</div>} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
