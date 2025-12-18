'use client'
import { useState, useEffect } from 'react';
import { Trash2, Database, Users, Trophy, Calendar, ArrowLeft, Lock, Shield } from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [showData, setShowData] = useState(false);

  // Admin password - Энийг өөрчил!
  const ADMIN_PASSWORD = 'admin123';

  useEffect(() => {
    // Check if already authorized in session
    const authorized = sessionStorage.getItem('admin_authorized');
    if (authorized === 'true') {
      setIsAuthorized(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password === ADMIN_PASSWORD) {
      setIsAuthorized(true);
      sessionStorage.setItem('admin_authorized', 'true');
    } else {
      setError('Буруу нууц үг. Дахин оролдоно уу.');
      setPassword('');
    }
  };

  const clearLeaderboard = async () => {
    if (!confirm('⚠️ Та бүх leaderboard өгөгдлийг устгахдаа итгэлтэй байна уу?\n\nЭнэ үйлдлийг буцаах боломжгүй!')) return;

    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/leaderboard', { method: 'DELETE' });
      const data = await res.json();
      setMessage('success|' + data.message);
      setLeaderboard([]);
      setShowData(false);
    } catch (error) {
      setMessage('error|Алдаа гарлаа. Дахин оролдоно уу.');
    }
    setLoading(false);
  };

  const loadLeaderboard = async () => {
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/leaderboard');
      const data = await res.json();
      setLeaderboard(data);
      setShowData(true);
      if (data.length === 0) {
        setMessage('info|Одоогоор өгөгдөл байхгүй байна');
      } else {
        setMessage(`success|${data.length} тоглогчийн мэдээлэл амжилттай татагдлаа`);
      }
    } catch (error) {
      setMessage('error|Өгөгдөл татахад алдаа гарлаа');
    }
    setLoading(false);
  };

  const messageType = message.split('|')[0];
  const messageText = message.split('|')[1];

  // Login Screen
  if (!isAuthorized) {
    return (
      <div className="admin-login-container">
        <div className="admin-login-box">
          {/* Logo/Header */}
          <div className="admin-login-header">
            <div className="admin-logo">
              <Shield className="admin-logo-icon" />
            </div>
            <h1 className="admin-login-title">
              Admin панел
            </h1>
            <p className="admin-login-subtitle">
              Нэвтрэхийн тулд нууц үгээ оруулна уу
            </p>
          </div>

          {/* Login Form */}
          <div className="admin-login-form">
            <form onSubmit={handleLogin} className="admin-form">
              <div className="admin-form-group">
                <label className="admin-label">
                  Нууц үг
                </label>
                <div className="admin-input-wrapper">
                  <div className="admin-input-icon">
                    <Lock className="admin-icon" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="admin-input"
                    placeholder="••••••••"
                    autoFocus
                  />
                </div>
              </div>

              {error && (
                <div className="admin-error-message">
                  <p className="admin-error-text">{error}</p>
                </div>
              )}

              <button
                type="submit"
                className="admin-submit-btn"
              >
                Нэвтрэх
              </button>
            </form>

            <div className="admin-login-footer">
              <p className="admin-footer-text">
                Анхдагч нууц үг:{' '}
                <code className="admin-password-hint">
                  admin123
                </code>
              </p>
            </div>
          </div>

          {/* Footer */}
          <p className="admin-security-note">
            🔒 Нууцлалтай холбогдсон
          </p>
        </div>
      </div>
    );
  }

  // Admin Panel
  return (
    <div className="admin-panel-container">
      {/* Header */}
      <div className="admin-header">
        <div className="admin-header-content">
          <div className="admin-header-left">
            <div className="admin-header-icon">
              <Database className="admin-icon" />
            </div>
            <div>
              <h1 className="admin-header-title">Admin панел</h1>
              <p className="admin-header-subtitle">Leaderboard удирдлага</p>
            </div>
          </div>
          <Link 
            href="/"
            className="admin-back-btn"
          >
            <ArrowLeft className="admin-back-icon" />
            Буцах
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="admin-content">
        {/* Stats Cards */}
        <div className="admin-stats-grid">
          <div className="admin-stat-card admin-stat-card-blue">
            <div className="admin-stat-content">
              <div className="admin-stat-icon-wrapper admin-stat-icon-blue">
                <Users className="admin-stat-icon" />
              </div>
              <div>
                <p className="admin-stat-label">Нийт тоглогч</p>
                <p className="admin-stat-value">{leaderboard.length}</p>
              </div>
            </div>
          </div>

          <div className="admin-stat-card admin-stat-card-purple">
            <div className="admin-stat-content">
              <div className="admin-stat-icon-wrapper admin-stat-icon-purple">
                <Trophy className="admin-stat-icon" />
              </div>
              <div>
                <p className="admin-stat-label">Топ оноо</p>
                <p className="admin-stat-value">
                  {leaderboard[0]?.score || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="admin-stat-card admin-stat-card-green">
            <div className="admin-stat-content">
              <div className="admin-stat-icon-wrapper admin-stat-icon-green">
                <Database className="admin-stat-icon" />
              </div>
              <div>
                <p className="admin-stat-label">Database</p>
                <p className="admin-stat-value-small">Redis Cloud</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="admin-actions-card">
          <h2 className="admin-actions-title">Үйлдлүүд</h2>
          <div className="admin-actions-grid">
            <button
              onClick={loadLeaderboard}
              disabled={loading}
              className="admin-action-btn admin-action-btn-blue"
            >
              <div className="admin-action-btn-content">
                <Database className={`admin-action-icon ${loading ? 'admin-loading' : ''}`} />
                <span>Өгөгдөл татах</span>
              </div>
            </button>

            <button
              onClick={clearLeaderboard}
              disabled={loading || leaderboard.length === 0}
              className="admin-action-btn admin-action-btn-red"
            >
              <div className="admin-action-btn-content">
                <Trash2 className="admin-action-icon" />
                <span>Бүгдийг устгах</span>
              </div>
            </button>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`admin-message admin-message-${messageType}`}>
            <p className="admin-message-text">{messageText}</p>
          </div>
        )}

        {/* Leaderboard Table */}
        {showData && leaderboard.length > 0 && (
          <div className="admin-table-container">
            <div className="admin-table-header">
              <h2 className="admin-table-title">
                Leaderboard өгөгдөл
              </h2>
              <p className="admin-table-subtitle">
                Нийт {leaderboard.length} тоглогч
              </p>
            </div>
            
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead className="admin-table-thead">
                  <tr>
                    <th className="admin-table-th">Байр</th>
                    <th className="admin-table-th">Нэр</th>
                    <th className="admin-table-th">Зөв хариулт</th>
                    <th className="admin-table-th">Оноо</th>
                    <th className="admin-table-th">Огноо</th>
                  </tr>
                </thead>
                <tbody className="admin-table-tbody">
                  {leaderboard.map((entry, index) => (
                    <tr 
                      key={index}
                      className="admin-table-row"
                    >
                      <td className="admin-table-td">
                        <div className="admin-table-rank">
                          {index === 0 && <span className="admin-medal">🥇</span>}
                          {index === 1 && <span className="admin-medal">🥈</span>}
                          {index === 2 && <span className="admin-medal">🥉</span>}
                          <span className="admin-rank-number">
                            #{index + 1}
                          </span>
                        </div>
                      </td>
                      <td className="admin-table-td">
                        <p className="admin-player-name">
                          {entry.name}
                        </p>
                      </td>
                      <td className="admin-table-td">
                        <span className="admin-badge">
                          {entry.correctAnswers}/{entry.totalAnswered}
                        </span>
                      </td>
                      <td className="admin-table-td">
                        <span className="admin-score">
                          {entry.score}
                        </span>
                      </td>
                      <td className="admin-table-td">
                        <div className="admin-date">
                          <Calendar className="admin-date-icon" />
                          <span className="admin-date-text">
                            {new Date(entry.date).toLocaleString('mn-MN')}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {showData && leaderboard.length === 0 && (
          <div className="admin-empty-state">
            <Database className="admin-empty-icon" />
            <h3 className="admin-empty-title">
              Өгөгдөл байхгүй байна
            </h3>
            <p className="admin-empty-text">
              Одоогоор leaderboard дээр мэдээлэл алга байна
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

