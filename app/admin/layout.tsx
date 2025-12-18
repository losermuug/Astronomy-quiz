'use client'
import { useState, useEffect } from 'react';
import { Lock, Shield } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [error, setError] = useState('');

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

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-4 shadow-lg shadow-purple-500/30">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Admin панел
            </h1>
            <p className="text-slate-400">
              Нэвтрэхийн тулд нууц үгээ оруулна уу
            </p>
          </div>

          {/* Login Form */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50 shadow-2xl">
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Нууц үг
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-slate-500" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="••••••••"
                    autoFocus
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                  <p className="text-sm text-red-300 text-center">{error}</p>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3.5 px-6 rounded-lg transition-all shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50"
              >
                Нэвтрэх
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-700/50">
              <p className="text-xs text-center text-slate-500">
                Анхдагч нууц үг:{' '}
                <code className="px-2 py-1 bg-slate-900/50 rounded text-purple-400 font-mono">
                  admin123
                </code>
              </p>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-slate-500 text-sm mt-6">
            🔒 Нууцлалтай холбогдсон
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

