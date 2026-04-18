import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import type { ILeaderboard } from '@/types/response.types';
import Table, { type TableColumn } from '@/components/common/table';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { getContestLeaderboard } from '@/api/common/common.api';

interface ILeaderboardWithRank extends ILeaderboard {
  rank: number;
}

const LeaderboardWithRank: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [leaderboardData, setLeaderboardData] = useState<ILeaderboardWithRank[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch((prev) => {
        if (prev !== search) {
          setCurrentPage(1);
          return search;
        }
        return prev;
      });
    }, 500);

    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const res = await getContestLeaderboard(id, currentPage, debouncedSearch);

        const dataWithRank = res.leaderboard.map((item, index) => ({
          ...item,
          rank: (currentPage - 1) * 10 + index + 1,
        }));

        setLeaderboardData(dataWithRank);
        setTotalPages(res.totalPages);
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
        setLeaderboardData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [id, currentPage, debouncedSearch]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const columns: TableColumn<ILeaderboardWithRank>[] = [
    {
      key: 'rank',
      label: 'Rank',
      className: 'w-16 text-center',
      render: (rank) => <span className="font-bold text-gray-700">#{rank}</span>,
    },
    {
      key: 'username',
      label: 'User',
      render: (_, item) => (
        <div className="flex items-center gap-3">
          <img
            src={item.profileUrl || '/defaultProfile.jpg'}
            alt={item.username}
            className="w-8 h-8 rounded-full object-cover bg-gray-100"
          />
          <div className="flex flex-col">
            <span className="font-medium text-gray-900">{item.username}</span>
            <span className="text-xs text-gray-500">{item.name}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'badge',
      label: 'Badge',
      className: 'text-center',
      render: (badge) => (
        <div className="flex justify-center">
          {badge ? (
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium border
                        ${
                          badge === 'Platinum'
                            ? 'bg-cyan-100 text-cyan-700 border-cyan-200'
                            : badge === 'Gold'
                              ? 'bg-yellow-100 text-yellow-700 border-yellow-200'
                              : badge === 'Silver'
                                ? 'bg-gray-100 text-gray-700 border-gray-200'
                                : badge === 'Bronze'
                                  ? 'bg-orange-100 text-orange-700 border-orange-200'
                                  : 'bg-gray-100 text-gray-500 border-gray-200'
                        }`}
            >
              {badge}
            </span>
          ) : (
            <span className="text-gray-400">-</span>
          )}
        </div>
      ),
    },
    {
      key: 'solvedProblems',
      label: 'Solved',
      className: 'text-center',
      render: (_, item) => (
        <div className="text-center font-medium">
          <span className="text-emerald-600">{item.solvedProblems}</span>
          <span className="text-gray-400">/</span>
          <span className="text-gray-600">{item.totalProblems}</span>
        </div>
      ),
    },
    {
      key: 'score',
      label: 'Score',
      className: 'text-center',
      render: (score) => <div className="text-center font-bold text-gray-900">{score}</div>,
    },
    {
      key: 'timeTaken',
      label: 'Time Taken',
      className: 'text-center',
      render: (time) => (
        <div className="text-center font-mono text-sm text-gray-600">{formatTime(time)}</div>
      ),
    },
    {
      key: 'userId',
      label: '',
      render: () => {
        return (
          <>
            <Button size={'sm'} onClick={() => alert('feature not implimented')}>
              Contact
            </Button>
          </>
        );
      },
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contest Leaderboard</h1>
          <p className="text-gray-500 text-sm mt-1">
            View rankings and performance details for{' '}
            {leaderboardData[0]?.contestName || 'this contest'}
          </p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search participants..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
          />
        </div>
      </div>

      <Table
        data={leaderboardData}
        columns={columns}
        loading={loading}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        className="w-full"
      />
    </div>
  );
};

export default LeaderboardWithRank;
