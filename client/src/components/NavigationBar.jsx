import React, { useState, useEffect, useContext } from 'react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Link } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';

const NavigationBar = () => {
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const {clearCart} = useContext(CartContext);

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
      await clearCart();
      await axios.post('http://localhost:8080/auth/logout', {}, { withCredentials: true });
      setUser(null);
      window.location.replace("/home");
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
        <div className="text-lg font-bold">Salon Fryzjerski</div>
        <div className="block lg:hidden">
          <button onClick={toggleMenu} className="focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
        </div>
        <ul className={`lg:flex space-x-16 ${isOpen ? 'block' : 'hidden'} lg:block`}>
          <li><Link to="/home" className="text-secondary-on-hover">Strona główna</Link></li>
          <li><Link to="/forum" className="text-secondary-on-hover">Forum</Link></li>
          <li><Link to="/store" className="text-secondary-on-hover">Sklep</Link></li>
          {/* <li><Link to="/about" className="text-secondary-on-hover">O nas</Link></li> */}
          {/* <li><Link to="/services" className="text-secondary-on-hover">Usługi</Link></li> */}
          {/* <li><Link to="/contact" className="text-secondary-on-hover">Kontakt</Link></li> */}
          <li className="relative group">
            {user ? (
              <>
                <Menu as="div" className="relative inline-block text-left">
                  <div className="text-secondary-on-hover">
                    <MenuButton>
                      {user.first_name} {user.last_name}
                    </MenuButton>
                  </div>

                  <MenuItems
                    transition
                    className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-primary shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                  >
                    <div className="py-1">
                      <MenuItem>
                        <Link
                          to="/cart"
                          className="block px-4 py-2 text-sm text-secondary text-secondary-on-hover"
                        >
                          Koszyk
                        </Link>
                      </MenuItem>
                      <MenuItem>
                        <Link
                          to="/account"
                          className="block px-4 py-2 text-sm text-secondary text-secondary-on-hover"
                        >
                          Konto
                        </Link>
                      </MenuItem>
                      <MenuItem>
                        <Link
                          to="/orders"
                          className="block px-4 py-2 text-sm text-secondary text-secondary-on-hover"
                        >
                          Zamówienia
                        </Link>
                      </MenuItem>

                      {
                        user.level == 1 || user.level == 2 ? (
                          <MenuItem>
                            <Link
                              to="/post-management"
                              className="block px-4 py-2 text-sm text-secondary text-secondary-on-hover"
                            >
                              Zarządzanie postami
                            </Link>
                          </MenuItem>
                        ) : (
                          <></>
                        )
                      }

                      { user.level == 1 ? (
                        <>
                          <MenuItem>
                            <Link
                              to="/product-management"
                              className="block px-4 py-2 text-sm text-secondary text-secondary-on-hover"
                            >
                              Zarządzanie produktami
                            </Link>
                          </MenuItem>
                          <MenuItem>
                            <Link
                              to="/multimedia"
                              className="block px-4 py-2 text-sm text-secondary text-secondary-on-hover"
                            >
                              Multimedia
                            </Link>
                          </MenuItem>
                          <MenuItem>
                            <Link
                              to="/slider-settings"
                              className="block px-4 py-2 text-sm text-secondary text-secondary-on-hover"
                            >
                              Ustawienia slidera
                            </Link>
                          </MenuItem>
                          <MenuItem>
                            <Link
                              to="/moderator-panel"
                              className="block px-4 py-2 text-sm text-secondary text-secondary-on-hover"
                            >
                              Dodaj moderatora
                            </Link>
                          </MenuItem>
                        </>
                      ) : (
                        <></>
                      )}

                      <MenuItem>
                        <button
                          type="submit"
                          className="block w-full px-4 py-2 text-left text-sm text-secondary text-secondary-on-hover"
                          onClick={handleLogout}
                        >
                          Wyloguj się
                        </button>
                      </MenuItem>
                    </div>
                  </MenuItems>
                </Menu>
              </>
            ) : (
              <Link to="/login" className="text-secondary-on-hover">
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