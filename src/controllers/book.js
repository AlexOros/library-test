import { Book, Author, Genre, BookInstance } from "../models/index.js";
import asyncHandler from "express-async-handler";
import { Mongoose } from "mongoose";
import { body, validationResult } from "express-validator";

export const index = async (req, res, next) => {
  try {
    const [
      bookCount,
      bookInstanceCount,
      availableBookInstanceCount,
      authorCount,
      genreCount,
    ] = await Promise.all([
      Book.countDocuments({}),
      BookInstance.countDocuments({}),
      BookInstance.countDocuments({ status: "available" }),
      Author.countDocuments({}),
      Genre.countDocuments({}),
    ]);

    res.render("index", {
      title: "Local Library Home",
      bookCount,
      bookInstanceCount,
      availableBookInstanceCount,
      authorCount,
      genreCount,
    });
  } catch (error) {
    next(error);
  }
};

export const book_list = asyncHandler(async (req, res, next) => {
  try {
    const allBooks = await Book.find({}, "title author")
      .sort({ title: 1 })
      .populate("author");

    console.log(allBooks);

    res.render("book/list", { title: "Book List", bookList: allBooks });
  } catch (error) {
    next(error);
  }
});

export const book_detail = asyncHandler(async (req, res, next) => {
  const { id: bookId } = req.params;
  if (!Mongoose.prototype.isValidObjectId(bookId)) {
    const err = new Error("Invalid book id");
    err.status = 400;
    return next(err);
  }

  const [book, bookInstances] = await Promise.all([
    Book.findById(bookId).populate("author").populate("genre"),
    BookInstance.find({ book: bookId }),
  ]);

  if (book === null) {
    const err = new Error("Book not found");
    err.status = 404;
    return next(err);
  }

  res.render("book/detail", {
    title: book.title,
    book: book,
    bookInstances,
  });
});

export const book_create_get = asyncHandler(async (req, res, next) => {
  const [allAuthors, allGenres] = await Promise.all([
    Author.find().sort({ last_name: 1 }),
    Genre.find().sort({ name: 1 }),
  ]);

  res.render("book/form", {
    title: "Create Book",
    authors: allAuthors,
    genres: allGenres,
  });
});

export const book_create_post = [
  (req, res, next) => {
    if (!Array.isArray(req.body.genre)) {
      req.body.genre =
        typeof req.body.genre === "undefined" ? [] : [req.body.genre];
    }
    next();
  },

  body("title", "Title must not be empty.").trim().notEmpty().escape(),
  body("author", "Author must not be empty.").trim().notEmpty().escape(),
  body("summary", "Summary must not be empty.").trim().notEmpty().escape(),
  body("isbn", "ISBN must not be empty").trim().notEmpty().escape(),
  body("genre.*").escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const book = new Book({
      title: req.body.title,
      author: req.body.author,
      summary: req.body.summary,
      isbn: req.body.isbn,
      genre: req.body.genre,
    });

    if (!errors.isEmpty()) {
      const [allAuthors, allGenres] = await Promise.all([
        Author.find().sort({ last_name: 1 }),
        Genre.find().sort({ name: 1 }),
      ]);

      for (const genre of allGenres) {
        if (book.genre.includes(genre._id)) {
          genre.checked = "true";
        }
      }

      res.render("book/form", {
        title: "Create Book",
        authors: allAuthors,
        genres: allGenres,
        book: book,
        errors: errors.array(),
      });
    } else {
      await book.save();
      res.redirect(book.url);
    }
  }),
];

export const book_delete_get = asyncHandler(async (req, res, next) => {
  const [book, bookInstances] = await Promise.all([
    Book.findById(req.params.id),
    BookInstance.find({ book: req.params.id }),
  ]);

  if (book === null) {
    res.redirect("/catalog/books");
  }

  res.render("book/delete", {
    title: "Delete Book",
    book,
    book_instance_list: bookInstances,
  });
});

export const book_delete_post = asyncHandler(async (req, res, next) => {
  const [book, bookInstances] = await Promise.all([
    Book.findById(req.params.id),
    BookInstance.find({ book: req.params.id }),
  ]);

  if (bookInstances.length > 0) {
    res.render("book/delete", {
      title: "Delete Book",
      book,
      book_instance_list: bookInstances,
    });
    return;
  } else {
    await Book.findByIdAndDelete(req.body.book_id);
    res.redirect("/catalog/books");
  }
});

export const book_update_get = asyncHandler(async (req, res, next) => {
  const [book, allAuthors, allGenres] = await Promise.all([
    Book.findById(req.params.id).populate("author"),
    Author.find().sort({ last_name: 1 }),
    Genre.find().sort({ name: 1 }),
  ]);

  if (book === null) {
    const err = new Error("Book not found");
    err.status = 404;
    return next(err);
  }

  allGenres.forEach((genre) => {
    if (book.genre.includes(genre._id)) genre.checked = "true";
  });

  res.render("book/form", {
    title: "Update Book",
    authors: allAuthors,
    genres: allGenres,
    book: book,
  });
});

export const book_update_post = [
  (req, res, next) => {
    if (!Array.isArray(req.body.genre)) {
      req.body.genre =
        typeof req.body.genre === "undefined" ? [] : [req.body.genre];
    }
    next();
  },

  body("title", "Title must not be empty.").trim().notEmpty().escape(),
  body("author", "Author must not be empty.").trim().notEmpty().escape(),
  body("summary", "Summary must not be empty.").trim().notEmpty().escape(),
  body("isbn", "ISBN must not be empty").trim().notEmpty().escape(),
  body("genre.*").escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const book = new Book({
      _id: req.params.id,
      title: req.body.title,
      author: req.body.author,
      summary: req.body.summary,
      isbn: req.body.isbn,
      genre: typeof req.body.genre === "undefined" ? [] : req.body.genre,
    });

    if (!errors.isEmpty()) {
      const [allAuthors, allGenres] = await Promise.all([
        Author.find().sort({ last_name: 1 }),
        Genre.find().sort({ name: 1 }),
      ]);

      for (const genre of allGenres) {
        if (book.genre.indexOf(genre._id) > -1) {
          genre.checked = "true";
        }
      }
      res.render("book/form", {
        title: "Update Book",
        authors: allAuthors,
        genres: allGenres,
        book: book,
        errors: errors.array(),
      });
      return;
    } else {
      const updatedBook = await Book.findByIdAndUpdate(req.params.id, book, {});
      res.redirect(updatedBook.url);
    }
  }),
];
