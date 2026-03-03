import { getAudio } from '@/api/user/user.interview';
import Avatar from '@/components/user/InterviewCharacter';
import { Canvas } from '@react-three/fiber';
import { Volume2, Mic, PhoneOff } from 'lucide-react';
import { useState } from 'react';

const Interview = () => {
  const [text, setText] = useState<string>('');
  const [audio, setAudio] = useState<string>('');

  const playVoice = async () => {
    const response = await getAudio();
    setText(response.data.text);
    const audioSrc = `data:audio/mpeg;base64,${response.data.audio}`;
    setAudio(audioSrc);
    const audio = new Audio(audioSrc);
    audio.play();
  };

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat relative flex flex-col items-center justify-between font-[Inter,sans-serif]"
      style={{ backgroundImage: `url('/interview-bg.png')` }}
    >
      <div className="w-full h-full mt-40">
        <Canvas camera={{ position: [4, 1.5, 7], fov: 100 }}   >
          <ambientLight intensity={1.5} />
          <directionalLight position={[5, 5, 5]} intensity={2} />
          <Avatar />
        </Canvas>
      </div>
      <div className="flex-grow w-full max-w-[1200px] relative mx-auto">
        {/* Chat Bubble Header */}
        <div className="absolute top-[15%] left-[50%] md:left-[52%] w-[90%] md:w-auto max-w-[450px] bg-white rounded-xl shadow-2xl p-6 pb-10">
          <p className="text-gray-700 text-sm md:text-[15px] leading-relaxed font-medium">{text}</p>
          <button className="absolute bottom-3 right-4 text-black hover:text-gray-600 transition-colors">
            <Volume2 size={16} fill="currentColor" strokeWidth={1} onClick={() => playVoice()} />
          </button>

          {/* Chat bubble tail */}
          <div className="absolute -left-[18px] bottom-3 w-0 h-0 border-r-[20px] border-r-white border-b-[20px] border-b-transparent" />
        </div>
      </div>

      {/* Control Bar */}
      <div className="mb-10 w-full max-w-[650px] px-4">
        <div className="bg-[#666666] backdrop-blur-md rounded-[3rem] px-8 py-3 flex items-center justify-between shadow-2xl border border-gray-500/30">
          {/* Timer */}
          <div className="flex items-center gap-3 flex-1">
            <span className="text-gray-200 text-sm font-medium tracking-wide">Time Left</span>
            <span className="text-white font-bold tracking-widest text-lg">29 : 00</span>
          </div>

          {/* Mic Button */}
          <div className="flex-1 flex justify-center">
            <button className="w-14 h-14 bg-[#d1d1d1] rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-inner group">
              <Mic className="text-[#d92d20]" size={24} />
            </button>
          </div>

          {/* End Interview */}
          <div className="flex-1 flex justify-end">
            <button className="bg-[#d92d20] hover:bg-red-700 text-white px-6 py-2.5 rounded-full flex items-center gap-2.5 font-medium transition-colors shadow-md">
              <PhoneOff size={20} />
              End Interview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Interview;
