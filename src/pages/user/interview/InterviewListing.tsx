import { ChevronsDown, CircleHelp, Clock, Lock, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';

const mockInterviews = [
  {
    id: 1,
    title: 'Mern Stack Mock Interview',
    description:
      'Sharpen your skills and get interview-ready with our MERN Stack mock interview sessions. These interviews focus on verbal and theoretical questions related to MongoDB, Express.js, React.js, and Node.js – with no live coding rounds.',
    questions: 10,
    time: 30,
    status: 'start',
  },
  {
    id: 2,
    title: 'Google Mock Interview',
    description:
      'Sharpen your skills and get interview-ready with our MERN Stack mock interview sessions. These interviews focus on verbal and theoretical questions related to MongoDB, Express.js, React.js, and Node.js – with no live coding rounds.',
    questions: 10,
    time: 30,
    status: 'locked',
  },
  {
    id: 3,
    title: 'Mern Stack Mock Interview',
    description:
      'Sharpen your skills and get interview-ready with our MERN Stack mock interview sessions. These interviews focus on verbal and theoretical questions related to MongoDB, Express.js, React.js, and Node.js – with no live coding rounds.',
    questions: 10,
    time: 30,
    status: 'feedback',
  },
];

const InterviewListing = () => {
    const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white font-[Inter,sans-serif] text-black pb-28">
      {/* Hero Section */}
      <div className="bg-black text-white py-20 px-20 min-h-screen  flex items-center ">
        <div className=" ">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Mock Interview
            <br />
            Practice
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

      {/* Main Content */}
      <div className="max-w-[70rem] mx-auto px-6 md:px-8 py-20">
        <h2 className="text-[32px] font-bold text-center mb-16 tracking-wide">Interviews</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {mockInterviews.map((interview) => (
            <div
              key={interview.id}
              className="border border-gray-300 rounded-xl p-8 flex flex-col transition-shadow duration-300 hover:shadow-md"
            >
              <h3 className="text-xl font-bold mb-4 tracking-tight">{interview.title}</h3>
              <p className="text-sm text-gray-800 mb-8 leading-[1.8] flex-grow pr-4">
                {interview.description}
              </p>

              <div className="flex flex-col gap-4 mb-8">
                <div className="flex items-center text-sm text-gray-800 font-medium tracking-wide">
                  <CircleHelp size={20} className="mr-3 text-gray-600" />
                  {interview.questions} Questions
                </div>
                <div className="flex items-center text-sm text-gray-800 font-medium tracking-wide">
                  <Clock size={20} className="mr-3 text-gray-600" />
                  {interview.time} Minutes
                </div>
              </div>

              {interview.status === 'start' && (
                <button onClick={() => navigate(`/interview/${interview.id}`)} className="w-full py-3.5 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors text-sm">
                  Start interview
                </button>
              )}
              {interview.status === 'locked' && (
                <button className="w-full py-3.5 bg-black text-white rounded-lg font-medium flex items-center justify-center cursor-not-allowed">
                  <Lock size={20} className="text-yellow-500" />
                </button>
              )}
              {interview.status === 'feedback' && (
                <button className="w-full py-3.5 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors text-sm">
                  View Feedback
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Pagination offset logic styling based on picture */}
        <div className="flex justify-center items-center mt-20 gap-2">
          <button className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-md text-gray-500 hover:bg-gray-50 transition-colors">
            <ChevronLeft size={18} />
          </button>

          {[1, 2, 3, 4, 5].map((page) => (
            <button
              key={page}
              className={`w-10 h-10 flex items-center justify-center rounded-md font-medium text-sm transition-colors ${
                page === 1
                  ? 'bg-black text-white'
                  : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}

          <button className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-md text-gray-500 hover:bg-gray-50 transition-colors">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterviewListing;
