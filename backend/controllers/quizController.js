const Quiz = require("../models/Quiz");

exports.addQuiz = async (req, res) => {
  try {
    const { title, description, timeLimit, questions } = req.body;
    const newQuiz = new Quiz({ title, description, timeLimit, questions });
    await newQuiz.save();
    res.status(201).send("Quiz added successfully.");
  } catch (error) {
    res.status(500).json({ message: "Error adding quiz.", error });
  }
};

exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.status(200).json(quizzes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching quizzes.", error });
  }
};

exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).send("Quiz not found.");
    }
    res.status(200).json(quiz);
  } catch (error) {
    res.status(500).json({ message: "Error fetching quiz.", error });
  }
};
