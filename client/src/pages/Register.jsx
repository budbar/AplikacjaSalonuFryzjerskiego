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
        <div className="max-w-md mx-auto mt-10 p-6 rounded-lg shadow-2xl bg-primary text-secondary">
            <div>
            <h2 className="text-2xl font-bold mb-4 text-center">Załóż swoje konto</h2>
            <form onSubmit={handleRegister}>
                <div className="mb-4">
                    <label className="block font-bold">Imię:</label>
                    <input 
                        type="text" 
                        className="w-full px-3 py-2 border-gray-700 bg-input rounded" 
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}  
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block font-bold">Nazwisko:</label>
                    <input 
                        type="text" 
                        className="w-full px-3 py-2 border border-gray-700 bg-input rounded" 
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}  
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block font-bold">Adres e-mail:</label>
                    <input 
                        type="email" 
                        className="w-full px-3 py-2 border border-gray-700 bg-input rounded" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}  
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block font-bold">Hasło:</label>
                    <input 
                        type="password" 
                        className="w-full px-3 py-2 border border-gray-700 bg-input rounded" 
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
                    <label className="ml-2 font-bold">Akceptuję regulamin</label>
                </div>
                <button type="submit" className="w-full bg-accent text-white py-2 rounded font-bold">Zarejestruj się</button>
            </form>
            </div>
        </div>
    );
}

export default Register;
