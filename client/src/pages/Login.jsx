import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

axios.defaults.withCredentials = true;

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8080/auth/login", {email, password});    
      localStorage.setItem("token", response.data.token);
      window.location.replace("/home");
      
    }
    catch(error) {
      console.log("Błąd logowanie: ", error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-primary text-secondary rounded-lg shadow-2xl">
        <div>
          <h2 className="text-2xl font-bold mb-4 text-center">Zaloguj się do swojego konta</h2>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block font-bold">Adres e-mail:</label>
              <input 
                type="email" 
                className="w-full px-3 py-2 border rounded bg-input" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}  
                required
              />
            </div>
            <div className="mb-4">
              <label className="block font-bold">Hasło:</label>
              <input 
                type="password" 
                className="w-full px-3 py-2 border border-gray-700 rounded bg-input" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}  
                required
              />
            </div>
            <button type="submit" className="w-full bg-button text-white py-2 rounded font-bold">Zaloguj się</button>
            <div className="block mt-2 font-bold">
                Nie posiadasz jeszcze konta? <Link to="/register" className="text-green-800">Zarejestruj się!</Link>
            </div>
          </form>
        </div>
    </div>
  );
}

export default Login;
