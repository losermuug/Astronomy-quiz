'use client'
import { useState, useEffect } from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);

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
    if (password === ADMIN_PASSWORD) {
      setIsAuthorized(true);
      sessionStorage.setItem('admin_authorized', 'true');
    } else {
      alert('❌ Буруу нууц үг!');
    }
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl max-w-md w-full">
          <h1 className="text-3xl font-bold text-white text-center mb-6">
            🔒 Admin Нэвтрэх
          </h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-white mb-2">Нууц үг:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Нууц үгээ оруулна уу"
                autoFocus
              />
            </div>
            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-all"
            >
              Нэвтрэх
            </button>
            <p className="text-gray-400 text-sm text-center mt-4">
              Анхдагч нууц үг: <code className="text-purple-300">admin123</code>
            </p>
          </form>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

