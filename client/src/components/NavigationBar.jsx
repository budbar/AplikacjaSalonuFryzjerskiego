import React from "react";
import { Link } from "react-router-dom";

const NavigationBar = () => {
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
                    <li><Link to="/account" className="text-white hover:text-gray-300">Konto</Link></li>
                </ul>
                </div>
            </nav>
        </>
    );
};

export default NavigationBar;