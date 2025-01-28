import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import session from "express-session";
import authRoutes from "./routes/authRoutes.js";
import accountRoutes from "./routes/accountRoutes.js";
import multimediaRoutes from "./routes/multimediaRoutes.js";
import sliderRoutes from "./routes/sliderRoutes.js";
import productManagementRoutes from "./routes/productManagementRoutes.js";
import checkoutRoutes from "./routes/checkoutRoutes.js";
import ordersRoutes from "./routes/ordersRoutes.js";
import postManagementRoutes from "./routes/postManagementRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import notificationsRoutes from "./routes/notificationsRoutes.js"

dotenv.config();

const app = express();

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || "sekretny_klucz_bartka",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use("/auth", authRoutes);
app.use("/account", accountRoutes);
app.use("/multimedia", multimediaRoutes);
app.use("/slider-settings", sliderRoutes);
app.use("/products-management", productManagementRoutes);
app.use("/checkout", checkoutRoutes);
app.use("/orders", ordersRoutes);
app.use("/posts-management", postManagementRoutes);
app.use("/comment", commentRoutes);
app.use("/notification", notificationsRoutes);

let cart = [];

//Dodaj produkt do koszyka
app.post("/cart/add-to-cart", (req, res) => {
  const product = req.body;
  const existingProduct = cart.find(item => item.id === product.id);

  if (existingProduct) {
    existingProduct.quantity += 1;
    existingProduct.totalPrice = existingProduct.quantity * existingProduct.price;
  } else {
    product.quantity = 1;
    product.totalPrice = product.price;
    cart.push(product);
  }

  res.status(201).json(cart);
});

//Pobierz produkty z koszyka
app.get("/cart/get-cart-products", (req, res) => {
  res.json(cart);
});

//Usuń produkt z koszyka
app.delete("/cart/remove-product-from-cart/:id", (req, res) => {
  const productId = Number(req.params.id);
  cart = cart.filter((product) => product.id !== productId);
  res.json(cart);
});

//Wyczyść produkty z koszyka
app.delete("/cart/remove-all-from-cart", (req, res) => {
  cart = [];
  res.json(cart);
});

// Zwiększ ilość produktu w koszyku
app.post("/cart/increment-quantity/:id", (req, res) => {
  const productId = Number(req.params.id);
  const product = cart.find(item => item.id === productId);

  if (product) {
    product.quantity += 1;
    product.totalPrice = product.quantity * product.price;
  }

  res.json(cart);
});

// Zmniejsz ilość produktu w koszyku
app.post("/cart/decrement-quantity/:id", (req, res) => {
  const productId = Number(req.params.id);
  const product = cart.find(item => item.id === productId);

  if (product && product.quantity > 1) {
    product.quantity -= 1;
    product.totalPrice = product.quantity * product.price;
  }

  res.json(cart);
});

app.get("/session", (req, res) => {
  res.json(req.session);
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});