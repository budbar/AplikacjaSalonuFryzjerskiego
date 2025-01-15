import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const NavigationBar = () => {
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:8080/session', { withCredentials: true });
        setUser(response.data.user);
      } catch (error) {
        console.error('Błąd pobierania danych użytkownika:', error);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:8080/auth/logout', {}, { withCredentials: true });
      setUser(null);
      navigate('/');
    } catch (error) {
      console.error('Błąd wylogowania:', error);
    }
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-primary p-4 text-secondary font-bold">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-lg font-bold">Logo</div>
        <div className="block lg:hidden">
          <button onClick={toggleMenu} className="focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
        </div>
        <ul className={`lg:flex space-x-16 ${isOpen ? 'block' : 'hidden'} lg:block`}>
          <li><Link to="/" className="hover:text-gray-300">Strona główna</Link></li>
          <li><Link to="/about" className="hover:text-gray-300">O nas</Link></li>
          <li><Link to="/services" className="hover:text-gray-300">Usługi</Link></li>
          <li><Link to="/contact" className="hover:text-gray-300">Kontakt</Link></li>
          <li className="relative group">
            {user ? (
              <>
                <span className="hover:text-gray-300 cursor-pointer">
                  {user.first_name} {user.last_name}
                </span>
                <ul className="absolute hidden group-hover:block bg-primary  mt-2 rounded shadow-lg">
                  <li className="px-4 py-2 cursor-pointer">
                    <Link to="/account">Konto</Link>
                  </li>
                  <li className="px-4 py-2 cursor-pointer">
                    <Link to="/themes">Motywy</Link>
                  </li>
                  <li className="px-4 py-2 cursor-pointer" onClick={handleLogout}>Wyloguj się</li>
                </ul>
              </>
            ) : (
              <Link to="/login" className="hover:text-gray-300">
                Zaloguj się
              </Link>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavigationBar;