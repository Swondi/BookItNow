import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { generateKey } from "./registration/keys";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.send(generateKey());
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});