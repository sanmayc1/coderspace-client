import React from 'react';
import { Button } from '@/components/ui/Button';
import { MapPin, Calendar} from 'lucide-react';

const CodersDetails: React.FC = () => {
  // Static data matching the image
  const user = {
    name: 'Bill Gates',
    username: '@bill_gates',
    level: 52,
    problemsSolved: 889,
    following: 120,
    followers: '1.5k',
    about:
      'Full-stack developer passionate about algorithms and system design. Always eager to learn and share knowledge with the coding community.',
    location: 'Kerala, India',
    memberSince: 'May 21, 2021',
  };

  return (
    <main className="flex-grow pt-32 pb-16 px-4 md:px-10 lg:px-32 max-w-8xl mx-auto w-full ">
      {/* Profile Header Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Avatar */}
          <div className="relative">
            <div className="w-40 h-40 rounded-full bg-[#FF4757] flex items-end justify-center overflow-hidden border-4 border-white shadow-sm">
              {/* Simple Avatar Placeholder matching the red style */}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="w-32 h-32 text-[#1E272E]"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="#1E272E"
                />
                <circle
                  cx="12"
                  cy="7"
                  r="4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="#1E272E"
                />
              </svg>
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900 mb-1">{user.name}</h1>
              <p className="text-lg text-gray-500 font-medium">{user.username}</p>
            </div>

            <div className="flex gap-3">
              <Button className="rounded-full border-gray-300  px-4 py-2  flex items-center gap-2">
                Following
              </Button>
              <Button
                variant="outline"
                className="rounded-full border-gray-300 text-gray-700 px-6 py-2 hover:bg-gray-50"
              >
                Message
              </Button>
            </div>
          </div>
        </div>

        <div className="h-1/2 flex justify-center gap-12 sm:gap-16 items-center">
          <div className="flex flex-col items-center">
            <p className="text-xl font-bold select-none">900</p>
            <p className="select-none font-semibold text-gray-700 opacity-75">Problems Solved</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-xl font-bold select-none">500</p>
            <p className="select-none font-semibold text-gray-700 opacity-75">Following</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-xl font-bold select-none">1.5k</p>
            <p className="select-none font-semibold text-gray-700 opacity-75">Followers</p>
          </div>
        </div>

        {/* Level Badge */}
        <div className="flex flex-col items-center gap-2 mt-4 md:mt-0">
          <img src="/gold.png" alt="Gold Badge" className="w-20 h-24 object-contain" />
          <p className="font-bold text-lg">Level {user.level}</p>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="md:col-span-2 flex flex-col gap-6">
          {/* About Card */}
          <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
            <h2 className="text-lg font-bold mb-4 text-gray-900">About</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">{user.about}</p>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 text-gray-500 text-xs font-semibold">
                <MapPin size={16} className="text-gray-900" />
                <span>{user.location}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-500 text-xs font-semibold">
                <Calendar size={16} className="text-gray-900" />
                <span>Member Since {user.memberSince}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="md:col-span-1">
          {/* Top Languages Card */}
          <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm h-full max-h-96">
            <h2 className="text-lg font-bold mb-8 text-gray-900">Top Languages</h2>
            <div className="flex flex-col items-center justify-center">
              {/* CSS Donut Chart */}
              <div className="relative w-40 h-40 mb-8">
                <svg viewBox="0 0 36 36" className="w-full h-full rotate-[-90deg]">
                  {/* Background Circle */}
                  <path
                    className="text-gray-500"
                    d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.8"
                    strokeDasharray="75, 100" // 75% filled
                  />
                  {/* Foreground Circle (Segment) */}
                  <path
                    className="text-gray-400"
                    d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.8"
                    strokeDasharray="25, 100" // 25% filled
                    strokeDashoffset="-75" // Offset to start after 75%
                  />
                  <path
                    className="text-white"
                    d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeDasharray="1, 24"
                  />
                </svg>
              </div>

              {/* Legend */}
              <div className="flex justify-center gap-8 w-full">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-gray-600"></span>
                  <span className="text-xs font-semibold text-gray-700">JavaScript</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-gray-400"></span>
                  <span className="text-xs font-semibold text-gray-700">Python</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CodersDetails;
