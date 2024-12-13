import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { API_URL } from "./api";
import "./AddQuizPage.css";

const AddQuizPage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [timeLimit, setTimeLimit] = useState("");
  const [questions, setQuestions] = useState([
    { questionText: "", choices: ["", "", "", ""], correctAnswer: "" },
  ]);

  const navigate = useNavigate();

  const handleChangeQuestion = (index, key, value) => {
    const newQuestions = [...questions];
    newQuestions[index][key] = value;
    setQuestions(newQuestions);
  };

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { questionText: "", choices: ["", "", "", ""], correctAnswer: "" },
    ]);
  };

  const handleRemoveQuestion = (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
  };

  const handleSubmitQuiz = async () => {
    try {
      await axios.post(`${API_URL}/api/quizzes/add`, {
        title,
        description,
        timeLimit,
        questions,
      });
      alert("Quiz added successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error adding quiz", error);
    }
  };

  return (
    <div className="add-quiz-page">
      <header className="header">
        <h1>
          <Link to="/" className="header-link">
            Quiz App
          </Link>
        </h1>
        <nav>
          <Link to="/" className="nav-link">
          Quizzer..
          </Link>
        </nav>
      </header>
      <main className="main-content">
        <h2>Add New Quiz</h2>
        <form className="quiz-form">
          <label className="form-label">
            Quiz Title
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="form-input"
            />
          </label>
          <label className="form-label">
            Description
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="form-textarea"
            ></textarea>
          </label>
          <label className="form-label">
            Time Limit (minutes)
            <input
              type="number"
              value={timeLimit}
              onChange={(e) => setTimeLimit(Number(e.target.value))}
              required
              className="form-input"
            />
          </label>
          <h3>Questions</h3>
          {questions.map((question, index) => (
            <div key={index} className="question-container">
              <p>
              <label className="form-label label-1">
                Question {index + 1}
                <input
                  type="text"
                  value={question.questionText}
                  onChange={(e) =>
                    handleChangeQuestion(index, "questionText", e.target.value)
                  }
                  required
                  className="form-input"
                />
              </label>
              </p>
              {question.choices.map((choice, i) => (
                <label key={i} className="form-label ms-3">
                  Choice {i + 1}
                  <input
                    type="text"
                    value={choice}
                    onChange={(e) =>
                      handleChangeQuestion(index, "choices", [
                        ...question.choices.slice(0, i),
                        e.target.value,
                        ...question.choices.slice(i + 1),
                      ])
                    }
                    required
                    className="form-input"
                  />
                </label>
              ))}
              <label className="form-label">
                Correct Answer
                <input
                  type="text"
                  value={question.correctAnswer}
                  onChange={(e) =>
                    handleChangeQuestion(index, "correctAnswer", e.target.value)
                  }
                  required
                  className="form-input"
                />
              </label>
              <button
                type="button"
                onClick={() => handleRemoveQuestion(index)}
                className="remove-button"
              >
                Remove Question
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddQuestion}
            className="add-button"
          >
            Add Question
          </button>
          <button
            type="button"
            onClick={handleSubmitQuiz}
            className="submit-button"
          >
            Submit Quiz
          </button>
        </form>
      </main>
    </div>
  );
};

export default AddQuizPage;
