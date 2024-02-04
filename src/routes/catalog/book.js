import express from "express";

const router = express.Router();

router.get("/", function (req, res, next) {
  res.send("Books");
});

router.get("/:id", function (req, res, next) {
  res.send(`Book ${req.params.id}`);
});

router.post("/:id", function (req, res, next) {
  res.send(`Add book ${req.params.id} and body ${JSON.stringify(req.body)}`);
});

router.put("/:id", function (req, res, next) {
  res.send(`Update book ${req.params.id}`);
});

router.delete("/:id", function (req, res, next) {
  res.send(`Delete book ${req.params.id}`);
});

export default router;
