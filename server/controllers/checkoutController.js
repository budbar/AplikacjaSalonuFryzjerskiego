import { query } from "../database.js";
import sendOrderConfirmationEmail from "../services/emailService.js";
import { PaymentMethodsEnum } from "../enums/PaymentMethodsEnum.js";
import { PostageMethodsEnum } from "../enums/PostageMethodsEnum.js"

const choosePaymentMethodName = (paymentMethod) => {
    switch(paymentMethod) {
        case PaymentMethodsEnum.CreditCard:
            return "Karta kredytowa";
        case PaymentMethodsEnum.OnDelivery:
            return "Za pobraniem";
        case PaymentMethodsEnum.Blik:
            return "BLIK";
    }
};

const choosePostageMethodName = (postageMethod) => {
    switch(postageMethod) {
        case PostageMethodsEnum.Dhl:
            return "DHL";
        case PostageMethodsEnum.InPostExpress:
            return "InPostExpress";
    }
};

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

        await sendOrderConfirmationEmail(user.rows[0].email, {
            addressDetails: address_details,
            paymentMethod: choosePaymentMethodName(payment_method),
            postageMethod: choosePostageMethodName(postage),
            totalCost: final_price,
        });

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