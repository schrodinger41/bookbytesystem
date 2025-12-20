import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import AdminPage from "./pages/adminPage/AdminPage";
import AllProductsPage from "./pages/allProductsPage/AllProductsPage";
import CartPage from "./pages/cartPage/CartPage";
import ContactUsPage from "./pages/contactUsPage/ContactUsPage";
import HomePage from "./pages/homePage/HomePage";
import ProductsPage from "./pages/productsPage/ProductsPage";
import FaqPage from "./pages/faqPage/FaqPage";
import ThankYouPage from "./pages/thankYouPage/ThankYouPage";

import "./App.css";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/ProductCatalogue" element={<AllProductsPage />} />
          <Route path="/Cart" element={<CartPage />} />
          <Route path="/ContactUs" element={<ContactUsPage />} />
          <Route path="/Product/:id" element={<ProductsPage />} />
          <Route path="/Faq" element={<FaqPage />} />
          <Route path="/ThankYou" element={<ThankYouPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
