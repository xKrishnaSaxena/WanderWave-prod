import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Product from "./pages/Product";
import UserPage from "./pages/UserPage";
import Homepage from "./pages/Homepage";
import UpdatePassword from "./pages/UpdatePassword";
import Signup from "./pages/Signup";
import PageNotFound from "./pages/PageNotFound";
import AppLayout from "./pages/AppLayout";
import Login from "./pages/Login";
import CityList from "./components/CityList";
import CountryList from "./components/CountryList";
import City from "./components/City";
import Form from "./components/Form";
import { CitiesProvider } from "./contexts/CitiesContext";
import { AuthenticationProvider } from "./contexts/AuthContext";
import { UserProvider } from "./contexts/UserContext";
import { SidebarProvider } from "./contexts/SidebarContext";

function App() {
  return (
    <BrowserRouter>
      <AuthenticationProvider>
        <UserProvider>
          <SidebarProvider>
            <CitiesProvider>
              <Routes>
                <Route index element={<Homepage />} />
                <Route path="product" element={<Product />} />
                <Route path="signup" element={<Signup />} />
                <Route path="user" element={<UserPage />} />
                <Route path="userPassword" element={<UpdatePassword />} />
                <Route path="login" element={<Login />} />
                <Route path="app" element={<AppLayout />}>
                  <Route index element={<Navigate replace to="cities" />} />
                  <Route path="cities" element={<CityList />} />
                  <Route path="cities/:id" element={<City />} />
                  <Route path="countries" element={<CountryList />} />
                  <Route path="form" element={<Form />} />
                </Route>

                <Route path="*" element={<PageNotFound />} />
              </Routes>
            </CitiesProvider>
          </SidebarProvider>
        </UserProvider>
      </AuthenticationProvider>
    </BrowserRouter>
  );
}

export default App;
