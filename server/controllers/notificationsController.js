import { query } from "../database.js";
import { AccountLevels } from "../enums/AccountLevelEnum.js"

export const addNotification = async (req, res) => {
  const { text, user_id, category, account_level } = req.body;

  try {
    const result = await query(
      "INSERT INTO notifications (text, user_id, category, account_level) VALUES ($1, $2, $3, $4) RETURNING *",
      [text, user_id, category, account_level]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Błąd przy dodawaniu powiadomienia do bazy: ", error);
    res.status(500).json({ message: "Błąd przy dodawaniu powiadomienia do bazy." });
  }
};

export const getNotifications = async (req, res) => {
  try {
    const result = await query(
      "SELECT * FROM notifications WHERE account_level = $1 and status = '1'", [ AccountLevels.User ]);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Błąd przy pobieraniu powiadomień z bazy: ", error);
    res.status(500).json({ message: "Błąd przy pobieraniu powiadomień z bazy." });
  }
};

export const getNotificationsByCategory = async (req, res) => {
  const { category } = req.params;

  try {
    const result = await query(
      "SELECT * FROM notifications WHERE account_level = $1 and status = '1' and category = $2", [ AccountLevels.User, category ]);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Błąd przy pobieraniu powiadomień z bazy: ", error);
    res.status(500).json({ message: "Błąd przy pobieraniu powiadomień z bazy." });
  }
};

export const getNotificationsById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await query(
      "SELECT * FROM notifications WHERE account_level != $1 and status = '1' and user_id= $2", [ AccountLevels.User, id ]);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Błąd przy pobieraniu powiadomień z bazy: ", error);
    res.status(500).json({ message: "Błąd przy pobieraniu powiadomień z bazy." });
  }
};

export const updateNotificationStatus = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await query(
      "UPDATE notifications SET status = '2' WHERE id = $1", [ id ]);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Błąd przy modyfikacji statusu posta: ", error);
    res.status(500).json({ message: "Błąd przy modyfikacji statusu posta." });
  }
}