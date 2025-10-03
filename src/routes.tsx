// src/Routes.jsx
import { Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/home/Home";
import Information from "./pages/Information/Information";

// const Home = lazy(() => import("./pages/Home.tsx"));
// const Forms = lazy(() => import("./pages/Forms"));
// const Aboute = lazy(() => import("./pages/Aboute"));

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
          {/* <Route path="/aboute" element={<Aboute />} /> */}

          {/* <Route path="/index.html" element={<Navigate to="/" replace />} /> */}

          <Route path="*" element={<div>404 — Page not found</div>} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
