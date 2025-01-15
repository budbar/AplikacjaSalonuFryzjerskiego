import React, { useState } from "react";
import axios from "axios";

function Register() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState(""); 
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:8080/auth/register", {firstName, lastName, email, password});
            window.location.replace("/login");
        } catch (error) {
            console.error("Błąd rejestracji: ", error);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-2xl">
            <div>
            <h2 className="text-2xl font-bold mb-4">Załóż swoje konto</h2>
            <form onSubmit={handleRegister}>
                <div className="mb-4">
                    <label className="block text-gray-700">Imię:</label>
                    <input 
                        type="text" 
                        className="w-full px-3 py-2 border border-gray-700 rounded" 
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}  
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Nazwisko:</label>
                    <input 
                        type="text" 
                        className="w-full px-3 py-2 border border-gray-700 rounded" 
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}  
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Adres e-mail:</label>
                    <input 
                        type="email" 
                        className="w-full px-3 py-2 border border-gray-700 rounded" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}  
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Hasło:</label>
                    <input 
                        type="password" 
                        className="w-full px-3 py-2 border border-gray-700 rounded" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}  
                        required
                    />
                </div>
                <div className="mb-4">
                    <input 
                        type="checkbox"
                        required
                    />
                    <label className="text-gray-700 ml-2">Akceptuję regulamin</label>
                </div>
                <button type="submit" className="w-full bg-gray-800 text-white py-2 rounded">Zarejestruj się</button>
            </form>
            </div>
        </div>
    );
}

export default Register;
