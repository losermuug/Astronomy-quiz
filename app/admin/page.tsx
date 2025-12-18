'use client'
import { useState } from 'react';
import { Trash2, Database, Users, Trophy, Calendar, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [showData, setShowData] = useState(false);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-700/50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-2.5 rounded-lg">
              <Database className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Admin панел</h1>
              <p className="text-sm text-slate-400">Leaderboard удирдлага</p>
            </div>
          </div>
          <Link 
            href="/"
            className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 hover:bg-slate-700 text-white rounded-lg transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Буцах
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 backdrop-blur-sm border border-blue-500/20 rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-500/20 p-3 rounded-lg">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Нийт тоглогч</p>
                <p className="text-2xl font-bold text-white">{leaderboard.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="bg-purple-500/20 p-3 rounded-lg">
                <Trophy className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Топ оноо</p>
                <p className="text-2xl font-bold text-white">
                  {leaderboard[0]?.score || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 backdrop-blur-sm border border-green-500/20 rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="bg-green-500/20 p-3 rounded-lg">
                <Database className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Database</p>
                <p className="text-lg font-semibold text-white">Redis Cloud</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">Үйлдлүүд</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={loadLeaderboard}
              disabled={loading}
              className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-4 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="relative flex items-center justify-center gap-3">
                <Database className={`w-5 h-5 ${loading ? 'animate-pulse' : ''}`} />
                <span>Өгөгдөл татах</span>
              </div>
            </button>

            <button
              onClick={clearLeaderboard}
              disabled={loading || leaderboard.length === 0}
              className="group relative overflow-hidden bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium py-4 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="relative flex items-center justify-center gap-3">
                <Trash2 className="w-5 h-5" />
                <span>Бүгдийг устгах</span>
              </div>
            </button>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg border ${
            messageType === 'success' 
              ? 'bg-green-500/10 border-green-500/30 text-green-300' 
              : messageType === 'error'
              ? 'bg-red-500/10 border-red-500/30 text-red-300'
              : 'bg-blue-500/10 border-blue-500/30 text-blue-300'
          }`}>
            <p className="text-sm font-medium">{messageText}</p>
          </div>
        )}

        {/* Leaderboard Table */}
        {showData && leaderboard.length > 0 && (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-700/50">
              <h2 className="text-lg font-semibold text-white">
                Leaderboard өгөгдөл
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Нийт {leaderboard.length} тоглогч
              </p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-700/30">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Байр
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Нэр
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Зөв хариулт
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Оноо
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Огноо
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {leaderboard.map((entry, index) => (
                    <tr 
                      key={index}
                      className="hover:bg-slate-700/20 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {index === 0 && <span className="text-2xl">🥇</span>}
                          {index === 1 && <span className="text-2xl">🥈</span>}
                          {index === 2 && <span className="text-2xl">🥉</span>}
                          <span className="text-lg font-bold text-slate-300">
                            #{index + 1}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-base font-medium text-white">
                          {entry.name}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          {entry.correctAnswers}/{entry.totalAnswered}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-xl font-bold text-green-400">
                          {entry.score}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-slate-400">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm">
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
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-12 text-center">
            <Database className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-300 mb-2">
              Өгөгдөл байхгүй байна
            </h3>
            <p className="text-slate-500">
              Одоогоор leaderboard дээр мэдээлэл алга байна
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

