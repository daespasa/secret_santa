import express from "express";

const router = express.Router();

router.get("/credits", (req, res) => {
  res.render("credits");
});

router.get("/privacy", (req, res) => {
  res.render("privacy");
});

export default router;
