import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

const corsOptions = {
  origin: "http://localhost:5173"
};

app.use(cors(corsOptions));

app.use(express.json());

app.use('/auth', authRoutes);

app.listen(8080, () => {
  console.log('Server is running on port 8080');
});