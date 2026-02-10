import { useLocation, useNavigate } from "react-router-dom";
import "./Result.css";

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { score, total, questions, answers } = location.state || {};

  if (!questions || !answers) {
    return (
      <div className="result-container">
        <div className="result-box" style={{ textAlign: 'center' }}>
          <h2 style={{ marginBottom: '20px' }}>Invalid Access</h2>
          <button className="back-button" onClick={() => navigate("/")}>Go Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="result-container">
      <div className="result-box">
        <h1 className="result-title">Quiz Summary</h1>
        <h2 className="result-score">
          You scored {score} out of {total}
        </h2>

        <div className="review-section">
          <h3 className="review-subtitle">Review your answers</h3>
          {questions.map((q, index) => {
            const userAnswer = answers[index];
            const answer = q.answer;
            const isCorrect = userAnswer === answer;

            return (
              <div key={index} className="review-question">
                <p className="review-question-text">
                  <span style={{ color: isCorrect ? '#4ecdc4' : '#ff6b6b', marginRight: '8px' }}>
                    {isCorrect ? '✓' : '✗'}
                  </span>
                  {index + 1}. {q.question}
                </p>

                <div className={`review-answer ${isCorrect ? "correct" : "wrong"}`}>
                  Your Answer: {userAnswer || "Not answered"}
                </div>
                {!isCorrect && (
                  <span className="review-correct-answer">
                    Correct Answer: <strong style={{ color: '#4ecdc4' }}>{answer}</strong>
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <div style={{ textAlign: "center", marginTop: "40px" }}>
          <button onClick={() => navigate("/courses")} className="back-button">
            Try Another Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default Result;
