import { query } from "../database.js";
import { CommentStatusEnum }from "../enums/CommentStatusEnum.js";

export const addComment = async (req, res) => {
  const { content, post_id, user_id, status} = req.body;


  try {
    const result = await query(
      "INSERT INTO comments (content, post_id, user_id, status) VALUES ($1, $2, $3, $4) RETURNING *",
      [content, post_id, user_id, status]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Błąd przy dodawaniu komentarza do bazy: ", error);
    res.status(500).json({ message: "Błąd przy dodawaniu komentarza do bazy." });
  }
};

export const updateComment = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; 

    try {
        const result = await query(
            "UPDATE comments SET status = $1 WHERE id = $2 RETURNING *", 
            [status, id]
        );

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error("Błąd przy aktualizacji statusu komentarza: ", error);
        res.status(500).json({ message: "Błąd przy aktualizacji statusu komentarza." });
    }
};

export const deleteComment = async (req, res) => {
    const {id} = req.params;

    try {
        const result = await query("DELETE FROM posts WHERE id = $1", [id]);
        res.status(204).send();
    } catch (error) {
        console.error("Błąd usuwania produktu: ", error);
        res.status(500).json({message: "Błąd usuwania produktu."});
    }
};

export const getComments = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await query("SELECT c.id, c.content, c.post_id, c.status, c.create_date, c.user_id, u.first_name, u.last_name FROM comments c JOIN users u ON c.user_id = u.id WHERE c.post_id = $1", [ id ]);
    
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Błąd pobierania postów: ", error);
        res.status(500).json({ message: "Błąd pobierania postów." });
    }
};

export const getAcceptedComments = async (req, res) => {
    const { id } = req.params;
    const acceptedStatus = CommentStatusEnum.Accepted;

    try {
    const result = await query("SELECT c.id, c.content, c.post_id, c.status, c.create_date, c.user_id, u.first_name, u.last_name FROM comments c JOIN users u ON c.user_id = u.id WHERE c.post_id = $1 AND c.status = $2", [ id, acceptedStatus ]);
    
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Błąd pobierania postów: ", error);
    res.status(500).json({ message: "Błąd pobierania postów." });
  }
};
