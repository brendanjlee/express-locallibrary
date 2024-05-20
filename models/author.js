const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// create schema
const AuthorSchema = new Schema({
  first_name: { type: String, required: true, maxLength: 100 },
  family_name: { type: String, required: true, maxLength: 100 },
  date_of_birth: { type: Date },
  date_of_death: { type: Date },
});

// create virtual for author full name, url
AuthorSchema.virtual("name").get(() => {
  let fullName = "";
  if (this.first_name && this.family_name) {
    fullName = `${this.family_name}, ${this.family_name}`;
  }

  return fullName;
});

AuthorSchema.virtual("url").get(() => {
  return `/catalog/author/${this._id}`;
});

// export module
module.exports = mongoose.model("Author", AuthorSchema);
