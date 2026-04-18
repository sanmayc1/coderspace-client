import { Button } from '@/components/ui/button';
import CustomPagination from '@/components/common/pagination';
import { useEffect, useState } from 'react';
import { Clock, Calendar, Network, Trophy } from 'lucide-react';
import { getAllPastContests, getAllUpcomingAndOngoingContests } from '@/api/user/user.contest';
import type { IGetUserContestsResponse } from '@/types/response.types';
import ContestDetailsModal from './ContestDetailsModal';
import { useNavigate } from 'react-router-dom';

const ContestsListing: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Upcoming & Ongoing');
  const [contests, setContests] = useState<IGetUserContestsResponse[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedContest, setSelectedContest] = useState<IGetUserContestsResponse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  const handleViewMore = (contest: IGetUserContestsResponse) => {
    if (activeTab === 'Upcoming & Ongoing') {
      setSelectedContest(contest);
      setIsModalOpen(true);
    } else {
      navigate(`/contest/${contest.id}/leaderboard`);
    }
  };

  useEffect(() => {
    async function fetchAllUpcomingAndOngoingContests() {
      try {
        if (activeTab === 'Upcoming & Ongoing') {
          const response = await getAllUpcomingAndOngoingContests(currentPage);
          setContests(response.contests);
          setTotalPages(response.totalPages);
          setCurrentPage(response.currentPage);
        } else if (activeTab === 'Past Contests') {
          const response = await getAllPastContests(currentPage);
          setContests(response.contests);
          setTotalPages(response.totalPages);
          setCurrentPage(response.currentPage);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchAllUpcomingAndOngoingContests();
  }, [currentPage, activeTab]);

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
          {['Upcoming & Ongoing', 'Past Contests'].map((tab) => (
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
          {contests.map((contest) => (
            <div
              key={contest.id}
              className="border border-gray-300 rounded-xl p-6 flex flex-col justify-between hover:shadow-lg transition-shadow bg-white h-64"
            >
              <div>
                <h3 className="text-xl font-bold mb-6">
                  {contest.title
                    .split(' ')
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ')}
                </h3>

                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar size={16} />
                    <span className="text-xs">{contest.dateAndTime.split('GMT')[0]}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock size={16} />
                    <span className="text-xs">{contest.duration} Minutes</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Network size={16} />
                    <span className="text-xs">
                      {contest.domain.charAt(0).toUpperCase() + contest.domain.slice(1)}{' '}
                    </span>
                  </div>
                </div>
              </div>

              <Button
                className="w-full bg-black text-white hover:bg-gray-800 py-6 rounded-lg text-sm font-semibold"
                onClick={() => handleViewMore(contest)}
              >
                {activeTab === 'Upcoming & Ongoing' ? (
                  'View More'
                ) : (
                  <>
                    <Trophy /> Leaderboard
                  </>
                )}
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
      <ContestDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        contest={selectedContest}
      />
    </div>
  );
};

export default ContestsListing;
