const express = require("express");
const router = express.Router();
const quizController = require("../controllers/quizController");


router.post("/add", quizController.addQuiz);

router.get("/", quizController.getAllQuizzes);

router.get("/:id", quizController.getQuizById);

module.exports = router;
