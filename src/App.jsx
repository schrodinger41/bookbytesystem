import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

import AdminPage from "./pages/adminPage/AdminPage";
import AllProductsPage from "./pages/allProductsPage/AllProductsPage";
import CartPage from "./pages/cartPage/CartPage";

import HomePage from "./pages/homePage/HomePage";
import ProductsPage from "./pages/productsPage/ProductsPage";
import FaqPage from "./pages/faqPage/FaqPage";
import ThankYouPage from "./pages/thankYouPage/ThankYouPage";
import MyRentalsPage from "./pages/myRentalsPage/MyRentalsPage";
import AuthPage from "./pages/authPage/AuthPage";

import "./App.css";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/Login" replace />;
  }
  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/Login" element={<AuthPage />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ProductCatalogue"
            element={
              <ProtectedRoute>
                <AllProductsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Cart"
            element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Product/:id"
            element={
              <ProtectedRoute>
                <ProductsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Faq"
            element={
              <ProtectedRoute>
                <FaqPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ThankYou"
            element={
              <ProtectedRoute>
                <ThankYouPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/MyRentals"
            element={
              <ProtectedRoute>
                <MyRentalsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
