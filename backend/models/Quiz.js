const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  questionText: String,
  choices: [String],
  correctAnswer: String,
});

const quizSchema = new mongoose.Schema({
  title: String,
  description: String,
  timeLimit: Number, 
  questions: [questionSchema],
});

const Quiz = mongoose.model("Quiz", quizSchema);

module.exports = Quiz;
