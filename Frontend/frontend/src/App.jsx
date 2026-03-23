import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Admin from "./pages/Admin";
import AddProduct from "./pages/AddProduct";
import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/add-product" element={<AddProduct />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;