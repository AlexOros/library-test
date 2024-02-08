import { Mongoose } from "mongoose";
import { Genre, Book } from "../models/index.js";
import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";

export const genre_list = async (req, res, next) => {
  try {
    const genreList = await Genre.find({}, { name: true }).sort({
      name: 1,
    });

    res.render("genre/list", { title: "Genre List", genreList });
  } catch (error) {
    next(error);
  }
};

export const genre_detail = asyncHandler(async (req, res, next) => {
  const { id: genreId } = req.params;

  if (!Mongoose.prototype.isValidObjectId(genreId)) {
    const err = new Error("Invalid genre id");
    err.status = 400;
    return next(err);
  }

  const [genre, books] = await Promise.all([
    Genre.findById(genreId),
    Book.find({ genre: genreId }).sort({ title: 1 }),
  ]);

  if (genre === null) {
    // No results.
    const err = new Error("Genre not found");
    err.status = 404;
    return next(err);
  }

  res.render("genre/detail", {
    title: "Genre Detail",
    genre,
    bookList: books,
  });
});

export const genre_create_get = (_, res) => {
  res.render("genre/form", { title: "Create Genre" });
};

export const genre_create_post = [
  // Validate and sanitize the name field.
  body("name", "Genre name required")
    .trim()
    .notEmpty()
    .bail()
    .isLength({ min: 3 })
    .withMessage("Genre name must contain at least 3 characters")
    .isAlpha()
    .withMessage("Genre name must contain only letters and spaces")
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a genre object with escaped and trimmed data.
    const genre = new Genre({ name: req.body.name });
    console.log(genre);

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("genre/form", {
        title: "Create Genre",
        genre,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Check if Genre with same name already exists.
      const genreExists = await Genre.findOne({
        name: req.body.name,
      }).collation({ locale: "en", strength: 2 });

      if (genreExists) {
        // Genre exists, redirect to its detail page.
        res.redirect(genreExists.url);
      } else {
        // await genre.save();
        // New genre saved. Redirect to genre detail page.
        res.redirect(genre.url);
      }
    }
  }),
];

export const genre_delete_get = asyncHandler(async (req, res, next) => {
  // Get details of author and all their books (in parallel)
  const [genre, booksByGenre] = await Promise.all([
    Genre.findById(req.params.id),
    Book.find({ genre: req.params.id }, { title: true, summary: true }),
  ]);

  if (genre === null) {
    // No results.
    res.redirect("/catalog/authors");
  }

  res.render("genre/delete", {
    title: "Delete Genre",
    genre: genre,
    book_list: booksByGenre,
  });
});

export const genre_delete_post = asyncHandler(async (req, res, next) => {
  // Get details of author and all their books (in parallel)
  const [genre, booksByGenre] = await Promise.all([
    Genre.findById(req.params.id),
    Book.find({ genre: req.params.id }, { title: true, summary: true }),
  ]);

  if (booksByGenre.length > 0) {
    // Author has books. Render in same way as for GET route.
    res.render("author/delete", {
      title: "Delete Genre",
      genre,
      book_list: booksByGenre,
    });
    return;
  } else {
    // Author has no books. Delete object and redirect to the list of authors.
    await Genre.findByIdAndDelete(req.body.genre_id);
    res.redirect("/catalog/genres");
  }
});
