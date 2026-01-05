import { Button } from '@/components/ui/Button';
import CustomPagination from '@/components/common/Pagination';
import { useState } from 'react';
import { Clock, Users, Calendar } from 'lucide-react';

interface IContest {
  id: string;
  title: string;
  startTime: string;
  duration: string;
  participants: number;
}

const mockContests: IContest[] = Array.from({ length: 6 }).map((_, i) => ({
  id: i.toString(),
  title: 'DSA Challenge',
  startTime: 'Feb 15, 2024 14:00 UTC',
  duration: '30 minutes',
  participants: 1000,
}));

const ContestsListing: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Upcoming');
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5;

  return (
    <div className="min-h-screen font-['anybody-regular'] bg-white">
      {/* Hero Section */}
      <div className="bg-black text-white py-20 px-20 min-h-screen  flex items-center ">
        <div className=" ">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Learn by Competing.
            <br />
            Grow by Winning.
          </h1>
          <p className="text-gray-300 text-lg md:text-xl  mb-10">
            Participate in carefully curated coding challenges that progressively improve your
            problem-solving abilities, strengthen logical thinking, and build real confidence
            through hands-on practice. Showcase your skills, track your growth, and stand out as a
            capable developer in interviews, competitions, and real-world projects.
          </p>
          <Button
            className="bg-white text-black hover:bg-gray-200 text-lg px-8 py-6 rounded-md font-bold"
            onClick={() => window.scrollTo({ top: 750, behavior: 'smooth' })}
          >
            Explore
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-44">
        {/* Title */}
        <h2 className="text-4xl font-bold text-center mb-12">Contests</h2>

        {/* Tabs */}
        <div className="flex gap-8 mb-12 border-b border-gray-200">
          {['Upcoming', 'LeaderBoard', 'Registered', 'Contest Result'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-lg font-medium transition-colors relative ${
                activeTab === tab
                  ? 'text-black border-b-2 border-black -mb-[2px]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {mockContests.map((contest) => (
            <div
              key={contest.id}
              className="border border-gray-300 rounded-xl p-6 flex flex-col justify-between hover:shadow-lg transition-shadow bg-white h-72" // Fixed height for consistency
            >
              <div>
                <h3 className="text-xl font-bold mb-6">{contest.title}</h3>

                <div className="flex flex-col gap-3 mb-6">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar size={16} />
                    <span className="text-xs">{contest.startTime}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock size={16} />
                    <span className="text-xs">{contest.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users size={16} />
                    <span className="text-xs">{contest.participants} participants</span>
                  </div>
                </div>
              </div>

              <Button className="w-full bg-black text-white hover:bg-gray-800 py-6 rounded-lg text-sm font-semibold">
                Register Now
              </Button>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center">
          <CustomPagination
            totalPages={totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            className="w-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default ContestsListing;
