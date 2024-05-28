import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthenticationContext = createContext();

const AuthenticationProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userID, setUserID] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const URL = "https://wanderwave-backend-aa9d.onrender.com";
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    // Check if user is already logged in (e.g., token stored in localStorage)

    if (token) {
      // If token exists, set user
      setUser({ token });
      setUserID({ userId });
    }
  }, [token, userId]);

  const login = async (email, password) => {
    // Make API call to login endpoint
    setLoading(true);
    const response = await fetch(`${URL}/api/v1/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      // If login successful, extract token from response
      const data = await response.json(); // Wait for the promise to resolve
      setSuccess("User Logged In Successfully!");
      const token = data.token; // Access the token from the resolved JSON data
      const userId = data.data.user._id;

      // Store token in localStorage
      localStorage.setItem("userId", userId);
      localStorage.setItem("token", token);
      // Set user state
      setUser({ token });
      setUserID({ userId });
      navigate("/app", { replace: true });
      setLoading(false);
    } else {
      setError("Incorrect Email or Password!");
      setLoading(false);
    }
  };

  const logout = () => {
    // Remove token from localStorage
    setLoading(true);
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setSuccess("User Logged Out Successfully!");
    // Clear user state
    setUser(null);
    setUserID(null);
    setLoading(false);
  };

  return (
    <AuthenticationContext.Provider
      value={{
        user,
        login,
        logout,
        token,
        userId,
        userID,
        error,
        success,
        loading,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
};

export { AuthenticationProvider, AuthenticationContext };
