const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

// Env
const PORT = process.env.PORT || 3000;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://mongo:27017/simple_crud";

// Mongo connect
mongoose
  .connect(MONGO_URI)
  .then(() => console.log(" MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });

// Simple model
const ItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    note: { type: String, default: "" }
  },
  { timestamps: true }
);

const Item = mongoose.model("Item", ItemSchema);

// Health check
app.get("/", (req, res) => {
  res.json({ ok: true, service: "mongo-crud-get-post" });
});

// GET all items
app.get("/items", async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch items" });
  }
});

// POST create item
app.post("/items", async (req, res) => {
  try {
    const { title, note } = req.body;
    if (!title) return res.status(400).json({ error: "title is required" });

    const created = await Item.create({ title, note });
    res.status(201).json(created);
  } catch (e) {
    res.status(500).json({ error: "Failed to create item" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
