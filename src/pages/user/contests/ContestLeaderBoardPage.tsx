import React, { useEffect, useState } from 'react';
import { Trophy, Clock, Target, Hash, Search, Filter, Crown, Medal } from 'lucide-react';
import { getContestLeaderboard } from '@/api/user/user.contest';
import { useParams } from 'react-router-dom';
import type { IContestLeaderboardResponse } from '@/types/response.types';

const ContestLeaderBoardPage: React.FC = () => {
  const [leaderboardData, setLeaderboardData] = useState<IContestLeaderboardResponse[]>([]);
  const { id } = useParams();

  useEffect(() => {
    window.scrollTo(0, 0);
    async function fetchContestLeaderboard() {
      try {
        if (!id) return;
        const res = await getContestLeaderboard(id);
        if (Array.isArray(res)) {
          setLeaderboardData(res);
        } else {
          setLeaderboardData([]);
        }
      } catch (error) {
        console.error('Failed to fetch leaderboard', error);
      }
    }
    fetchContestLeaderboard();
  }, [id]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getBadgeColor = (badge: string | null) => {
    if (!badge) return 'bg-gray-50 text-gray-500 border-gray-100';
    switch (badge.toLowerCase()) {
      case 'platinum':
        return 'bg-cyan-100 text-cyan-700 border-cyan-200';
      case 'gold':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'silver':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'bronze':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      default:
        return 'bg-gray-50 text-gray-500 border-gray-100';
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-6 h-6 text-yellow-500 fill-yellow-500/20" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400 fill-gray-400/20" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-amber-700 fill-amber-700/20" />;
    return <span className="font-mono font-bold text-gray-500">#{rank}</span>;
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 md:p-12 font-sans">
      <div className="max-w-7xl mx-auto space-y-8 mt-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Leaderboard</h1>
            <p className="text-gray-500 mt-1 flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Top performers from the contest
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search user..."
                className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 w-64 transition-all"
              />
            </div>
            <button className="p-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Leaderboard Table Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-4 text-center w-24">Rank</th>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4 text-center">Badge</th>
                  <th className="px-6 py-4 text-center">Solved</th>
                  <th className="px-6 py-4 text-center">Time Taken</th>
                  <th className="px-6 py-4 text-center">Submissions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {leaderboardData.length > 0 ? (
                  leaderboardData.map((entry, index) => {
                    const rank = index + 1;
                    return (
                      <tr
                        key={entry.userId}
                        className={`group hover:bg-gray-50/80 transition-colors ${
                          rank <= 3
                            ? 'bg-gradient-to-r from-transparent via-transparent to-yellow-50/10'
                            : ''
                        }`}
                      >
                        {/* Rank */}
                        <td className="px-6 py-4">
                          <div className="flex justify-center items-center">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                rank <= 3 ? 'bg-white shadow-sm ring-1 ring-gray-100' : ''
                              }`}
                            >
                              {getRankIcon(rank)}
                            </div>
                          </div>
                        </td>

                        {/* User Profile */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <img
                              src={entry.profileUrl || '/default-avatar.png'}
                              alt={entry.username}
                              className="w-10 h-10 rounded-full bg-gray-100 object-cover ring-2 ring-white shadow-sm"
                            />
                            <div className="flex flex-col">
                              <span className="font-semibold text-gray-900 group-hover:text-black transition-colors">
                                {entry.username}
                              </span>
                              <span className="text-xs text-gray-400">
                                @{entry.username.toLowerCase()}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Badge */}
                        <td className="px-6 py-4">
                          <div className="flex justify-center">
                            {entry.badge ? (
                              <span
                                className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getBadgeColor(
                                  entry.badge
                                )}`}
                              >
                                {entry.badge}
                              </span>
                            ) : (
                              <span className="text-gray-400 text-xs">-</span>
                            )}
                          </div>
                        </td>

                        {/* Solved Problems */}
                        <td className="px-6 py-4">
                          <div className="flex flex-col items-center gap-1.5">
                            <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                              <Target className="w-4 h-4 text-emerald-500" />
                              <span>
                                <span className="text-emerald-600 font-bold">
                                  {entry.solvedProblems}/{entry.totalProblems}
                                </span>
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Time Taken */}
                        <td className="px-6 py-4">
                          <div className="flex justify-center">
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100/50 border border-transparent group-hover:border-gray-200 group-hover:bg-white transition-all">
                              <Clock className="w-3.5 h-3.5 text-gray-400" />
                              <span className="font-mono text-sm text-gray-600">
                                {formatTime(entry.timeTaken)}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Submissions */}
                        <td className="px-6 py-4">
                          <div className="flex justify-center">
                            <div className="flex items-center gap-1.5 text-gray-500">
                              <Hash className="w-3.5 h-3.5" />
                              <span className="text-sm font-medium">{entry.totalSubmissions}</span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      No one won this contest yet!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContestLeaderBoardPage;
