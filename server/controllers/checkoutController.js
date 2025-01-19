import { query } from "../database.js";

export const addOrder = async (req, res) => {
    const {address_details, payment_method, postage, final_price, user_id} = req.body;

    try {
        //Sprawdzamy czy użytkownik o podanym emailu już istnieje
        const user = await query("SELECT * FROM users WHERE id = $1", [user_id]);

        if (user.rows.length == 0)
            return res.status(400).json({ message: "Nie znaleziono użytkownika." });
        
        const result = await query(
            "INSERT INTO orders (address_details, payment_method, delivery_method, price, user_id) VALUES($1, $2, $3, $4, $5) RETURNING *",
            [address_details, payment_method, postage, final_price, user_id]
        );

        res.status(201).json({
            message: 'Zamówienie zostało utworzone pomyślnie.',
            result,
        });
    }
    catch (error) {
        console.error("Błąd przy tworzeniu zamówienia:", error);
        res.status(500).json({ message: "Błąd przy tworzeniu zamówienia." });
    }
};