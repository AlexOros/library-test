import express from "express";
import {
  author_list,
  author_detail,
  author_create_get,
  author_create_post,
  author_delete_get,
  author_delete_post,
  author_update_get,
  author_update_post,
} from "../../controllers/author.js";

const router = express.Router();

// GET request for creating Author. NOTE This must come before route for id (i.e. display author).
router.get("/create", author_create_get);

// POST request for creating Author.
router.post("/create", author_create_post);

// GET request to delete Author.
router.get("/:id/delete", author_delete_get);

// POST request to delete Author.
router.post("/:id/delete", author_delete_post);

// GET request to update Author.
router.get("/:id/update", author_update_get);

// POST request to update Author.
router.post("/:id/update", author_update_post);

// GET request for one Author.
router.get("/:id", author_detail);

// GET request for list of all Authors.
router.get("/", author_list);

export default router;
