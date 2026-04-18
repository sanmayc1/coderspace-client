import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Trophy, Network } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { IGetUserContestsResponse } from '@/types/response.types';
import { useNavigate } from 'react-router-dom';
import { joinContestUser } from '@/api/user/user.contest';
import { toastifyOptionsCenter } from '@/utils/toastify.options';
import { toast } from 'react-toastify';

interface ContestDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  contest: IGetUserContestsResponse | null;
}

const ContestDetailsModal: React.FC<ContestDetailsModalProps> = ({ isOpen, onClose, contest }) => {
  if (!isOpen || !contest) return null;

  const calculateTimeLeft = () => {
    const difference = +new Date(contest.dateAndTime) - +new Date();
    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return null;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleJoinNow = async () => {
    try {
      setLoading(true);
      const res = await joinContestUser(contest.id);
      if (res.success) {
        navigate(`/contest/${contest?.id}`);
      }
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      toast.error(
        error?.response?.data?.message || 'Failed to join contest',
        toastifyOptionsCenter
      );
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [contest]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div
        className="bg-white rounded-3xl shadow-xl w-full max-w-md md:max-w-lg lg:max-w-xl overflow-hidden relative animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-500 hover:text-black transition-colors"
        >
          <X size={24} />
        </button>

        {/* Content Container */}
        <div className="p-8">
          {/* Title */}
          <h2 className="text-2xl md:text-2xl font-bold mb-6 pr-8">
            {contest.title
              .split(' ')
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ')}
          </h2>

          {/* Info Row */}
          <div className="flex flex-col gap-3 mb-8 text-sm md:text-base text-gray-600">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5" />
              <span>
                {new Date(contest.dateAndTime).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  timeZoneName: 'short',
                })}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5" />
              <span>{contest.duration} minutes</span>
            </div>

            <div className="flex items-center gap-3">
              <Network className="w-5 h-5" />
              <span>
                {contest.domain
                  ? contest.domain.charAt(0).toUpperCase() + contest.domain.slice(1)
                  : 'Unknown Domain'}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{contest.description}</p>
          </div>

          {/* Topics/Skills */}
          {contest.skills && contest.skills.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Topics</h3>
              <div className="flex flex-wrap gap-2">
                {contest.skills.map((skill) => (
                  <span
                    key={skill.id}
                    className="px-4 py-1.5 rounded-full border border-gray-300 text-sm font-medium text-gray-700 hover:border-black hover:bg-gray-50 transition-colors cursor-default"
                  >
                    {skill.title}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Rewards */}
          {contest.rewards && contest.rewards.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-3">Rewards</h3>
              <div className="space-y-2">
                {contest.rewards.map((reward, index) => (
                  <div key={index} className="flex items-start gap-3 text-sm text-gray-600">
                    <Trophy className="w-4 h-4 mt-0.5 text-black" />
                    <span>
                      <span className="font-medium text-black">{reward.rank}: </span>
                      {reward.description}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Button */}
          {timeLeft ? (
            <div className="w-full bg-black text-white rounded-lg py-4 flex items-center justify-center gap-8 md:gap-12">
              <div className="flex flex-col items-center">
                <span className="text-2xl md:text-3xl font-bold">{timeLeft.days}</span>
                <span className="text-xs md:text-sm font-light text-gray-300">Days</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-2xl md:text-3xl font-bold">{timeLeft.hours}</span>
                <span className="text-xs md:text-sm font-light text-gray-300">Hours</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-2xl md:text-3xl font-bold">{timeLeft.minutes}</span>
                <span className="text-xs md:text-sm font-light text-gray-300">Minutes</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-2xl md:text-3xl font-bold">{timeLeft.seconds}</span>
                <span className="text-xs md:text-sm font-light text-gray-300">Seconds</span>
              </div>
            </div>
          ) : (
            <Button
              className="w-full bg-black text-white hover:bg-gray-800 text-lg py-6 rounded-lg font-bold transition-all"
              onClick={handleJoinNow}
              disabled={loading}
            >
              {loading ? 'Joining...' : 'Join Now'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContestDetailsModal;
