const Genre = require("../models/genre");
const Book = require("../models/book");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// Display list of all Genre.
exports.genre_list = asyncHandler(async (req, res, next) => {
  const allGenres = await Genre.find().exec();

  res.render("genre_list", {
    title: "Genre List",
    genre_list: allGenres,
  });
});

// Display detail page for a specific Genre.
exports.genre_detail = asyncHandler(async (req, res, next) => {
  const [genre, booksInGenre] = await Promise.all([
    Genre.findById(req.params.id).exec(),
    Book.find({ genre: req.params.id }, "title summary").exec(),
  ]);

  if (genre === null) {
    // got no results
    const err = new Error("Genre not found");
    err.status = 404;
    return next(err);
  }

  res.render("genre_detail", {
    title: "Genre Detail",
    genre: genre,
    genre_books: booksInGenre,
  });
});

// Display Genre create form on GET.
exports.genre_create_get = asyncHandler(async (req, res, next) => {
  // render GET route
  res.render("genre_form", { title: "Create Genre" });
});

// Handle Genre create on POST.
// Array of controller functions called in order
exports.genre_create_post = [
  // validate and sanitize input
  body("name", "Genre must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),

  // process request after validating
  asyncHandler(async (req, res, next) => {
    // extract errors from request
    const errors = validationResult(req);

    // create new genre object with clean data
    const genre = new Genre({ name: req.body.name });

    // return form if data is invalid
    if (!errors.isEmpty()) {
      res.render("genre_form", {
        title: "Create Genre",
        genre: genre,
        errors: errors.array(),
      });
      return;
    }

    // Check if the valid form is a duplicate genre
    const genreExists = await Genre.findOne({ name: req.body.name })
      .collation({ locale: "en", strength: 2 }) // ignore case
      .exec();
    if (genreExists) {
      res.redirect(genreExists.url);
      return;
    }

    // save and redirect to the new genre
    await genre.save();
    res.redirect(genre.url);
  }),
];

// Display Genre delete form on GET.
exports.genre_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Genre delete GET");
});

// Handle Genre delete on POST.
exports.genre_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Genre delete POST");
});

// Display Genre update form on GET.
exports.genre_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Genre update GET");
});

// Handle Genre update on POST.
exports.genre_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Genre update POST");
});
