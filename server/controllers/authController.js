import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { query } from "../database.js";

export const register = async (req, res) => {
    const { firstName, lastName, email, password} = req.body;

    try {
        //Sprawdzamy czy użytkownik o podanym emailu już istnieje
        const userResult = await query("SELECT * FROM users WHERE email = $1", [email]);

        if (userResult.rows.length > 0)
            return res.status(400).json({ message: "Użytkownik już istnieje." });
        
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await query(
            "INSERT INTO users(first_name, last_name, email, password) VALUES($1, $2, $3, $4) RETURNING *",
            [firstName, lastName, email, hashedPassword]
        );

        const token = jwt.sign({ id: newUser.rows[0].id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(201).json({ token });
    }
    catch (error) {
        console.error("Błąd servera:", error);
        res.status(500).json({ message: "Błąd serwera." });
    }
};
