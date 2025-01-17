import { query } from "../database.js";
import fs from "fs";

export const addImage = async (req, res) => {
    console.log("aaaaaaaaaaaaaaaadbbbbbbbbbbbbbb");
    const {name, alternativeText} = req.body;
    const path = req.file.path;

    try {
        const imageData = fs.readFileSync(path);

        const result = await query("INSERT INTO images (name, alt_text, image_data) VALUES ($1, $2, $3)", [name, alternativeText, imageData]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Błąd przy dodawaniu zdjęcia do bazy: ", error);
        res.status(500).json({ message: "Błąd przy dodawaniu zdjęcia do bazy." });
    }
};
