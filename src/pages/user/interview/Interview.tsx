import { finishInterview, getInterviewQuestion, submitAnswer } from '@/api/user/user.interview';
import Modal from '@/components/common/modal';
import { Button } from '@/components/ui/button';
import Avatar from '@/components/user/InterviewCharacter';
import Loader from '@/components/user/InterviewConnectingLoader';
import type { IGetInterviewQuestionResponse } from '@/types/response.types';
import { toastifyOptionsCenter } from '@/utils/toastify.options';
import { Canvas } from '@react-three/fiber';
import { Mic, PhoneOff, Square, Repeat, MessageCircleQuestionMark } from 'lucide-react';
import { Suspense, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as THREE from 'three';
import useSpeechRecorder from './RecorderAndTranscript';
import LoadingSpin from '@/components/common/LoadingSpin';
import InterviewFeedbackModal from '@/components/user/InterviewFeedbackModal';

const Interview = () => {
  const [question, setQuestion] = useState<IGetInterviewQuestionResponse | null>(null);
  const [interviewDuration, setInterviewDuration] = useState(0);
  const [questionNumber, setQuestionNumber] = useState(1);
  const { isRecording, startRecording, stopRecording } = useSpeechRecorder();
  const jawRef = useRef<THREE.Bone | null>(null);
  const headRef = useRef<THREE.Bone | null>(null);
  const isTalkingRef = useRef<boolean>(false);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array<ArrayBuffer> | null>(null);
  // const [startRecording, setStartRecording] = useState(false);
  const [isTimeOutModalOpen, setIsTimeOutModalOpen] = useState(false);
  const [isOpenShowQuestionModal, setIsOpenShowQuestionModal] = useState(false);
  const [isOpenStartModal, setIsOpenStartModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showNextQuestion, setShowNextQuestion] = useState(false);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isEndInterviewModalOpen, setIsEndInterviewModalOpen] = useState(false);
  const hasShownStartModal = useRef(false);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const duration = Number(localStorage.getItem('interviewDuration'));
    const questionNum = Number(localStorage.getItem('questionNumber'));
    const totalQuestions = Number(localStorage.getItem('totalQuestions'));

    if (totalQuestions) {
      setTotalQuestions(totalQuestions);
    }

    if (questionNum && questionNum > 1) {
      setQuestionNumber(questionNum);
    }

    setInterviewDuration(duration);
    const interval = setInterval(() => {
      setInterviewDuration((prev) => prev - 1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (interviewDuration > 0) {
      localStorage.setItem('interviewDuration', interviewDuration.toString());
    } else if (interviewDuration < 0) {
      setIsTimeOutModalOpen(true);
    }
  }, [interviewDuration]);

  useEffect(() => {
    async function fetchQuestions() {
      try {
        setIsLoading(true);
        const res = await getInterviewQuestion(params.id as string, questionNumber);

        setQuestion(res.data);
        if (questionNumber > 1) {
          setShowNextQuestion(true);
        }
        if (questionNumber === 1 && !hasShownStartModal.current) {
          setIsOpenStartModal(true);
          hasShownStartModal.current = true;
        }
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        toast.error('Something went Wrong', toastifyOptionsCenter);
      }
    }
    fetchQuestions();
  }, [questionNumber]);

  useEffect(() => {
    if (questionNumber > 1) {
      localStorage.setItem('questionNumber', questionNumber.toString());
    }
  }, [questionNumber]);

  const playVoice = async () => {
    if (isTalkingRef.current || !question) return;

    if (isRecording) {
      await stopRecording(); // ✅ stop mic before playing
    }
    const audioSrc = `data:audio/wav;base64,${question?.audio}`;
    const audio = new Audio(audioSrc);

    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();

    const source = audioContext.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(audioContext.destination);

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    analyserRef.current = analyser;
    dataArrayRef.current = dataArray;

    audio.play();
    isTalkingRef.current = true;

    audio.onended = () => {
      isTalkingRef.current = false;
    };
  };

  const handleStartInterview = () => {
    setIsOpenStartModal(false);
    playVoice();
  };

  const handleStop = async () => {
    const finalText = await stopRecording();

    await submitAnswer(params.id as string, questionNumber, finalText);

    if (questionNumber < totalQuestions) {
      setQuestionNumber(questionNumber + 1);
    } else {
      setIsLoading(true);
      await finishInterview(params.id as string);

      setIsLoading(false);
      setIsFeedbackModalOpen(true);
    }
  };

  const handleNextQuestion = () => {
    setShowNextQuestion(false);
    playVoice();
  };

  const handleEndInterview = async () => {
    await finishInterview(params.id as string);
    setIsFeedbackModalOpen(true);
  };

  const handleTimeOut = () => {
    setIsTimeOutModalOpen(false);
    setIsFeedbackModalOpen(true);
  };

  return (
    <>
      <div
        className="min-h-screen w-full bg-cover bg-center bg-no-repeat relative flex flex-col items-center justify-between font-[Inter,sans-serif]"
        style={{ backgroundImage: `url('/interview-bg.png')` }}
      >
        <div className="flex-grow w-full h-screen flex justify-center items-center ">
          <Canvas
            camera={{
              position: [9, 1, 6],
              fov: 7,
            }}
            className="w-full   h-screen"
          >
            <ambientLight intensity={1.5} />
            <directionalLight position={[5, 5, 5]} intensity={2} />
            <Suspense fallback={<Loader />}>
              <Avatar
                isTalkingRef={isTalkingRef}
                jawRef={jawRef}
                headRef={headRef}
                analyserRef={analyserRef}
                dataArrayRef={dataArrayRef}
              />
            </Suspense>
          </Canvas>
        </div>

        <div className="absolute z-50 right-20 top-3 rounded-full bg-black max-w-80 min-w-10 py-2 px-4 flex gap-6 items-center justify-center">
          <button
            onClick={() => playVoice()}
            className=" text-white cursor-pointer hover:text-gray-600 transition-colors flex flex-col items-center gap-1"
          >
            <Repeat size={16} fill="currentColor" strokeWidth={1} />
            <span className="text-white text-xs hover:text-gray-600 transition-colors">
              Repeat Question
            </span>
          </button>
          <button
            className=" text-white cursor-pointer hover:text-gray-600 transition-colors flex flex-col items-center gap-1"
            onClick={() => setIsOpenShowQuestionModal(true)}
          >
            <MessageCircleQuestionMark size={16} fill="black" strokeWidth={2} />
            <span className="text-white text-xs hover:text-gray-600 transition-colors">
              Show Question
            </span>
          </button>
        </div>

        <div className="mb-5 w-full max-w-[750px] px-4 absolute bottom-0 z-50">
          <div className="bg-black backdrop-blur-md rounded-[3rem] px-8 py-2 flex items-center justify-between shadow-2xl border border-gray-500/30">
            {interviewDuration > 0 ? (
              <div className="flex items-center gap-3 flex-1">
                <span className="text-gray-200 text-sm font-medium tracking-wide">Time Left</span>
                <span className="text-white font-bold tracking-widest text-lg">
                  {Math.floor(interviewDuration / 60)} : {interviewDuration % 60}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-3 flex-1">
                <span className="text-gray-200 text-sm font-medium tracking-wide">Time Left</span>
                <span className="text-white font-bold tracking-widest text-lg">00 : 00</span>
              </div>
            )}

            <div className="flex-1 items-center gap-3 flex justify-center">
              {isRecording && !isLoading && !showNextQuestion && (
                <div className="p-1 bg-red-500 animate-pulse rounded-full">
                  <button
                    onClick={() => handleStop()}
                    className="w-12 h-12 bg-[#d1d1d1] rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-inner group"
                  >
                    <Square className="text-[#d92d20]" fill="red" size={24} />
                  </button>
                </div>
              )}

              {!isRecording && !isLoading && !showNextQuestion && (
                <button
                  onClick={() => startRecording()}
                  className="w-12 h-12 bg-[#d1d1d1] rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-inner group"
                >
                  <Mic className="text-[#d92d20]" size={24} />
                </button>
              )}

              {isLoading && (
                <div className="text-white flex items-center gap-2 animate-pulse">
                  <LoadingSpin />
                  <span className="text-white text-xs font-medium tracking-wide pt-1 ">
                    Please wait...
                  </span>
                </div>
              )}

              {showNextQuestion && !isLoading && (
                <button
                  onClick={handleNextQuestion}
                  className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center  hover:gray-600  transition-colors shadow-inner group"
                >
                  <span className="text-white text-xs font-medium tracking-wide pt-1">Next</span>
                </button>
              )}
            </div>

            <div className="flex-1 flex justify-end">
              <button
                onClick={() => setIsEndInterviewModalOpen(true)}
                className="bg-[#d92d20] hover:bg-red-700 text-white px-6 py-2.5 rounded-full flex items-center gap-2.5 font-medium transition-colors shadow-md"
              >
                <PhoneOff size={20} />
                End Interview
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={isOpenShowQuestionModal} onClose={() => setIsOpenShowQuestionModal(false)}>
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold text-center"> Question </h2>
          <p className="text-gray-600">{question?.question}</p>
        </div>
      </Modal>

      <Modal isOpen={isOpenStartModal} className="max-w-5xl ">
        <div className="flex flex-col gap-4 px-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h2 className="text-xl font-bold text-center pb-3"> Instructions </h2>
              <ul className="list-disc">
                <li>Do not refresh or close this page during the interview.</li>
                <li>Avoid pressing the back button, as it will immediately end your session.</li>
                <li>Once the interview ends unexpectedly, you may lose your chance to continue.</li>
                <li>Ensure you have a stable internet connection before starting.</li>
                <li>Use a quiet environment for better performance and clarity.</li>
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-bold text-center pb-3"> How it works ? </h2>
              <video src="/hw.mp4" autoPlay loop muted controls className="rounded-lg" />
              <p className="text-center mt-2 text-sm italic">Watch this video to know how it use</p>
            </div>
          </div>
          <Button onClick={handleStartInterview} className="bg-red-500 hover:bg-red-600">
            Start
          </Button>
        </div>
      </Modal>

      <Modal isOpen={isEndInterviewModalOpen} onClose={() => setIsEndInterviewModalOpen(false)}>
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold text-center"> End Interview </h2>
          <p className="text-gray-600">
            Are you sure you want to end the interview? if you end now you will not be able to
            continue and you loss your chance to practice{' '}
          </p>
          <div className="flex gap-4 justify-end">
            <Button onClick={() => setIsEndInterviewModalOpen(false)}>Cancel</Button>
            <Button onClick={handleEndInterview} className="bg-red-500 hover:bg-red-600">
              End
            </Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isTimeOutModalOpen}>
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold text-center"> Time Out </h2>
          <p className="text-gray-600">
            Your time has run out. You can no longer continue the interview.
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={handleTimeOut}>View Performance Feedback</Button>
          </div>
        </div>
      </Modal>

      <InterviewFeedbackModal
        sessionId={params.id as string}
        isOpen={isFeedbackModalOpen}
        onClose={() => navigate('/interview')}
      />
    </>
  );
};

export default Interview;
