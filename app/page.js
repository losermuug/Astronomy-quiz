'use client'
import { useState, useEffect } from 'react';

export default function Home() {
  const [question, setQuestion] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [showNext, setShowNext] = useState(false);
  const [loading, setLoading] = useState(true);
  const [spinning, setSpinning] = useState(false);
  const [askedQuestions, setAskedQuestions] = useState(new Set());
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [trail, setTrail] = useState([]);

  useEffect(() => {
    fetchQuestion();

    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      
      // Add trail point
      const newPoint = { x: e.clientX, y: e.clientY, id: Date.now() };
      setTrail(prev => {
        const newTrail = [...prev, newPoint];
        return newTrail.slice(-10); // Keep last 10 points
      });
    };

    // Clear old trail points periodically
    const trailCleanup = setInterval(() => {
      setTrail(prev => {
        const now = Date.now();
        return prev.filter(point => now - point.id < 500); // Remove points older than 500ms
      });
    }, 100);

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(trailCleanup);
    };
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
    <div className="min-h-screen relative overflow-hidden">
      {/* Mouse cursor glow effect */}
      <div 
        className="cursor-glow"
        style={{
          left: `${mousePos.x}px`,
          top: `${mousePos.y}px`,
        }}
      />

      {/* Mouse trail */}
      {trail.map((point, index) => (
        <div
          key={point.id}
          className="trail-dot"
          style={{
            left: `${point.x}px`,
            top: `${point.y}px`,
            opacity: (index + 1) / trail.length,
            transform: `scale(${(index + 1) / trail.length})`,
          }}
        />
      ))}

      {/* Animated starfield background */}
      <div className="stars-layer-1"></div>
      <div className="stars-layer-2"></div>
      <div className="stars-layer-3"></div>
      
      {/* Shooting stars */}
      <div className="shooting-star" style={{top: '20%', left: '10%', animationDelay: '0s'}}></div>
      <div className="shooting-star" style={{top: '40%', left: '60%', animationDelay: '3s'}}></div>
      <div className="shooting-star" style={{top: '70%', left: '30%', animationDelay: '6s'}}></div>

      {/* Floating planets */}
      <div className="planet planet-1"></div>
      <div className="planet planet-2"></div>
      <div className="planet planet-3"></div>

      {/* Nebula effect */}
      <div className="nebula nebula-1"></div>
      <div className="nebula nebula-2"></div>

      {/* Main content */}
      <div className="container">
        <h1 className="title">
          🌠 Одон орон 🌠
        </h1>

        {loading ? (
          <div className="card loading-card">
            {spinning && (
              <div className="spinner">🌌</div>
            )}
            <div className="loading-text">Асуулт ачааллаж байна...</div>
          </div>
        ) : question ? (
          <div className="card question-card">
            <div className="question">
              {question.question}
            </div>

            {question.options && (
              <div className="options">
                {Object.entries(question.options).map(([key, value]) => (
                  <button
                    key={key}
                    onClick={() => handleAnswer(key)}
                    disabled={showNext}
                    className="option"
                  >
                    <span className="option-glow"></span>
                    <span className="option-content">
                      {key}: {value}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="card error-card">
            Асуулт ачааллахад алдаа гарлаа.
          </div>
        )}

        {feedback && (
          <div className={`feedback ${feedback === 'Зөв!' ? 'correct' : 'incorrect'}`}>
            {feedback}
          </div>
        )}

        {showNext && (
          <button onClick={fetchQuestion} className="next-btn">
            Дараагийн асуулт 🌌
          </button>
        )}
      </div>
    </div>
  );
}