import express from "express";

const router = express.Router();

router.get("/", function (req, res, next) {
  res.send("Book instances");
});

router.get("/:id", function (req, res, next) {
  res.send(`Book instance ${req.params.id}`);
});

router.post("/:id", function (req, res, next) {
  res.send(
    `Add book instance ${req.params.id} and body ${JSON.stringify(req.body)}`
  );
});

router.put("/:id", function (req, res, next) {
  res.send(`Update book instance ${req.params.id}`);
});

router.delete("/:id", function (req, res, next) {
  res.send(`Delete book instance ${req.params.id}`);
});

export default router;
