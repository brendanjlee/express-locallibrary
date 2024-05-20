const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// create schema
const GenreSchema = new Schema({
  name: { type: String, required: true, minLength: 3, maxLength: 20 },
});

// virtual url
GenreSchema.virtual("url").get(() => {
  return `/catalog/genre/${this._id}`;
});

module.exports = mongoose.model("Genre", GenreSchema);
