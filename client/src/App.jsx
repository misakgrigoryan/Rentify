import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout.jsx";
import Home from "./pages/Home.jsx";
import Products from "./pages/Products.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import OwnerProfile from "./pages/OwnerProfile.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import AddListing from "./pages/AddListing.jsx";
import ReviewPage from "./pages/ReviewPage.jsx";
import Profile from "./pages/Profile.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Favorites from "./pages/Favorites.jsx";
import Admin from "./pages/Admin.jsx";
import Messages from "./pages/Messages.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/owners/:id" element={<OwnerProfile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/listings/new" element={<AddListing />} />
        <Route path="/listings/:id/edit" element={<AddListing />} />
        <Route path="/review/:bookingId" element={<ReviewPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
