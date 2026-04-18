import { CircleHelp, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import CustomPagination from '@/components/common/pagination';
import { createInterviewSession, getAllInterviews } from '@/api/user/user.interview';
import type { IInterviewDataUser } from '@/types/types';
import { toast } from 'react-toastify';
import { toastifyOptionsCenter } from '@/utils/toastify.options';
import { useAppSelector } from '@/app/hooks/redux-custom-hook';
import type { AxiosError } from 'axios';
import LoadingSpin from '@/components/common/LoadingSpin';
import InterviewFeedbackModal from '@/components/user/InterviewFeedbackModal';

const messages = ['Starting Interview...', 'Please wait...'];

const InterviewListing = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [interviews, setInterviews] = useState<IInterviewDataUser[]>([]);
  const [showFullDescription, setShowFullDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [index, setIndex] = useState(0);
  const auth = useAppSelector((s) => s.authReducer.auth);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState('');

  useEffect(() => {
    async function fetchInterviews() {
      try {
        const res = await getAllInterviews(currentPage);
        console.log(res.data.interviews);
        setInterviews(res.data.interviews);
        setTotalPages(res.data.totalPages);
        setCurrentPage(res.data.currentPage);
      } catch (error) {
        console.log(error);
        toast.error('Something went wrong', toastifyOptionsCenter);
      }
    }
    fetchInterviews();
  }, [currentPage]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 5000);

    return () => clearTimeout(timeout);
  }, [index]);

  const handleInterviewStart = async (id: string, duration: number, totalQuestions: number) => {
    if (!auth) {
      toast.error('Please login to start the interview', toastifyOptionsCenter);
      navigate('/access-login');
      return;
    }
    try {
      setLoading(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      const res = await createInterviewSession(id);
      setLoading(false);
      localStorage.setItem('interviewDuration', (duration * 60).toString());
      localStorage.setItem('questionNumber', '1');
      localStorage.setItem('totalQuestions', totalQuestions.toString());
      navigate(`/interview/${res.data.sessionId}`);
    } catch (error) {
      setLoading(false);
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data.message, toastifyOptionsCenter);
    }
  };

  const handleFeedback = (sessionId: string) => {
    setSelectedSessionId(sessionId);
    setIsFeedbackModalOpen(true);
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center flex-col gap-4 ">
        <LoadingSpin size={30} />
        <span className="text-lg font-medium tracking-wide animate-pulse">{messages[index]}</span>
      </div>
    );
  }

  return (
    <>
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
            {interviews.map((interview) => (
              <div
                key={interview.id}
                className="border border-gray-300 rounded-xl p-8 flex flex-col transition-shadow duration-300 hover:shadow-md"
              >
                <h3 className="text-xl font-bold mb-4 tracking-tight">{interview.title}</h3>
                <p className="text-sm text-gray-800 mb-8 leading-[1.8] flex-grow pr-4">
                  {interview.description.length > 300
                    ? interview.description.slice(0, 300)
                    : interview.description}

                  {showFullDescription === interview.id && interview.description.slice(300)}
                  {interview.description.length > 300 && (
                    <span
                      className="text-blue-600 cursor-pointer "
                      onClick={() =>
                        setShowFullDescription(
                          interview.id === showFullDescription ? '' : interview.id
                        )
                      }
                    >
                      {showFullDescription === interview.id ? 'Read Less' : 'Read More'}
                    </span>
                  )}
                </p>

                <div className="flex flex-col gap-4 mb-8">
                  <div className="flex items-center text-sm text-gray-800 font-medium tracking-wide">
                    <CircleHelp size={20} className="mr-3 text-gray-600" />
                    {interview.numberOfQuestions} Questions
                  </div>
                  <div className="flex items-center text-sm text-gray-800 font-medium tracking-wide">
                    <Clock size={20} className="mr-3 text-gray-600" />
                    {interview.duration} Minutes
                  </div>
                </div>

                {!interview.isAttempted && (
                  <button
                    onClick={() =>
                      handleInterviewStart(
                        interview.id,
                        interview.duration,
                        interview.numberOfQuestions
                      )
                    }
                    className="w-full py-3.5 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors text-sm"
                    disabled={loading}
                  >
                    Start interview
                  </button>
                )}
                {interview.isAttempted && (
                  <button
                    disabled={loading}
                    onClick={() => handleFeedback(interview.sessionId)}
                    className="w-full py-3.5 bg-black text-white rounded-lg font-medium flex items-center justify-center"
                  >
                    View Feedback
                  </button>
                )}
              </div>
            ))}
          </div>

          <CustomPagination
            className="mt-10"
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>
      {selectedSessionId && (
        <InterviewFeedbackModal
          isOpen={isFeedbackModalOpen}
          onClose={() => setIsFeedbackModalOpen(false)}
          sessionId={selectedSessionId}
        />
      )}
    </>
  );
};

export default InterviewListing;
