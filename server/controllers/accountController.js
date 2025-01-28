import { query } from "../database.js";

export const updateAddressData = async (req, res) => {
    const {email, residence, town, zipCode, country, phoneNumber} = req.body;

    try {
        const userUpdatedAddressData = await query(
            "UPDATE users SET residence = $1, town = $2, zip_code = $3, country = $4, phone_number = $5 WHERE email = $6", 
            [residence, town, zipCode, country, phoneNumber, email]
        );
    } catch (error) {
        console.error("Błąd przy aktualizacji danych adresowych: ", error);
        res.status(500).json({ message: "Błąd przy aktualizacji danych adresowych." });
    }
};

export const getAddressData = async (req, res) => {
    const {email} = req.query;

    try {
        const userAddressDataResults = await query(
            "SELECT first_name, last_name, residence, town, zip_code, country, phone_number FROM users WHERE email = $1", 
            [email]
        );

        userAddressDataResults.rows.length > 0 ? (
            res.status(200).json(userAddressDataResults.rows[0])
        ) : (
            res.status(404).json({message: "Nie znaleziono danych adresowych użytkownika."})
        )
    } catch (error) {
        console.error("Błąd przy pobieraniu danych adresowych: ", error);
        res.status(500).json({message: "Błąd przy pobieraniu danych adresowych."})
    }
};

export const getUserNames = async (req, res) => {
    const { id } = req.param;

    try {
        const result = await query("SELECT first_name, last_name FROM users WHERE id = $1", [ id ]);
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error("Błąd przy pobieraniu danych użytkownika: ", error);
        res.status(500).json({message: "Błąd przy pobieraniu danych użytkownika."})
    }
};