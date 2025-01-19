import { createTransport } from 'nodemailer';
import dotenv from "dotenv";

dotenv.config();

const transporter = createTransport({
  service: 'gmail',
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendOrderConfirmationEmail = async (userEmail, orderDetails) => {
  const { addressDetails, paymentMethod, postageMethod, totalCost } = orderDetails;

  const mailOptions = {
    from: {
      name: "Aplikacja Salonu Fryzjerskiego",
      address: process.env.EMAIL_USER
    },
    to: userEmail,
    subject: 'Potwierdzenie zamówienia',
    html: `
      <h1>Dziękujemy za Twoje zamówienie!</h1>
      <p>Twoje zamówienie zostało pomyślnie złożone.</p>
      <h2>Szczegóły zamówienia:</h2>
      <ul>
        <li><strong>Metoda płatności:</strong> ${paymentMethod}</li>
        <li><strong>Sposób dostawy:</strong> ${postageMethod}</li>
        <li><strong>Łączny koszt:</strong> ${totalCost.toFixed(2)} PLN</li>
      </ul>
      <h3>Adres dostawy:</h3>
      <p>${addressDetails.residence}, ${addressDetails.town}, ${addressDetails.zip_code}, ${addressDetails.country}</p>
      <p>Dziękujemy za zakupy w naszym sklepie!</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Błąd wysyłania e-maila:', error);
    throw new Error('Nie udało się wysłać wiadomości e-mail.');
  }
};

export default sendOrderConfirmationEmail;