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

function App() {
  return (
    <div className="bg-color min-h-screen flex flex-col">
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
            <Route path="/store" element={<Store />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/multimedia" element={<Multimedia/>} />
            <Route path="/slider-settings" element={<SliderSettings/>} />
            <Route path="/cart" element={<Cart/>} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </div>
  );
}

export default App
