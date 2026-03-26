import { getInterviewQuestion } from '@/api/user/user.interview';
import Modal from '@/components/common/Modal';
import Avatar from '@/components/user/InterviewCharacter';
import Loader from '@/components/user/InterviewConnectingLoader';
import type { IGetInterviewQuestionResponse } from '@/types/response.types';
import { toastifyOptionsCenter } from '@/utils/toastify.options';
import { Canvas } from '@react-three/fiber';
import { Mic, PhoneOff, Square, Repeat, MessageCircleQuestionMark, AlignRight } from 'lucide-react';
import { Suspense, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as THREE from 'three';

const Interview = () => {
  const [question, setQuestion] = useState<IGetInterviewQuestionResponse|null>(null);
  const [interviewDuration, setInterviewDuration] = useState(0);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [audio, setAudio] = useState<string>('');
  const jawRef = useRef<THREE.Bone | null>(null);
  const headRef = useRef<THREE.Bone | null>(null);
  const isTalkingRef = useRef<boolean>(false);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array<ArrayBuffer> | null>(null);
  const [startRecording, setStartRecording] = useState(false);
  const [isOpenShowQuestionModal, setIsOpenShowQuestionModal] = useState(false);
  const params = useParams();

  useEffect(() => {
    const duration = Number(localStorage.getItem('interviewDuration'));
    const questionNum = Number(localStorage.getItem('questionNumber'));

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
    if (questionNumber > 1) {
      localStorage.setItem('questionNumber', questionNumber.toString());
    }
  }, [questionNumber]);

  useEffect(() => {
    if (interviewDuration > 0) {
      localStorage.setItem('interviewDuration', interviewDuration.toString());
    }


  }, [interviewDuration]);

  useEffect(() => {
    async function fetchQuestions() {
      try {
       const res = await getInterviewQuestion(params.id as string, questionNumber);
       console.log(res)
       setQuestion(res.data)
       playVoice()
      } catch (error) {
        console.log(error)
        toast.error("Something went Wrong",toastifyOptionsCenter)
      }
    }
    fetchQuestions()
  }, [questionNumber]);

  const playVoice = () => {
    if (isTalkingRef.current || !question) return;

    const audioSrc = `data:audio/mpeg;base64,${question?.audio}`;
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
    setStartRecording(false);

    audio.onended = () => {
      isTalkingRef.current = false;
      setStartRecording(true);
    };
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
            <div className="flex items-center gap-3 flex-1">
              <span className="text-gray-200 text-sm font-medium tracking-wide">Time Left</span>
              <span className="text-white font-bold tracking-widest text-lg">
                {Math.floor(interviewDuration / 60)} : {interviewDuration % 60}
              </span>
            </div>

            <div className="flex-1 items-center gap-3 flex justify-center">
              <button className="w-12 h-12 bg-[#d1d1d1] rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-inner group">
                {startRecording ? (
                  <Square
                    onClick={() => setStartRecording(false)}
                    className="text-[#d92d20]"
                    size={24}
                    fill="#d92d20"
                  />
                ) : (
                  <Mic className="text-[#d92d20]" size={24} />
                )}
              </button>
              {startRecording && (
                <span className="text-white text-xs font-medium tracking-wide">1:20</span>
              )}
            </div>

            <div className="flex-1 flex justify-end">
              <button className="bg-[#d92d20] hover:bg-red-700 text-white px-6 py-2.5 rounded-full flex items-center gap-2.5 font-medium transition-colors shadow-md">
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
    </>
  );
};

export default Interview;
