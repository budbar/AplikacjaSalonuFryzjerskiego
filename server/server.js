import express from "express";
import cors from "cors";

const app = express();

const corsOptions = {
  origin: "http://localhost:5173"
};

app.use(cors(corsOptions));

app.get('/api', (req, res) => {
  res.json({ owoce: ["jabłko", "gruszka"]});
});

app.listen(8080, () => {
  console.log('Server is running on port 8080');
});