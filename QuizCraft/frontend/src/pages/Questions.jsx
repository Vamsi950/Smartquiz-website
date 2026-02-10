import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Questions.css";
import { toast } from 'react-toastify';

const Questions = () => {
  const { courseName, topicId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const user = JSON.parse(localStorage.getItem("user"));

  const [timeLeft, setTimeLeft] = useState(180); // Timer in seconds

  useEffect(() => {
    if (timeLeft <= 0) {
      toast.error("Time's up! Practise Well.");
      navigate(`/courses/${courseName}`);
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, navigate, courseName]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/courses/questions/${courseName}/${topicId}`
        );
        if (!response.ok) throw new Error("Local failed");
        const data = await response.json();
        setQuestions(data);
      } catch (error) {
        console.warn("Local fetch failed, trying production...", error);
        try {
          const response = await fetch(
            `https://quiz-app-dq18.onrender.com/api/courses/questions/${courseName}/${topicId}`
          );
          if (!response.ok) throw new Error("Failed to fetch questions");
          const data = await response.json();
          setQuestions(data);
        } catch (prodErr) {
          console.error("Error fetching questions:", prodErr);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [courseName, topicId]);

  const handleOptionChange = (questionId, selectedOption) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: selectedOption,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.keys(answers).length !== questions.length) {
      toast.error("Please answer all questions before submitting.");
      return;
    }

    let score = 0;
    const submittedAnswers = [];

    questions.forEach((q, index) => {
      const selectedAnswer = answers[index] || "";
      const isCorrect = selectedAnswer === q.answer;
      if (isCorrect) score++;

      submittedAnswers.push({
        questionId: q._id,
        question: q.question,
        selectedAnswer,
        correctAnswer: q.answer,
        isCorrect,
      });
    });

    try {
      const token = localStorage.getItem("token");
      let response = await fetch("http://localhost:5000/api/result/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: user.id,
          username: user.name,
          courseName,
          topicId,
          score,
          totalQuestions: questions.length,
        }),
      });

      if (!response.ok) {
        // Try production if local fails
        response = await fetch("https://quiz-app-dq18.onrender.com/api/result/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId: user.id,
            username: user.name,
            courseName,
            topicId,
            score,
            totalQuestions: questions.length,
          }),
        });
      }

      if (!response.ok) throw new Error("Failed to save quiz results");

      navigate("/result", {
        state: {
          score,
          total: questions.length,
          questions,
          answers,
        },
      });
    } catch (error) {
      console.error("Error saving quiz results:", error);
      toast.error("Failed to save results.");
    }
  };

  if (loading)
    return (
      <div className="questions-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <h2 style={{ color: "#94a3b8", fontFamily: 'Outfit, sans-serif' }}>Preparing your quiz...</h2>
      </div>
    );

  return (
    <div className="questions-container">
      <div className="sticky-timer-card">
        <span>🕒</span>
        <span>Time Left: {formatTime(timeLeft)}</span>
      </div>

      <div className="questions-box">
        <h1 className="questions-title">{courseName} Practice</h1>

        <form onSubmit={handleSubmit}>
          {questions.map((q, index) => (
            <div key={index} className="question-block">
              <p className="question-text">
                <span className="q-number">{index + 1}.</span>
                {q.question}
              </p>

              <div className="options-container">
                {q.options.map((opt, idx) => {
                  const isSelected = answers[index] === opt;
                  const labelLetter = String.fromCharCode(65 + idx);
                  return (
                    <label
                      key={idx}
                      className={`option-label ${isSelected ? "selected" : ""}`}
                    >
                      <input
                        type="radio"
                        name={`question-${index}`}
                        value={opt}
                        checked={isSelected}
                        onChange={() => handleOptionChange(index, opt)}
                        required
                      />
                      <span style={{ fontWeight: '800', marginRight: '8px' }}>{labelLetter}.</span>
                      {opt}
                    </label>
                  );
                })}
              </div>
            </div>
          ))}

          <div style={{ textAlign: "center", marginTop: "40px" }}>
            <button type="submit" className="submit-button">
              Complete Quiz
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Questions;
