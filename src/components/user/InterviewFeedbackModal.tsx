import React, { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import Modal from '../common/Modal';
import { Button } from '../ui/button';
import { getInterviewFeedback } from '@/api/user/user.interview';
import LoadingSpin from '../common/LoadingSpin';

interface InterviewFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionId: string;
}

const InterviewFeedbackModal: React.FC<InterviewFeedbackModalProps> = ({
  isOpen,
  onClose,
  sessionId,
}) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getFeedback() {
      if (isOpen) {
        setLoading(true);
        const res = await getInterviewFeedback(sessionId);
        setRating(res.data.rating);
        setFeedback(res.data.feedback);
        setLoading(false);
      }
    }

    getFeedback();
  }, [isOpen, sessionId]);
  return (
    <Modal isOpen={isOpen} className="max-w-[650px] font-[anybody-regular] p-8 !rounded-[1.5rem]">
      <div className="flex flex-col gap-6 items-center text-center">
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-gray-900">Performance Feedback</h3>
          <p className="text-sm text-gray-500">
            Here is the evaluation of your interview performance.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-32">
            <LoadingSpin />
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center gap-4">
              <div className="flex gap-2 items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <div key={star}>
                    <Star
                      size={36}
                      className={`transition-colors duration-200 ${
                        rating >= star
                          ? 'fill-amber-400 text-amber-400'
                          : rating >= star - 0.5
                            ? 'fill-amber-400 text-amber-400 opacity-50'
                            : 'fill-transparent text-gray-200'
                      }`}
                    />
                  </div>
                ))}
              </div>
              <span className="text-3xl  font-semibold text-gray-800 ml-2">
                {rating} <span className="text-gray-400 text-lg">/ 5</span>
              </span>
            </div>

            <div className="w-full mt-2">
              <div className="w-full min-h-[120px] p-5 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-xl text-left overflow-y-auto max-h-[250px] leading-relaxed shadow-inner">
                {feedback ? (
                  <p>{feedback}</p>
                ) : (
                  <p className="text-gray-400 italic text-center mt-8">No feedback provided yet.</p>
                )}
              </div>
            </div>
          </>
        )}
        <div className="w-full mt-2">
          <Button
            className="w-full rounded-xl h-11 bg-black text-white hover:bg-gray-800"
            onClick={onClose}
          >
            Back to Interview Page
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default InterviewFeedbackModal;
