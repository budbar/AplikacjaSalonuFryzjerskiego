import { query } from "../database.js";
import fs from "fs";
import sharp from "sharp";

export const addProduct = async (req, res) => {
  const { name, description, price, altText } = req.body;
  const path = req.file.path;

  try {
    const image = await sharp(path).resize(800, 600).toBuffer();

    const result = await query(
      "INSERT INTO products (name, description, price, image_data, alt_text) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [name, description, price, image, altText]
    );

    fs.unlinkSync(path);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Błąd przy dodawaniu produktu do bazy: ", error);
    res.status(500).json({ message: "Błąd przy dodawaniu produktu do bazy." });
  }
};

export const updateProduct = async (req, res) => {
    const {id} = req.params;
    const {name, description, price, altText} = req.body; 

    try {
        const result = await query(
            "UPDATE products SET name = $1, description = $2, price = $3, alt_text = $4 WHERE id = $5", 
            [name, description, price, altText, id]
        );

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error("Błąd przy aktualizacji danych produktu: ", error);
        res.status(500).json({ message: "Błąd przy aktualizacji danych produktu." });
    }
};

export const deleteProduct = async (req, res) => {
    const {id} = req.params;

    try {
        const result = await query("DELETE FROM products WHERE id = $1", [id]);
        res.status(204).send();
    } catch (error) {
        console.error("Błąd usuwania produktu: ", error);
        res.status(500).json({message: "Błąd usuwania produktu."});
    }
};

export const getProducts = async (req, res) => {
  try {
    const result = await query("SELECT id, name, description, price, image_data, alt_text FROM products");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Błąd pobierania produktów: ", error);
    res.status(500).json({ message: "Błąd pobierania produktów." });
  }
};