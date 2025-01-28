import { query } from "../database.js";
import { PostStatusEnum }from "../enums/PostStatusEnum.js";

export const addPost = async (req, res) => {
  // console.log(req);
  const { title, description, category, user_id } = req.body;

  const status = PostStatusEnum.ForVeryfication;

  try {
    const result = await query(
      "INSERT INTO posts (title, description, category, status, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [title, description, category, status, user_id]
    );


    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Błąd przy dodawaniu postu do bazy: ", error);
    res.status(500).json({ message: "Błąd przy dodawaniu postu do bazy." });
  }
};

export const updatePost = async (req, res) => {
    const { id } = req.params;
    const { title, description, category, status } = req.body; 

    try {
        const result = await query(
            "UPDATE posts SET title = $1, description = $2, category = $3, status = $4 WHERE id = $5 RETURNING *", 
            [title, description, category, status, id]
        );

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error("Błąd przy aktualizacji danych posta: ", error);
        res.status(500).json({ message: "Błąd przy aktualizacji danych posta." });
    }
};

export const deletePost = async (req, res) => {
    const {id} = req.params;

    try {
        const result = await query("DELETE FROM posts WHERE id = $1", [id]);
        res.status(204).send();
    } catch (error) {
        console.error("Błąd usuwania produktu: ", error);
        res.status(500).json({message: "Błąd usuwania produktu."});
    }
};

export const getPosts = async (req, res) => {
  try {
    const result = await query("SELECT p.id, p.title, p.description, p.category, p.status, p.create_date, p.user_id, u.first_name, u.last_name FROM posts p JOIN users u ON p.user_id = u.id");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Błąd pobierania postów: ", error);
    res.status(500).json({ message: "Błąd pobierania postów." });
  }
};

export const getAcceptedPosts = async (req, res) => {
  try {
    const acceptedStatus = PostStatusEnum.Accepted;
    const result = await query("SELECT p.id, p.title, p.description, p.category, p.status, p.create_date, p.user_id, u.first_name, u.last_name FROM posts p JOIN users u ON p.user_id = u.id WHERE p.status = $1", [acceptedStatus]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Błąd pobierania postów: ", error);
    res.status(500).json({ message: "Błąd pobierania postów." });
  }
};
