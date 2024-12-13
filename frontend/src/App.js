import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import QuizPage from "./component/QuizPage";
import AddQuizPage from "./component/AddQuizPage";


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<QuizPage />} />
        <Route path="/add-quiz" element={<AddQuizPage />} />
      </Routes>
    </Router>
  );
};

export default App;
