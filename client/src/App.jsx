import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
import Footer from "./components/Footer";

import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Account from './pages/Account';
import Store from './pages/Store';
import Orders from './pages/Orders';
import Multimedia from './pages/Multimedia';
import SliderSettings from "./pages/SliderSettings";
import Cart from './pages/Cart';
import ProductManagement from './pages/ProductManagement';
import { CartProvider } from './context/CartContext';
import Checkout from "./pages/Checkout";
import Forum from "./pages/Forum";
import PostManagement from './pages/PostManagement';
import ModeratorPanel from './pages/ModeratorPanel';
import Notifications from './pages/Notifications';

function App() {
  return (
    <div className="bg-color min-h-screen flex flex-col">
      <CartProvider>
        <Router>
          <NavigationBar />
          <div className="flex-grow">
            <Routes>
              <Route path="/home" element={<Home />}/>
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/account" element={<Account />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/multimedia" element={<Multimedia/>} />
              <Route path="/slider-settings" element={<SliderSettings/>} />
              <Route path="/product-management" element={<ProductManagement/>} />
              <Route path="/checkout" element={<Checkout/>} />
              <Route path="/store" element={<Store />} />
              <Route path="/cart" element={<Cart/>} />
              <Route path="/forum" element={<Forum/>} />
              <Route path="/post-management" element={<PostManagement/>} />
              <Route path="/moderator-panel" element={<ModeratorPanel/>} />
              <Route path="/notifications" element={<Notifications/>} />
            </Routes>
          </div>
          <Footer />
        </Router>
      </CartProvider>
    </div>
  );
}

export default App
