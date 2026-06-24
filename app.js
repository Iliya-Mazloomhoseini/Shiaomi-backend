import express from "express";
import morgan from "morgan";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";
const app = express();
const __filename = fileURLToPath(import.meta.url);
export const __direname = path.dirname(__filename);
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

app.use((req, res, next) => {
  return res.status(404).json({
    message: "the route not Found",
  });
});
