import React, { useState } from "react";
import axios from "axios";
import { AccountLevels } from "../../../server/enums/AccountLevelEnum.js";

function ModeratorPanel() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState(""); 
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [category, setCategory] = useState("1");
    const accountLevel = AccountLevels.Moderator;

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:8080/auth/register", {firstName, lastName, email, password, accountLevel, category});
            window.location.replace("/home");
        } catch (error) {
            console.error("Błąd rejestracji moderatora: ", error);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 rounded-lg shadow-2xl bg-primary text-secondary">
            <div>
            <h2 className="text-2xl font-bold mb-4 text-center">Zarejestruj moderatora</h2>
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
                <label className="block font-bold">Przydziel kategorię tematyczną:</label>
                <select
                    className="w-full px-3 py-2 bg-input rounded-lg"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >
                    <option value="1">Usługi</option>
                    <option value="2">Promocje</option>
                    <option value="3">Porady i wskazówki</option>
                    <option value="4">Zadowoleni klienci</option>
                    <option value="5">Wydarzenia w salonie</option>
                    <option value="6">Zespół fryzjerów</option>
                    <option value="7">Nowości w salonie</option>
                </select>
                </div>
                <button type="submit" className="w-full bg-button text-white py-2 rounded font-bold">Zarejestruj</button>
            </form>
            </div>
        </div>
    );
}

export default ModeratorPanel;
