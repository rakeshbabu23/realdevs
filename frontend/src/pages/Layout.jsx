import React from "react";
import { Outlet } from "react-router-dom";
import Side from "./Side";

function Layout() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        backgroundColor: "black",
      }}
    >
      <Side />

      <div className="w-[90%] min-h-screen bg-gray-50">
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
