'use client'
import { useState, useEffect } from 'react';
import { Sparkles, Loader2, ArrowRight, Trophy, User } from 'lucide-react';

interface QuestionOption {
  A: string;
  B: string;
  C: string;
  D: string;
}

interface Question {
  id: number;
  question: string;
  options: QuestionOption;
  correct: string;
}

interface MousePosition {
  x: number;
  y: number;
}

interface TrailPoint extends MousePosition {
  id: number;
}

interface LeaderboardEntry {
  name: string;
  score: number;
  correctAnswers: number;
  totalAnswered: number;
  date: string;
}

export default function Home() {
  const [question, setQuestion] = useState<Question | null>(null);
  const [feedback, setFeedback] = useState<string>('');
  const [showNext, setShowNext] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [spinning, setSpinning] = useState<boolean>(false);
  const [askedQuestions, setAskedQuestions] = useState<Set<number>>(new Set());
  const [mousePos, setMousePos] = useState<MousePosition>({ x: 0, y: 0 });
  const [trail, setTrail] = useState<TrailPoint[]>([]);
  const [playerName, setPlayerName] = useState<string>('');
  const [showNameInput, setShowNameInput] = useState<boolean>(true);
  const [score, setScore] = useState<number>(0);
  const [correctAnswers, setCorrectAnswers] = useState<number>(0);
  const [totalAnswered, setTotalAnswered] = useState<number>(0);
  const [showLeaderboard, setShowLeaderboard] = useState<boolean>(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);
  const MAX_QUESTIONS = 10;

  useEffect(() => {
    // Check if user already has a name saved
    const savedName = localStorage.getItem('playerName');
    if (savedName) {
      setPlayerName(savedName);
      setShowNameInput(false);
      fetchQuestion();
    } else {
      setLoading(false);
    }

    // Load leaderboard
    loadLeaderboard();

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      
      // Add trail point
      const newPoint: TrailPoint = { x: e.clientX, y: e.clientY, id: Date.now() };
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
    // Check if quiz is completed
    if (totalAnswered >= MAX_QUESTIONS) {
      setQuizCompleted(true);
      finishQuiz();
      return;
    }

    setLoading(true);
    setSpinning(true);
    setQuestion(null);
    setFeedback('');
    setShowNext(false);

    setTimeout(async () => {
      try {
        const excludeParam = Array.from(askedQuestions).join(',');
        const res = await fetch(`/api/question${excludeParam ? `?exclude=${excludeParam}` : ''}`);
        const data: Question = await res.json();
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

  const handleAnswer = (selectedOption: string) => {
    if (!question) return;
    const isCorrect = selectedOption === question.correct;
    setFeedback(isCorrect ? 'Зөв!' : `Буруу! Зөв хариулт: ${question.correct}`);
    setShowNext(true);
    
    const newTotalAnswered = totalAnswered + 1;
    setTotalAnswered(newTotalAnswered);
    
    if (isCorrect) {
      const points = 10;
      setScore(prev => prev + points);
      setCorrectAnswers(prev => prev + 1);
    }

    // Auto finish if reached max questions
    if (newTotalAnswered >= MAX_QUESTIONS) {
      setQuizCompleted(true);
    }
  };

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim()) {
      localStorage.setItem('playerName', playerName.trim());
      setShowNameInput(false);
      fetchQuestion();
    }
  };

  const saveScore = async () => {
    try {
      const response = await fetch('/api/leaderboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: playerName,
          score: score,
          correctAnswers: correctAnswers,
          totalAnswered: totalAnswered,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setLeaderboard(data.leaderboard);
      }
    } catch (error) {
      console.error('Error saving score:', error);
    }
  };

  const loadLeaderboard = async () => {
    try {
      const response = await fetch('/api/leaderboard');
      if (response.ok) {
        const data = await response.json();
        setLeaderboard(data);
      }
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    }
  };

  const finishQuiz = async () => {
    await saveScore();
    await loadLeaderboard();
    setShowLeaderboard(true);
  };

  const restartQuiz = () => {
    setScore(0);
    setCorrectAnswers(0);
    setTotalAnswered(0);
    setAskedQuestions(new Set());
    setShowLeaderboard(false);
    setQuizCompleted(false);
    setFeedback('');
    setShowNext(false);
    fetchQuestion();
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

      {/* Name Input Modal */}
      {showNameInput && (
        <div className="modal-overlay">
          <div className="modal-content">
            <User className="w-16 h-16 mx-auto mb-4 user-icon" />
            <h2 className="modal-title">Нэрээ оруулна уу</h2>
            <form onSubmit={handleNameSubmit} className="name-form">
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Таны нэр..."
                className="name-input"
                autoFocus
                maxLength={20}
              />
              <button type="submit" className="submit-btn" disabled={!playerName.trim()}>
                Эхлэх
                <ArrowRight className="inline-block w-5 h-5 ml-2" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Leaderboard Modal */}
      {showLeaderboard && (
        <div className="modal-overlay">
          <div className="modal-content leaderboard-modal">
            <Trophy className="w-16 h-16 mx-auto mb-4 trophy-icon" />
            <h2 className="modal-title">Манлайлагчдын самбар</h2>
            
            <div className="score-summary">
              <p className="final-score">Таны оноо: <span>{score}</span></p>
              <p className="stats">Зөв хариулт: {correctAnswers}/{totalAnswered}</p>
            </div>

            <div className="leaderboard-list">
              {leaderboard.length > 0 ? (
                leaderboard.map((entry, index) => (
                  <div 
                    key={`${entry.name}-${entry.date}-${index}`}
                    className={`leaderboard-item ${entry.name === playerName && entry.score === score && Math.abs(new Date(entry.date).getTime() - Date.now()) < 10000 ? 'current-player' : ''}`}
                  >
                    <span className="rank">{index + 1}</span>
                    <div className="player-info-leaderboard">
                      <span className="player-name">{entry.name}</span>
                      <span className="player-stats">{entry.correctAnswers}/{entry.totalAnswered} зөв</span>
                    </div>
                    <span className="player-score">{entry.score}</span>
                  </div>
                ))
              ) : (
                <div className="no-data">Одоогоор оноо байхгүй байна</div>
              )}
            </div>

            <div className="modal-actions">
              <button onClick={restartQuiz} className="action-btn primary">
                Дахин эхлэх
              </button>
              <button onClick={() => setShowLeaderboard(false)} className="action-btn secondary">
                Үргэлжлүүлэх
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="container">
        <div className="header-bar">
          <div className="player-info">
            <User className="w-5 h-5 inline-block mr-2" />
            <span>{playerName}</span>
          </div>
          <div className="progress-display">
            <div className="progress-text">
              {totalAnswered}/{MAX_QUESTIONS} асуулт
            </div>
            <div className="progress-bar-container">
              <div 
                className="progress-bar-fill" 
                style={{ width: `${(totalAnswered / MAX_QUESTIONS) * 100}%` }}
              />
            </div>
          </div>
          <div className="score-display">
            <Sparkles className="w-5 h-5 inline-block mr-2" />
            <span>{score} оноо</span>
          </div>
          <button onClick={() => setShowLeaderboard(true)} className="leaderboard-btn">
            <Trophy className="w-5 h-5" />
          </button>
        </div>

        <h1 className="title">
          <Sparkles className="inline-block w-10 h-10 mr-3 title-icon-left" />
          Одон орон
          <Sparkles className="inline-block w-10 h-10 ml-3 title-icon-right" />
        </h1>

        {loading ? (
          <div className="card loading-card">
            {spinning && (
              <div className="spinner">
                <Loader2 className="w-20 h-20 animate-spin loader-icon" />
              </div>
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

        {showNext && !quizCompleted && (
          <div className="next-actions">
            <button onClick={fetchQuestion} className="next-btn">
              Дараагийн асуулт
              <ArrowRight className="inline-block w-6 h-6 ml-2 next-icon" />
            </button>
            <button onClick={finishQuiz} className="finish-btn">
              Дуусгах
              <Trophy className="inline-block w-5 h-5 ml-2" />
            </button>
          </div>
        )}

        {quizCompleted && (
          <div className="quiz-completed">
            <Trophy className="w-12 h-12 mx-auto mb-4 trophy-icon" />
            <h2 className="completed-title">Тест дууслаа!</h2>
            <p className="completed-text">Та {MAX_QUESTIONS} асуултад хариулж дууслаа</p>
            <button onClick={() => setShowLeaderboard(true)} className="view-results-btn">
              Үр дүнг харах
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
