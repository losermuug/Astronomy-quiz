import { NextRequest, NextResponse } from 'next/server';
import redis from '@/lib/redis';

interface LeaderboardEntry {
  name: string;
  score: number;
  correctAnswers: number;
  totalAnswered: number;
  date: string;
}

// GET - Leaderboard авах
export async function GET() {
  try {
    // Get all leaderboard entries from Redis
    const data = await redis.get('leaderboard');
    const leaderboard: LeaderboardEntry[] = data ? JSON.parse(data) : [];
    
    // Sort by score (highest first)
    const sortedLeaderboard = leaderboard
      .sort((a, b) => b.score - a.score)
      .slice(0, 50); // Top 50

    return NextResponse.json(sortedLeaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json({ error: 'Leaderboard татахад алдаа гарлаа' }, { status: 500 });
  }
}

// POST - Шинэ оноо нэмэх
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, score, correctAnswers, totalAnswered } = body;

    if (!name || score === undefined) {
      return NextResponse.json({ error: 'Нэр болон оноо шаардлагатай' }, { status: 400 });
    }

    // Get current leaderboard
    const data = await redis.get('leaderboard');
    const leaderboard: LeaderboardEntry[] = data ? JSON.parse(data) : [];

    // Add new entry
    const newEntry: LeaderboardEntry = {
      name: name.trim(),
      score: Number(score),
      correctAnswers: Number(correctAnswers) || 0,
      totalAnswered: Number(totalAnswered) || 0,
      date: new Date().toISOString(),
    };

    leaderboard.push(newEntry);

    // Sort and keep top 50
    const sortedLeaderboard = leaderboard
      .sort((a, b) => b.score - a.score)
      .slice(0, 50);

    // Save back to Redis
    await redis.set('leaderboard', JSON.stringify(sortedLeaderboard));

    return NextResponse.json({ 
      success: true, 
      entry: newEntry,
      leaderboard: sortedLeaderboard 
    });
  } catch (error) {
    console.error('Error saving to leaderboard:', error);
    return NextResponse.json({ error: 'Оноо хадгалахад алдаа гарлаа' }, { status: 500 });
  }
}

// DELETE - Leaderboard цэвэрлэх (admin only - optional)
export async function DELETE() {
  try {
    await redis.del('leaderboard');
    return NextResponse.json({ success: true, message: 'Leaderboard цэвэрлэгдсэн' });
  } catch (error) {
    console.error('Error clearing leaderboard:', error);
    return NextResponse.json({ error: 'Алдаа гарлаа' }, { status: 500 });
  }
}

