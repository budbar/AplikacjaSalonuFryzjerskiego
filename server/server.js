import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import session from "express-session";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'sekretny_klucz_bartka',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Ustaw na true, jeśli używasz HTTPS
}));

app.use('/auth', authRoutes);

app.get('/session', (req, res) => {
  res.json(req.session);
});

app.listen(8080, () => {
  console.log('Server is running on port 8080');
});