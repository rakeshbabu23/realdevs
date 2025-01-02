import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Layout from "./pages/Layout";
import Side from "./pages/Side";
import Dashboard from "./pages/Dashboard";
import Signup from "./pages/home/Signup";
import Login from "./pages/home/Login";
import Login2 from "./pages/home/Login2";
import Profile from "./pages/profile/Profile";
import Home from "./pages/group/Home";
import Share from "./pages/share/Share";
import LandingPage from "./pages/landing/LandingPage";
function App() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        // transition: Bounce
      />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login2 />} />
          <Route path="/dashboard" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="projects" element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="group" element={<Home />} />
            <Route path="share" element={<Share />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
