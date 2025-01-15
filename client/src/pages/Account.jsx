import React, { useState } from "react";

function Account() {
  const [isLogin, setIsLogin] = useState(true);

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
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
          <form>
            <div className="mb-4">
              <label className="block text-gray-700">Adres e-mail:</label>
              <input type="email" className="w-full px-3 py-2 border border-gray-700 rounded" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Hasło:</label>
              <input type="password" className="w-full px-3 py-2 border border-gray-700 rounded" />
            </div>
            <button type="submit" className="w-full bg-gray-800 text-white py-2 rounded">Zaloguj się</button>
          </form>
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-bold mb-4">Rejestracja</h2>
          <form>
            <div className="mb-4">
              <label className="block text-gray-700">Imię:</label>
              <input type="text" className="w-full px-3 py-2 border border-gray-700 rounded" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Nazwisko:</label>
              <input type="text" className="w-full px-3 py-2 border border-gray-700 rounded" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Adres e-mail:</label>
              <input type="email" className="w-full px-3 py-2 border border-gray-700 rounded" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Hasło:</label>
              <input type="password" className="w-full px-3 py-2 border border-gray-700 rounded" />
            </div>
            <button type="submit" className="w-full bg-gray-800 text-white py-2 rounded">Zarejestruj się</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Account;
