import path from "path";
import express, { Request, Response } from "express";

import cors from "cors";
import { getUser } from "./user";
import { getSales } from "./sales";

import 'dotenv/config';

const app = express();
const port = process.env.PORT || 8080;

// Serve static files from the public directory
const directoryPath = path.join(__dirname, '..', 'data');
app.use(express.static(directoryPath));

app.use(cors());
app.get("/user", getUser);
app.get("/sales", getSales);

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
