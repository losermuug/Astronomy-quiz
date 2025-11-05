'use client'

import { useState, useEffect } from 'react';

export default function Home() {
  const [question, setQuestion] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [showNext, setShowNext] = useState(false);
  const [loading, setLoading] = useState(true);
  const [spinning, setSpinning] = useState(false);
  const [askedQuestions, setAskedQuestions] = useState(new Set());

  useEffect(() => {
    fetchQuestion();
  }, []);

  const fetchQuestion = async () => {
    setLoading(true);
    setSpinning(true);
    setQuestion(null);
    setFeedback('');
    setShowNext(false);

    setTimeout(async () => {
      try {
        const excludeParam = Array.from(askedQuestions).join(',');
        const res = await fetch(`/api/question${excludeParam ? `?exclude=${excludeParam}` : ''}`);
        const data = await res.json();
        setQuestion(data);
        setAskedQuestions(prev => new Set([...prev, data.id]));
        setSpinning(false);
      } catch (error) {
        console.error('Error fetching question:', error);
        setSpinning(false);
      }
      setLoading(false);
    }, 2000);
  };

  const handleAnswer = (selectedOption) => {
    if (!question) return;
    const isCorrect = selectedOption === question.correct;
    setFeedback(isCorrect ? 'Зөв!' : `Буруу! Зөв хариулт: ${question.correct}`);
    setShowNext(true);
  };

  return (
    <div className="container">
      <h1>🌠 Одон орон 🌠</h1>
      {loading ? (
        <div className="loading">
          {spinning && <div className="spinner"></div>}
          {'Асуулт ачааллаж байна...'}
        </div>
      ) : question ? (
        <div className="question-container">
          <div className="question">{question.question}</div>
          <div className="options">
            {question.options && Object.entries(question.options).map(([key, value]) => (
              <button
                key={key}
                className="option"
                onClick={() => handleAnswer(key)}
                disabled={showNext}
              >
                {key}: {value}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="error">Асуулт ачааллахад алдаа гарлаа.</div>
      )}
      {feedback && <div className={`feedback ${feedback.startsWith('Зөв') ? 'correct' : 'incorrect'}`}>{feedback}</div>}
      {showNext && <button className="next-btn" onClick={fetchQuestion}>Дараагийн асуулт 🌌</button>}
    </div>
  );
}
