import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const NavigationBar = () => {
    const [user, setUser] = useState(null);

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
        history.push('/');
        } catch (error) {
        console.error('Błąd wylogowania:', error);
        }
  };

    return (
        <>
            <nav className="bg-gray-800 p-4">
                <div className="container mx-auto flex justify-between items-center">
                <div className="text-white text-lg font-bold">Logo</div>
                <ul className="flex space-x-16">
                    <li><Link to="/" className="text-white hover:text-gray-300">Strona główna</Link></li>
                    <li><Link to="/about" className="text-white hover:text-gray-300">O nas</Link></li>
                    <li><Link to="/services" className="text-white hover:text-gray-300">Usługi</Link></li>
                    <li><Link to="/contact" className="text-white hover:text-gray-300">Kontakt</Link></li>
                    <li>
                    {user ? (
                        <>
                            <span className="text-white hover:text-gray-300 cursor-pointer" onClick={handleLogout}>
                            {user.first_name} {user.last_name}
                            </span>
                        </>
                    ) : (
                        <Link to="/login" className="text-white hover:text-gray-300">
                            Zaloguj się
                        </Link>
                    )}
                    </li>
                </ul>
                </div>
            </nav>
        </>
    );
};

export default NavigationBar;