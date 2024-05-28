import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import { AuthenticationContext } from "./AuthContext";

const BASE_URL = "https://wanderwave-backend-aa9d.onrender.com";

const CitiesContext = createContext();

function CitiesProvider({ children }) {
  const [cities, setCities] = useState([]);
  // const token = localStorage.getItem("token");
  const authContext = useContext(AuthenticationContext);
  const token = authContext.token;
  const [isLoading, setIsLoading] = useState(false);
  const [currentCity, setCurrentCity] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function fetchCities() {
      setIsLoading(true);
      if (!token) {
        return;
      }
      try {
        const res = await fetch(`${BASE_URL}/api/v1/cities`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include token in headers
          },
        });
        const cit = await res.json();
        setSuccess("Cities Loaded Successfully !");
        setCities(cit.data.cities);
        setIsLoading(false);
      } catch {
        setIsLoading(false);
        setError("There was an error loading cities...");
      }
    }
    fetchCities();
  }, [token]);

  const getCity = useCallback(
    async (id) => {
      if (Number(id) === currentCity.id) return;

      setIsLoading(true);

      try {
        const res = await fetch(`${BASE_URL}/api/v1/cities/${id}`);

        const data = await res.json();

        setCurrentCity(data.data.city);
        setIsLoading(false);
      } catch {
        setIsLoading(false);
        setError("There was an error loading the city...");
      }
    },
    [currentCity.id]
  );

  async function createCity(newCity) {
    setIsLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/api/v1/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setSuccess("City created successfully !");
      setCities([...cities, data.data.city]);

      setCurrentCity(data.data.city);
      setIsLoading(false);
    } catch {
      setIsLoading(false);
      setError("There was an error creating the city...");
    }
  }

  async function deleteCity(id) {
    setIsLoading(true);

    try {
      await fetch(`${BASE_URL}/api/v1/cities/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const res = await fetch(`${BASE_URL}/api/v1/cities`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include token in headers
        },
      });
      const cit = await res.json();

      setCities(cit.data.cities);
      setSuccess("City deleted successfully!");
      setCurrentCity({});
      setIsLoading(false);
    } catch {
      setIsLoading(false);
      setError("There was an error deleting the city...");
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        error,
        getCity,
        createCity,
        deleteCity,
        success,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("CitiesContext was used outside the CitiesProvider");
  return context;
}

export { CitiesProvider, useCities };
