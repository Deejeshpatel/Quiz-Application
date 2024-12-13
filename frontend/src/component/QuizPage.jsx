import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL } from "./api";
import "./QuizPage.css";

const QuizPage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [results, setResults] = useState(null);
  const navigate = useNavigate();

  // Fetch all quizzes
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/quizzes`);
        setQuizzes(response.data);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      }
    };
    fetchQuizzes();
  }, []);

  // Select a quiz
  const handleSelectQuiz = async (quizId) => {
    try {
      const response = await axios.get(`${API_URL}/api/quizzes/${quizId}`);
      setSelectedQuiz(response.data);
      setAnswers(Array(response.data.questions.length).fill(null));
      setTimeLeft(response.data.timeLimit * 60); // Convert minutes to seconds
      setResults(null);
    } catch (error) {
      console.error("Error fetching quiz:", error);
    }
  };

  // Timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && selectedQuiz) {
      handleSubmit();
    }
  }, [timeLeft, selectedQuiz]);

  // Handle answer change
  const handleAnswerChange = (choice) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex] = choice;
    setAnswers(updatedAnswers);
  };

  // Submit quiz
  const handleSubmit = () => {
    const correctAnswers = selectedQuiz.questions.map((q) => q.correctAnswer);
    const result = answers.map((answer, index) => ({
      question: selectedQuiz.questions[index].questionText,
      correctAnswer: correctAnswers[index],
      userAnswer: answer,
      isCorrect: answer === correctAnswers[index],
    }));
    setResults(result);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < selectedQuiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmit();
    }
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`; // Add leading zero for seconds
  };

  const handleStartNewQuiz = () => {
    setSelectedQuiz(null);
    setAnswers([]);
    setCurrentQuestionIndex(0);
    setTimeLeft(0);
    setResults(null);
  };

  const handleAddQuiz = () => navigate("/add-quiz");

  if (!selectedQuiz) {
    return (
      <div className="quiz-app">
        <header className="header">
          <h1>Quizzer..</h1>
          <button className="add-quiz-button" onClick={handleAddQuiz}>
            Add Quiz
          </button>
        </header>

        <main className="quiz-selection">
       
          <p className="ft-2">Select a quiz to start.</p>
          <div className="quiz-grid">
            {quizzes.map((quiz) => (
              <div className="quiz-card" key={quiz._id}>
                <h3>{quiz.title}</h3>
                <p>{quiz.description}</p>
                <p>Time Limit: {quiz.timeLimit} mins</p>
                <p>Questions: {quiz.questions.length}</p>
                <button onClick={() => handleSelectQuiz(quiz._id)}>
                  Start Quiz
                </button>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (results) {
    return (
      <div className="results-page">
        <h2>Quiz Results</h2>
        <div className="results-list">
          {results.map((result, index) => (
            <div className="result-item" key={index}>
              <p>Question: {result.question}</p>
              <p>Your Answer: {result.userAnswer || "No Answer"}</p>
              <p>Correct Answer: {result.correctAnswer}</p>
              <p>
                {result.isCorrect ? <span className="correct">✅ Correct</span> : <span className="incorrect">❌ Incorrect</span>}
              </p>
            </div>
          ))}
        </div>
        <p>Total Correct: {results.filter((r) => r.isCorrect).length} / {results.length}</p>
        <button onClick={handleStartNewQuiz}>Start New Quiz</button>
      </div>
    );
  }

  const currentQuestion = selectedQuiz.questions[currentQuestionIndex];
  return (
    <div className="quiz-container">
      <h2>{selectedQuiz.title}</h2>
      <p className="timer">Time Left: {formatTime(timeLeft)}</p>
      <p className="question-number">Question {currentQuestionIndex + 1}</p>
      <p className="question-text">{currentQuestion.questionText}</p>
      <div className="choices">
        {currentQuestion.choices.map((choice, index) => (
          <label key={index} className="choice-item">
            <input
              type="radio"
              name={`question-${currentQuestionIndex}`}
              value={choice}
              checked={answers[currentQuestionIndex] === choice}
              onChange={() => handleAnswerChange(choice)}
            />
            {choice}
          </label>
        ))}
      </div>
      <button onClick={handleNextQuestion} className="next-button">
        {currentQuestionIndex === selectedQuiz.questions.length - 1 ? "Submit Quiz" : "Next Question"}
      </button>
    </div>
  );
};

export default QuizPage;
