import React from "react";

const Footer = () => {
    return (
        <>
            <footer className="bg-primary p-4 mt-4">
                <div className="container mx-auto text-center text-secondary">
                    <p className="mb-2">&copy; 2025 Aplikacja Salonu Fryzjerskiego. Wszystkie prawa zastrzeżone.</p>
                    <ul className="flex justify-center space-x-4">
                        <li><a href="/documents/PolitykaPrywatnosci.pdf" download className="hover:text-gray-300">Polityka Prywatności</a></li>
                        <li><a href="/documents/WarunkiSwiadczeniaUslugi.pdf" download className="hover:text-gray-300">Warunki świadczenia usługi</a></li>
                        <li><a href="#" className="hover:text-gray-300">Kontakt</a></li>
                    </ul>
                </div>
            </footer>
        </>
    );
};

export default Footer;