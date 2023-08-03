import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import morgan from "morgan";
import notesSchema from "./schema/note.js";

const app = express();
const PORT = 3500;

async function connectToDatabase() {
  try {
    await mongoose.connect(
      "mongodb+srv://hazrc:rodrigocampos448@hazrc.zsrh3w0.mongodb.net/project-01",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error(error);
  }
}

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.get("/", async (req, res) => {
  res.send("Hi!");
});

app.post("/create/", async (req, res) => {
  try {
    console.log(req.body);
    await notesSchema.create({
      authorId: req.body.username,
      text: req.body.description,
      title: req.body.title,
    });
    res.json({
      status: 200,
      content: "Note created correctly!",
    });
  } catch (error) {
    res.json({
      status: 500,
      content: "Failed to create note!",
      error: error.message,
    });
  }
});

app.post("/delete", async (req, res) => {
  try {
    await notesSchema.deleteOne({ _id: req.body.id });
    res.json({
      status: 200,
      content: "Note deleted correctly!",
    });
  } catch (error) {
    res.json({
      status: 404,
      content: "Note not found!",
      error: error.message,
    });
  }
});

app.get("/notes/:user", async (req, res) => {
  try {
    const notes = await notesSchema.find({ authorId: req.params.user });
    res.json(notes);
  } catch (error) {
    res.json({
      status: 500,
      content: "Failed to fetch notes!",
      error: error.message,
    });
  }
});

app.post("/edit", async (req, res) => {
  try {
    await notesSchema.findOneAndUpdate(
      { _id: req.body._id },
      { title: req.body.title, text: req.body.text }
    );
    res.json({
      status: 200,
      content: "Note edited correctly!",
    });
  } catch (error) {
    res.json({
      status: 500,
      content: "Failed to edit note!",
      error: error.message,
    });
  }
});

async function startServer() {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });
}

startServer();
