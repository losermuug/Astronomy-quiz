'use client'
import { useState } from 'react';
import { Trash2, RefreshCw, Database } from 'lucide-react';

export default function AdminPage() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  const clearLeaderboard = async () => {
    if (!confirm('Та бүх өгөгдлийг устгахдаа итгэлтэй байна уу?')) return;

    setLoading(true);
    try {
      const res = await fetch('/api/leaderboard', { method: 'DELETE' });
      const data = await res.json();
      setMessage('✅ ' + data.message);
      setLeaderboard([]);
    } catch (error) {
      setMessage('❌ Алдаа гарлаа');
    }
    setLoading(false);
  };

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/leaderboard');
      const data = await res.json();
      setLeaderboard(data);
      setMessage(`✅ ${data.length} бичлэг олдлоо`);
    } catch (error) {
      setMessage('❌ Алдаа гарлаа');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl">
          <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            <Database className="inline-block w-10 h-10 mr-3" />
            Admin панел
          </h1>

          <div className="flex gap-4 mb-8">
            <button
              onClick={loadLeaderboard}
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              Leaderboard харах
            </button>

            <button
              onClick={clearLeaderboard}
              disabled={loading}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Trash2 className="w-5 h-5" />
              Бүгдийг устгах
            </button>
          </div>

          {message && (
            <div className={`p-4 rounded-lg mb-6 ${
              message.includes('✅') 
                ? 'bg-green-500/20 text-green-300 border border-green-500/50' 
                : 'bg-red-500/20 text-red-300 border border-red-500/50'
            }`}>
              {message}
            </div>
          )}

          {leaderboard.length > 0 && (
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-4">
                Одоогийн Leaderboard ({leaderboard.length})
              </h2>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {leaderboard.map((entry, index) => (
                  <div
                    key={index}
                    className="bg-white/5 p-4 rounded-lg flex items-center justify-between border border-white/10 hover:bg-white/10 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-bold text-yellow-400 min-w-[40px]">
                        #{index + 1}
                      </span>
                      <div>
                        <p className="text-white font-semibold text-lg">
                          {entry.name}
                        </p>
                        <p className="text-blue-300 text-sm">
                          {entry.correctAnswers}/{entry.totalAnswered} зөв
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-400">
                        {entry.score}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {new Date(entry.date).toLocaleDateString('mn-MN')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

