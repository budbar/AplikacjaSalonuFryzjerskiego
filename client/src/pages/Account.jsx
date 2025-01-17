import React, { useState, useEffect}  from "react";
import axios from 'axios';

function Account() {
  const [user, setUser] = useState(null);
  const [residence, setResidence] = useState("");
  const [town, setTown] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [country, setCountry] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:8080/session', { withCredentials: true });
        setUser(response.data.user);
        fetchAddressData(response.data.user.email);
      } catch (error) {
        console.error('Błąd pobierania danych użytkownika:', error);
      }
    };

    const fetchAddressData = async (email) => {
      try {
        const response = await axios.get(`http://localhost:8080/account/get-address-data?email=${email}`);
        const { residence, town, zip_code, country, phone_number} = response.data;
        setResidence(residence || "");
        setTown(town || "");
        setZipCode(zip_code || "");
        setCountry(country || "");
        setPhoneNumber(phone_number || "");

      } catch(error) {
        console.error("Błąd pobierania danych adresowych: ", error);
      }
    };

    fetchUser();
  }, []);


  const handleUpdateOfAddressData = async (e) => {
    e.preventDefault();

    try {
      let email = user.email;
      const response = await axios.post("http://localhost:8080/account/update-address-data", {email, residence, town, zipCode, country, phoneNumber});
    } catch (error) {
      console.error("Błąd aktualizacji danych adresowych: ", error);
    }
  };

  if(!user)
    return (
      <div>
        Ładowanie...
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-primary rounded-lg shadow-md text-secondary">
      <h1 className="text-2xl font-bold mb-4">Konto użytkownika</h1>
      <div className="flex flex-col lg:flex-row">
        <div className="lg:w-1/2 lg:pr-4 mb-6 lg:mb-0">
          <h2 className="text-xl font-bold mb-4">Informacje o użytkowniku</h2>
          <div className="mb-4">
            <label className="block font-bold">Adres email:</label>
            <input
              type="email"
              name="email"
              className="w-full px-3 py-2 border border-gray-700 rounded bg-input"
              value={user.email || ""}
              readOnly
            />
          </div>
          <div className="mb-4">
            <label className="block font-bold">Imię:</label>
            <input
              type="text"
              name="firstName"
              className="w-full px-3 py-2 border border-gray-700 rounded bg-input"
              value={user.first_name || ""}
              readOnly
            />
          </div>
          <div className="mb-4">
            <label className="block font-bold">Nazwisko:</label>
            <input
              type="text"
              name="lastName"
              className="w-full px-3 py-2 border border-gray-700 rounded bg-input"
              value={user.last_name || ""}
              readOnly
            />
          </div>
        </div>
        <div className="lg:w-1/2 lg:pl-4">
          <h2 className="text-xl font-bold mb-4">Uzupełnij informacje adresowe</h2>
          <form onSubmit={handleUpdateOfAddressData}>
            <div className="mb-4">
              <label className="block font-bold">Adres zamieszkania:</label>
              <input
                type="text"
                name="residence"
                className="w-full px-3 py-2 border-gray-700 bg-input rounded"
                value={residence}
                onChange={(e) => setResidence(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block font-bold">Miejscowosć:</label>
              <input
                type="text"
                name="town"
                className="w-full px-3 py-2 border-gray-700 bg-input rounded"
                value={town}
                onChange={(e) => setTown(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block font-bold">Kod pocztowy:</label>
              <input
                type="text"
                name="zipCode"
                className="w-full px-3 py-2 border-gray-700 bg-input rounded"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block font-bold">Kraj zamieszkania:</label>
              <input
                type="text"
                name="country"
                className="w-full px-3 py-2 border-gray-700 bg-input rounded"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block font-bold">Numer telefonu:</label>
              <input
                type="text"
                name="phoneNumber"
                className="w-full px-3 py-2 border-gray-700 bg-input rounded"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="w-full bg-accent hover-bg-accent text-white py-2 rounded font-bold">Zaktualizuj dane adresowe</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Account;
