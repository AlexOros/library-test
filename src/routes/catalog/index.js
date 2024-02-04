import { Router } from "express";
const router = Router();

router.get("/", function (req, res, next) {
  res.send('"Welcome to the library catalog!"');
});

export default router;
