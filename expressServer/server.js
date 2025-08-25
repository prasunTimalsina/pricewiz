import express from "express";
import dotenv from "dotenv";
import { UpdateListing } from "./logic.js";

import "./scheduler.js";

dotenv.config();

const app = express();
const PORT = 4000;

app.get("/", (req, res) => {
  res.send("express server");
});

app.get("/update/products", async (req, res) => {
  try {
    const products = await UpdateListing();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
