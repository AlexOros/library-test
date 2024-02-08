import { Author, Book } from "../models/index.js";
import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";

export const author_list = asyncHandler(async (req, res, next) => {
  try {
    const allAuthors = await Author.find().sort({ last_name: 1 });

    res.render("author/list", {
      title: "Author List",
      authorList: allAuthors,
    });
  } catch (error) {
    next(error);
  }
});

export const author_detail = asyncHandler(async (req, res, next) => {
  const [author, allBooksByAuthor] = await Promise.all([
    Author.findById(req.params.id),
    Book.find({ author: req.params.id }, "title summary"),
  ]);

  if (author === null) {
    const err = new Error("Author not found");
    err.status = 404;
    return next(err);
  }

  res.render("author/detail", {
    title: "Author Detail",
    author: author,
    bookList: allBooksByAuthor,
  });
});

export const author_create_get = asyncHandler(async (req, res, next) => {
  res.render("author/form", { title: "Create Author" });
});

export const author_create_post = [
  body("first_name")
    .trim()
    .notEmpty()
    .escape()
    .withMessage("First name must be specified.")
    .isAlphanumeric()
    .withMessage("First name has non-alphanumeric characters."),
  body("last_name")
    .trim()
    .notEmpty()
    .escape()
    .withMessage("Last name must be specified.")
    .isAlphanumeric()
    .withMessage("Last name has non-alphanumeric characters."),
  body("date_of_birth", "Invalid date of birth")
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate(),
  body("date_of_death", "Invalid date of death")
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const { first_name, last_name, date_of_birth, date_of_death } = req.body;

    const author = new Author({
      first_name,
      last_name,
      date_of_birth,
      date_of_death,
    });

    if (!errors.isEmpty()) {
      res.render("author/form", {
        title: "Create Author",
        author: author,
        errors: errors.array(),
      });
      return;
    } else {
      await author.save();
      res.redirect(author.url);
    }
  }),
];

export const author_delete_get = asyncHandler(async (req, res, next) => {
  // Get details of author and all their books (in parallel)
  const [author, allBooksByAuthor] = await Promise.all([
    Author.findById(req.params.id),
    Book.find({ author: req.params.id }, "title summary"),
  ]);

  if (author === null) {
    // No results.
    res.redirect("/catalog/authors");
  }

  res.render("author/delete", {
    title: "Delete Author",
    author: author,
    author_books: allBooksByAuthor,
  });
});

export const author_delete_post = asyncHandler(async (req, res, next) => {
  // Get details of author and all their books (in parallel)
  const [author, allBooksByAuthor] = await Promise.all([
    Author.findById(req.params.id),
    Book.find({ author: req.params.id }, "title summary"),
  ]);

  if (allBooksByAuthor.length > 0) {
    // Author has books. Render in same way as for GET route.
    res.render("author/delete", {
      title: "Delete Author",
      author: author,
      author_books: allBooksByAuthor,
    });
    return;
  } else {
    // Author has no books. Delete object and redirect to the list of authors.
    await Author.findByIdAndDelete(req.body.author_id);
    res.redirect("/catalog/authors");
  }
});

export const author_update_get = asyncHandler(async (req, res, next) => {
  const author = await Author.findById(req.params.id);

  res.render("author/form", { title: "Update Author", author });
});

export const author_update_post = [
  body("first_name")
    .trim()
    .notEmpty()
    .escape()
    .withMessage("First name must be specified.")
    .isAlphanumeric()
    .withMessage("First name has non-alphanumeric characters."),
  body("last_name")
    .trim()
    .notEmpty()
    .escape()
    .withMessage("Last name must be specified.")
    .isAlphanumeric()
    .withMessage("Last name has non-alphanumeric characters."),
  body("date_of_birth", "Invalid date of birth")
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate(),
  body("date_of_death", "Invalid date of death")
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const { first_name, last_name, date_of_birth, date_of_death } = req.body;
    const originalAuthor = await Author.findById(req.params.id);

    const author = new Author({
      ...originalAuthor,
      first_name,
      last_name,
      date_of_birth,
      date_of_death,
    });

    if (!errors.isEmpty()) {
      res.render("author/form", {
        title: "Update Author",
        author,
        errors: errors.array(),
      });
      return;
    } else {
      await author.save();
      res.redirect(author.url);
    }
  }),
];
