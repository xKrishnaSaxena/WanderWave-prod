// UserContext.js
import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthenticationContext } from "./AuthContext";

const UserContext = createContext();
const BASE_URL = "https://wanderwave-backend-aa9d.onrender.com";
export const useUser = () => React.useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const authContext = useContext(AuthenticationContext);
  const userId = authContext.userId;
  const token = authContext.token;
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      if (!userId) return;
      try {
        const response = await axios.get(`${BASE_URL}/api/v1/users/${userId}`);

        setUser(response.data.data.user); // Assuming the response.data contains user information
        setSuccess("User Loaded Successfully!");
        setLoading(false);
      } catch (error) {
        setError("Error fetching user!");
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const updateUser = async (name, email) => {
    setLoading(true);
    const response = await fetch(`${BASE_URL}/api/v1/users/updateMe`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, email }),
    });
    if (response.ok) {
      const data = await response.json();
      setSuccess("User information updated successfully!");
      setUser(data.data.user);
    } else {
      setError("Incorrect email!");
    }
    setLoading(false);
  };
  const updatePassword = async (password, newPassword, newPasswordConfirm) => {
    setLoading(true);
    const response = await fetch(`${BASE_URL}/api/v1/users/updateMyPassword`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        passwordCurrent: password,
        password: newPassword,
        passwordConfirm: newPasswordConfirm,
      }),
    });
    if (response.ok) {
      setSuccess("User password updated successfully!");
    } else {
      setError("Incorrect Password!");
    }
    setLoading(false);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        loading,
        updateUser,
        updatePassword,
        error,
        success,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
