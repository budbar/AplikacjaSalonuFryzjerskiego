import { query } from "../database.js";
import fs from "fs";

export const addImage = async (req, res) => {
  const { name, altText } = req.body;
  const path = req.file.path;

  try {
    const imageData = fs.readFileSync(path);
    const result = await query(
      "INSERT INTO images (name, alt_text, image_data) VALUES ($1, $2, $3) RETURNING *",
      [name, altText, imageData]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Błąd przy dodawaniu zdjęcia do bazy: ", error);
    res.status(500).json({ message: "Błąd przy dodawaniu zdjęcia do bazy." });
  }
};

export const updateImage = async (req, res) => {
    const {id} = req.params;
    const {name, altText} = req.body; 

    try {
        const result = await query(
            "UPDATE images SET name = $1, alt_text = $2 WHERE id = $3", 
            [name, altText, id]
        );

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error("Błąd przy aktualizacji danych zdjęcia: ", error);
        res.status(500).json({ message: "Błąd przy aktualizacji danych zdjęcia." });
    }
};

export const deleteImage = async (req, res) => {
    const {id} = req.params;

    try {
        const result = await query("DELETE FROM images WHERE id = $1", [id]);
        res.status(204).send();
    } catch (error) {
        console.error("Błąd usuwania zdjęcia: ", error);
        res.status(500).json({message: "Błąd usuwania zdjęcia."});
    }
};

export const getImages = async (req, res) => {
  try {
    const result = await query("SELECT id, name, alt_text, image_data, slider_selection FROM images");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Błąd pobierania zdjęć: ", error);
    res.status(500).json({ message: "Błąd pobierania zdjęć." });
  }
};