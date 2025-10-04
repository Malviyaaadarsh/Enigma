import React, { useEffect, useState } from "react";
import { db } from "../Firebase/Firebase";
import { doc, getDoc } from "firebase/firestore";

const QuizComponent = ({ quizId, user }) => {
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const fetchQuiz = async () => {
      const qDoc = await getDoc(doc(db, "quizzes", quizId));
      if (qDoc.exists()) setQuiz(qDoc.data());
    };
    fetchQuiz();
  }, [quizId]);

  const handleAnswer = (qIndex, option) => setAnswers(prev => ({ ...prev, [qIndex]: option }));

  const handleSubmit = () => {
    if (!quiz) return;
    let s = 0;
    quiz.questions.forEach((q, idx) => { if (answers[idx] === q.correctAnswer) s++; });
    setScore(s);
    setSubmitted(true);
  };

  if (!quiz) return <p>Loading quiz...</p>;

  return (
    <div className="quiz-section">
      {quiz.questions.map((q, idx) => (
        <div key={idx} className="quiz-question">
          <p>{q.question}</p>
          {q.options.map(opt => (
            <label key={opt}>
              <input type="radio" name={`q${idx}`} onChange={() => handleAnswer(idx, opt)} disabled={submitted} /> {opt}
            </label>
          ))}
        </div>
      ))}
      {!submitted ? <button onClick={handleSubmit}>Submit Quiz</button> : <p>Your Score: {score}/{quiz.questions.length}</p>}
    </div>
  );
};

export default QuizComponent;
