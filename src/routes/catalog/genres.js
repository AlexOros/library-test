import express from "express";

const router = express.Router();

router.get("/", function (req, res, next) {
  res.send("Genres");
});

router.get("/:id", function (req, res, next) {
  res.send(`Genre ${req.params.id}`);
});

export default router;
