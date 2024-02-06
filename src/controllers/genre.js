import { Mongoose } from "mongoose";
import { Genre, Book } from "../models/index.js";
import asyncHandler from "express-async-handler";

export const genre_list = async (req, res, next) => {
  try {
    const genreList = await Genre.find({}, { name: true }).sort({
      name: 1,
    });

    res.render("genres", { title: "Genre List", genreList });
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

  console.log(genre);
  if (genre === null) {
    // No results.
    const err = new Error("Genre not found");
    err.status = 404;
    return next(err);
  }

  res.render("genre-detail", {
    title: "Genre Detail",
    genre,
    bookList: books,
  });
});

export const genre_create_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Genre create GET");
});

export const genre_create_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Genre create POST");
});

export const genre_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Genre delete GET");
});

export const genre_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Genre delete POST");
});

export const genre_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Genre update GET");
});

export const genre_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Genre update POST");
});
