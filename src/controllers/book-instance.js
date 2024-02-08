import { BookInstance, Book } from "../models/index.js";
import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";

export const book_instance_list = async (req, res, next) => {
  console.log("called");
  try {
    const allBookInstances = await BookInstance.find().populate("book").exec();

    res.render("book-instance/list", {
      title: "Book Instance List",
      bookInstanceList: allBookInstances,
    });
  } catch (error) {
    next(error);
  }
};

export const book_instance_detail = asyncHandler(async (req, res, next) => {
  const bookInstance = await BookInstance.findById(req.params.id)
    .populate("book")
    .exec();

  if (bookInstance === null) {
    const err = new Error("Book copy not found");
    err.status = 404;
    return next(err);
  }

  res.render("book-instance/detail", {
    title: "Book:",
    bookInstance,
  });
});

export const book_instance_create_get = asyncHandler(async (req, res, next) => {
  const allBooks = await Book.find({}, "title").sort({ title: 1 });

  res.render("book-instance/form", {
    title: "Create BookInstance",
    book_list: allBooks,
  });
});

export const book_instance_create_post = [
  body("book", "Book must be specified").trim().isLength({ min: 1 }).escape(),
  body("imprint", "Imprint must be specified")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("status").escape(),
  body("due_back", "Invalid date")
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const bookInstance = new BookInstance({
      book: req.body.book,
      imprint: req.body.imprint,
      status: req.body.status,
      due_back: req.body.due_back,
    });

    if (!errors.isEmpty()) {
      const allBooks = await Book.find({}, "title").sort({ title: 1 }).exec();

      res.render("book-instance/form", {
        title: "Create Book Instance",
        book_list: allBooks,
        selected_book: bookInstance.book._id,
        errors: errors.array(),
        book_instance: bookInstance,
      });
      return;
    } else {
      await bookInstance.save();
      res.redirect(bookInstance.url);
    }
  }),
];

export const book_instance_delete_get = asyncHandler(async (req, res, next) => {
  const bookInstance = await BookInstance.findById(req.params.id);

  if (bookInstance === null) {
    res.redirect("/catalog/book-instances");
    return;
  }

  res.render("book-instance/delete", {
    title: "Delete Book Instance",
    book_instance: bookInstance,
  });
});

export const book_instance_delete_post = asyncHandler(async (req, res) => {
  await BookInstance.findByIdAndDelete(req.body._id);
  res.redirect("/catalog/book-instances");
});

export const book_instance_update_get = [
  body("book", "Book must be specified").trim().isLength({ min: 1 }).escape(),
  body("imprint", "Imprint must be specified")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("status").escape(),
  body("due_back", "Invalid date")
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const [bookInstance, allBooks] = await Promise.all([
      BookInstance.findById(req.params.id).populate("book"),
      Book.find().sort({ title: 1 }),
    ]);

    if (bookInstance === null) {
      const err = new Error("Book not found");
      err.status = 404;
      return next(err);
    }

    res.render("book-instance/form", {
      title: "Update Book Instance",
      book_list: allBooks,
      selected_book: bookInstance.book._id,
      errors: errors.array(),
      book_instance: bookInstance,
    });
  }),
];

export const book_instance_update_post = [
  body("book", "Book must be specified").trim().isLength({ min: 1 }).escape(),
  body("imprint", "Imprint must be specified")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("status").escape(),
  body("due_back", "Invalid date")
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const bookInstance = new BookInstance({
      book: req.body.book,
      imprint: req.body.imprint,
      status: req.body.status,
      due_back: req.body.due_back,
    });

    if (!errors.isEmpty()) {
      const allBooks = await Book.find({}, "title").sort({ title: 1 }).exec();

      res.render("book-instance/form", {
        title: "Create Book Instance",
        book_list: allBooks,
        selected_book: bookInstance.book._id,
        errors: errors.array(),
        book_instance: bookInstance,
      });
      return;
    } else {
      await bookInstance.save();
      res.redirect(bookInstance.url);
    }
  }),
];
