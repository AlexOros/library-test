import express from "express";
import {
  genre_list,
  genre_detail,
  genre_create_get,
  genre_create_post,
  genre_delete_get,
  genre_delete_post,
} from "../../controllers/genre.js";

const router = express.Router();

router.get("/create", genre_create_get);

router.post("/create", genre_create_post);

router.get("/:id/delete", genre_delete_get);

router.post("/:id/delete", genre_delete_post);

router.get("/:id", genre_detail);

router.get("/", genre_list);

export default router;
