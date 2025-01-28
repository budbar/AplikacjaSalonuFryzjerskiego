import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { query } from "../database.js";

export const register = async (req, res) => {
    const { firstName, lastName, email, password, accountLevel, category} = req.body;

    try {
        //Sprawdzamy czy użytkownik o podanym emailu już istnieje
        const userResult = await query("SELECT * FROM users WHERE email = $1", [email]);

        if (userResult.rows.length > 0)
            return res.status(400).json({ message: "Użytkownik już istnieje." });
        
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await query(
            "INSERT INTO users(first_name, last_name, email, password, level, assigned_category) VALUES($1, $2, $3, $4, $5, $6) RETURNING *",
            [firstName, lastName, email, hashedPassword, accountLevel, category]
        );

        const token = jwt.sign({ id: newUser.rows[0].id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(201).json({ token });
    }
    catch (error) {
        console.error("Błąd servera:", error);
        res.status(500).json({ message: "Błąd serwera." });
    }
};

export const login = async (req, res) => {
    const {email, password} = req.body;

    try {
        const userResult = await query("SELECT * FROM users WHERE email = $1", [email]);

        if(userResult.rows.length ===0)
            return res.status(400).json({ message: "Nieprawidłowy email lub hasło." });

        const user = userResult.rows[0];

        //Sprawdzamy poprawność hasła
        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if(!isPasswordMatch)
            return res.status(400).json({ message: "Nieprawidłowy email lub hasło." });

        const token = jwt.sign({ 
                                    id: user.id,
                                    level: user.level
                                }, 
                            process.env.JWT_SECRET, { expiresIn: "1h" });

        //Przechowujemy dane w sesji
        req.session.user = {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            level: user.level,
            assigned_category: user.assigned_category,
            token: token,
        };

        res.status(200).json({ token });
    }
    catch (error) {
        console.log("Błąd serwera", error);
        res.status(500).json({ message: "Błąd serwera." });
    }
};
