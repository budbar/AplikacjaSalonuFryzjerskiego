import React, { useState } from "react";
import axios from "axios";

axios.defaults.withCredentials = true;

function Account() {
  const [isLogin, setIsLogin] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8080/auth/register", {firstName, lastName, email, password});
      console.log("Pomyślnie zarejestrowano użytkownika: ", response.data);
    } catch (error) {
      console.error("Błąd rejestracji: ", error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8080/auth/login", {email, password});    
      localStorage.setItem("token", response.data.token);
      window.location.reload();
    }
    catch(error) {
      console.log("Błąd logowanie: ", error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-around mb-6">
        <button
          className={`px-4 py-2 w-1/2 ${isLogin ? 'bg-gray-800 text-white' : 'bg-gray-200'}`}
          onClick={() => setIsLogin(true)}
        >
          Logowanie
        </button>
        <button
          className={`px-4 py-2 w-1/2 ${!isLogin ? 'bg-gray-800 text-white' : 'bg-gray-200'}`}
          onClick={() => setIsLogin(false)}
        >
          Rejestracja
        </button>
      </div>
      {isLogin ? (
        <div>
          <h2 className="text-2xl font-bold mb-4">Logowanie</h2>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-gray-700">Adres e-mail:</label>
              <input 
                type="email" 
                className="w-full px-3 py-2 border border-gray-700 rounded"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Hasło:</label>
              <input 
                type="password" 
                className="w-full px-3 py-2 border border-gray-700 rounded"
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
              />
            </div>
            <button type="submit" className="w-full bg-gray-800 text-white py-2 rounded">Zaloguj się</button>
          </form>
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-bold mb-4">Rejestracja</h2>
          <form onSubmit={handleRegister}>
            <div className="mb-4">
              <label className="block text-gray-700">Imię:</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 border border-gray-700 rounded"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)} />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Nazwisko:</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 border border-gray-700 rounded"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Adres e-mail:</label>
              <input 
                type="email" 
                className="w-full px-3 py-2 border border-gray-700 rounded" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}  
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Hasło:</label>
              <input 
                type="password" 
                className="w-full px-3 py-2 border border-gray-700 rounded" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}  
              />
            </div>
            <button type="submit" className="w-full bg-gray-800 text-white py-2 rounded">Zarejestruj się</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Account;
