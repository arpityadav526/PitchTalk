import React from "react";
import "./ThemeToggle.css";

const ThemeToggle = ({ isDark, setIsDark }) => {
  return (
    <>
      <input
        id="checkbox"
        type="checkbox"
        checked={!isDark}
        onChange={() => setIsDark((prev) => !prev)}
      />
      <label className="switch" htmlFor="checkbox">
        <div className="football">
          <div className="panel p1"></div>
          <div className="panel p2"></div>
          <div className="panel p3"></div>
          <div className="panel p4"></div>
          <div className="panel p5"></div>
        </div>
      </label>
    </>
  );
};

export default ThemeToggle;