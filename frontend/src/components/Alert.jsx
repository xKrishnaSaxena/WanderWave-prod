import React, { useEffect } from "react";

const Alert = ({ message, type }) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      // Remove the alert after 2 seconds
      document
        .getElementById("alert-container")
        .removeChild(document.getElementById("alert"));
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div id="alert-container">
      <div id="alert" className={`alert alert-${type} mt-3`} role="alert">
        <span className="fs-5">{message}</span>
      </div>
    </div>
  );
};

export default Alert;
