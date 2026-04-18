import { useRef, useState } from 'react';

const useSpeechRecorder = () => {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recognitionRef = useRef<any>(null);

  const transcriptRef = useRef(''); // ✅ store final transcript

  const [isRecording, setIsRecording] = useState(false);

  const startRecording = async () => {
    try {
      transcriptRef.current = ''; // reset

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.start();

      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;

        recognition.continuous = true;
        recognition.interimResults = false; // ✅ only final text
        recognition.lang = 'en-IN';

        recognition.onresult = (event: any) => {
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              transcriptRef.current += event.results[i][0].transcript + ' ';
            }
          }
        };

        recognition.start();
      }

      setIsRecording(true);
    } catch (err) {
      console.error('Mic error:', err);
    }
  };

  // ✅ return transcript AFTER stop
const stopRecording = (): Promise<string> => {
  return new Promise((resolve) => {
    if (!mediaRecorderRef.current) {
      resolve('');
      return;
    }

    mediaRecorderRef.current.stop();

    if (recognitionRef.current) {
      const recognition = recognitionRef.current;

      recognition.stop(); // ✅ stop first

      // ✅ wait for last result to arrive
      setTimeout(() => {
        setIsRecording(false);

        const finalText = transcriptRef.current.trim();
        console.log('Final Transcript:', finalText);

        resolve(finalText);
      }, 800); // 🔥 increase delay (important)
    } else {
      setIsRecording(false);
      resolve('');
    }
  });
};

  return {
    startRecording,
    stopRecording,
    isRecording,
  };
};

export default useSpeechRecorder;