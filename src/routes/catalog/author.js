import express from "express";

const router = express.Router();

router.get("/", function (req, res, next) {
  res.send("Authors");
});

router.get("/:id", function (req, res, next) {
  res.send(`Author ${req.params.id}`);
});

export default router;
