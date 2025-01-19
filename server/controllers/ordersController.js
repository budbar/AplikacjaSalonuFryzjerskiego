import { query } from "../database.js";

export const getOrders = async (req, res) => {
    const userId = Number(req.params.id);

    try {
        const result = await query("SELECT * FROM orders WHERE user_id = $1", [userId]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Błąd pobierania zamówień: ", error);
        res.status(500).json({ message: "Błąd pobierania zamówień." });
    }
};

export const editOrderStatus = async (req, res) => {
    const orderId = Number(req.params.id);
    const {orderStatus} = req.body;

    try {
        const result = await query("UPDATE orders SET status = $1 WHERE id = $2", [orderStatus, orderId]);
        res.status(200).json(result.rows[0]);       
    } catch (error) {
        console.error("Błąd przy aktualizacji stanu zamówienia: ", error);
        res.status(500).json({ message: "Błąd przy aktualizacji stanu zamówienia." });
    }
}

export const getAllOrders = async (req, res) => {
    try {
        const result = await query("SELECT * FROM orders");
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Błąd przy pobieraniu zamówień: ", error);
        res.status(500).json({ message: "Błąd przy pobieraniu zamówień." });
    }
}