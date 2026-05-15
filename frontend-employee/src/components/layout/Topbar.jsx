import React from "react";

const Topbar = ({ title = "Employee Portal" }) => {
  return (
    <header className="topbar">
      <h1>{title}</h1>
    </header>
  );
};

export default Topbar;
