import { Schema, model } from "mongoose";

const noteSchema = new Schema({
  authorId: String,
  title: String,
  text: String
})

export default model("notes", noteSchema);