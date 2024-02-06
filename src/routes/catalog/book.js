import express from "express";
import {
  book_detail,
  book_list,
  book_create_get,
  book_create_post,
  book_delete_get,
  book_delete_post,
  book_update_get,
  book_update_post,
} from "../../controllers/book.js";

const router = express.Router();

// GET request for creating a Book. NOTE This must come before routes that display Book (uses id).
router.get("/create", book_create_get);

// POST request for creating Book.
router.post("/create", book_create_post);

// GET request to delete Book.
router.get("/:id/delete", book_delete_get);

// POST request to delete Book.
router.post("/:id/delete", book_delete_post);

// GET request to update Book.
router.get("/:id/update", book_update_get);

// POST request to update Book.
router.post("/:id/update", book_update_post);

// GET request for one Book.
router.get("/:id", book_detail);

// GET request for list of all Book items.
router.get("/", book_list);

export default router;
