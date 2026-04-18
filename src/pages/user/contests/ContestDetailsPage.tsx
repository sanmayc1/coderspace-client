import React, { useEffect, useState } from 'react';
import {
  CheckCircle,
  CircleDot,
  Play,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Clock,
  LucideAlarmClock,
} from 'lucide-react';
import { Editor } from '@monaco-editor/react';
import 'monaco-editor/esm/vs/basic-languages/java/java.contribution';
import 'monaco-editor/esm/vs/basic-languages/typescript/typescript.contribution';
import 'monaco-editor/esm/vs/basic-languages/python/python.contribution';
import 'monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution';
import { runProblemUser } from '@/api/user/user.problem';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { toastifyOptionsCenter } from '@/utils/toastify.options';
import type { IContestProblem, IGetProblemUpdatesResponse } from '@/types/response.types';
import SelectTag from '@/components/common/select';
import { Button } from '@/components/ui/button';
import { AxiosError } from 'axios';
import { useAppSelector } from '@/app/hooks/redux-custom-hook';
import LoadingSpin from '@/components/common/LoadingSpin';
import {
  contestSubmitProblemUser,
  finishContestUser,
  getContestProblems,
} from '@/api/user/user.contest';
import Modal from '@/components/common/modal';

const ContestDetails: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'description' | 'solution'>('description');
  const [code, setCode] = useState(``);
  const [defaultCode, setDefaultCode] = useState(``);
  const [language, setLanguage] = useState('');
  const [problem, setProblem] = useState<IContestProblem>();
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [testPassed, setTestPassed] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [activeOutputTab, setActiveOutputTab] = useState<'test'>('test');
  const [activeTestCaseId, setActiveTestCaseId] = useState(0);
  const { id } = useParams();
  const [currentStatus, setCurrentStatus] = useState<IGetProblemUpdatesResponse>({
    solution: '',
    status: '',
    language: '',
  });
  const auth = useAppSelector((s) => s.authReducer.auth);
  const [loading, setLoading] = useState(true);
  const [allProblems, setAllProblems] = useState<IContestProblem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [solvedProblemIds, setSolvedProblemIds] = useState<Set<string>>(new Set());
  const [userCodeMap, setUserCodeMap] = useState<Record<string, string>>({});
  const [endTime, setEndTime] = useState<string>('');

  const calculateTimeLeft = () => {
    if (!endTime) return null;
    const difference = +new Date(endTime) - +new Date();

    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return null;
  };

  const [timeRemaining, setTimeRemaining] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);
  const [timeUpModalOpen, setTimeUpModalOpen] = useState(false);
  const [finishModalOpen, setFinishModalOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    async function fetchProblemDetails() {
      try {
        const contest = await getContestProblems(id as string);
        setAllProblems(contest.problems);
        setEndTime(String(contest.endDateAndTime));
        if (contest.problems.length > 0) {
          const currentProb = contest.problems[0];
          setProblem(currentProb);
          const lang = currentProb.templateCodes[0].language;
          setLanguage(lang);

          const defaultC = currentProb.templateCodes[0].templateCode;
          setDefaultCode(defaultC);

          const key = `${currentProb.id}_${lang}`;
          setCode(userCodeMap[key] || defaultC);

          setCurrentIndex(0);
        }
        setLoading(false);
      } catch (error) {
        if (error instanceof AxiosError) {
          toast.error(error.response?.data.message, toastifyOptionsCenter);
        }
        setLoading(false);
        navigate('/contest');
      }
    }
    if (id) {
      fetchProblemDetails();
    }
  }, []);

  useEffect(() => {
    if (problem && language) {
      const key = `${problem.id}_${language}`;
      setUserCodeMap((prev) => ({ ...prev, [key]: code }));
    }
  }, [code, problem, language]);

  useEffect(() => {
    if (!problem) return;
    const template = problem.templateCodes.find((t) => t.language === language)?.templateCode || '';
    setDefaultCode(template);

    const key = `${problem.id}_${language}`;
    if (userCodeMap[key]) {
      setCode(userCodeMap[key]);
    } else {
      setCode(template);
    }
  }, [language, problem]);

  useEffect(() => {
    if (!endTime) return;

    const initial = calculateTimeLeft();
    if (initial) {
      setTimeRemaining(initial);
    } else {
      if (!isNaN(new Date(endTime).getTime())) {
        setTimeRemaining(null);
        setTimeUpModalOpen(true);
      }
    }

    const timer = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeRemaining(remaining);
      if (!remaining) {
        setTimeUpModalOpen(true);
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  const handleRunCode = async () => {
    try {
      setError('');
      setTestPassed(false);
      setIsRunning(true);
      setOutput('Running Test Cases.....');
      const res = await runProblemUser(problem?.id as string, code, language);
      setIsRunning(false);
      setTestPassed(res.success);
      setError(res.success ? '' : 'Test cases failed');
      setProblem(
        (prev) =>
          prev && {
            ...prev,
            testcases: res.testcases,
          }
      );
      setOutput('Finsihed Running Test Cases');
    } catch (error) {
      if (error instanceof AxiosError) {
        setOutput('');
        setIsRunning(false);
        setError(error.response?.data.message);
      }
    }
  };

  const handleSubmitCode = async () => {
    if (!auth) {
      toast.error('Please login to submit code', toastifyOptionsCenter);
      return;
    }

    try {
      setError('');
      setTestPassed(false);
      setIsRunning(true);
      setOutput('Running Test Cases.....');
      const res = await contestSubmitProblemUser(
        problem?.id as string,
        code,
        language,
        id as string
      );
      setIsRunning(false);
      setTestPassed(res.success);
      setError(res.success ? '' : 'Test cases failed');
      setProblem(
        (prev) =>
          prev && {
            ...prev,
            testcases: res.testcases,
          }
      );

      if (res.success) {
        setSolvedProblemIds(new Set(solvedProblemIds).add(problem?.id as string));
      }
      setOutput('Finsihed Running Test Cases');
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error.response?.data);
        setOutput('');
        setIsRunning(false);
        setError(error.response?.data.message);
      }
    }
  };

  const handleReset = () => {
    setCode(defaultCode);
    setOutput('');
    setTestPassed(false);
  };

  const activeProblemId = problem?.id;
  const isSolved = activeProblemId ? solvedProblemIds.has(activeProblemId) : false;

  const handleNextProblem = () => {
    if (currentIndex < allProblems.length - 1) {
      const nextIndex = currentIndex + 1;
      const nextProb = allProblems[nextIndex];
      setCurrentIndex(nextIndex);
      setProblem(nextProb);

      const supportsCurrentLang = nextProb.templateCodes.some((t) => t.language === language);
      const nextLang = supportsCurrentLang ? language : nextProb.templateCodes[0].language;

      setLanguage(nextLang);

      setCurrentStatus({ solution: '', status: '', language: '' });
      setTestPassed(false);
      setOutput('');
      setError('');
    }
  };

  const handlePrevProblem = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      const prevProb = allProblems[prevIndex];
      setCurrentIndex(prevIndex);
      setProblem(prevProb);

      const supportsCurrentLang = prevProb.templateCodes.some((t) => t.language === language);
      const nextLang = supportsCurrentLang ? language : prevProb.templateCodes[0].language;

      setLanguage(nextLang);

      setCurrentStatus({ solution: '', status: '', language: '' });
      setTestPassed(false);
      setOutput('');
      setError('');
    }
  };

  const handleFinish = () => {
    setFinishModalOpen(true);
  };

  const confirmFinish = async () => {
    try {
      const res = await finishContestUser(id as string);
      if (res.success) {
        navigate('/contest');
      }
    } catch (error) {
      toast.error('Failed to finish contest', toastifyOptionsCenter);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpin size={30} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Finish Confirmation Modal */}
      <Modal isOpen={finishModalOpen} onClose={() => setFinishModalOpen(false)}>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Finish Contest?</h2>
          <p className="text-gray-600 mb-6">
            Are you sure you want to finish the contest? You won't be able to submit any more
            solutions.
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              variant="outline"
              onClick={() => setFinishModalOpen(false)}
              className="px-6 border-gray-300 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button onClick={confirmFinish} className="px-6 bg-red-600 hover:bg-red-700 text-white">
              Confirm Finish
            </Button>
          </div>
        </div>
      </Modal>

      {/* Time Up Modal */}
      {timeUpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full text-center relative animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock className="w-10 h-10 text-red-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Time's Up!</h2>
            <p className="text-gray-600 mb-8 text-lg">
              The contest has ended. You can no longer submit solutions.
            </p>
            <Button
              onClick={() => navigate('/contest')}
              className="w-full py-3 bg-black text-white hover:bg-gray-800 text-lg font-semibold rounded-lg transition-all"
            >
              Back to Contests
            </Button>
          </div>
        </div>
      )}
      <div className="flex-1 flex flex-col lg:flex-row my-4 mx-2 md:my-20 md:mx-10 lg:my-28 lg:mx-14 border-2 rounded-lg p-2 h-auto lg:h-[calc(100vh-160px)]">
        <div className="w-full lg:w-1/2 border-b lg:border-b-0 lg:border-r border-gray-200 overflow-y-auto h-[50vh] lg:h-auto">
          <div className="p-4">
            <div className="flex border-b justify-between border-gray-200 mb-6">
              <button
                onClick={() => setActiveTab('description')}
                className={`pb-2 px-1 mr-8 font-medium ${
                  activeTab === 'description'
                    ? 'border-b-2 border-black text-black'
                    : 'text-gray-600'
                }`}
              >
                Description
              </button>
              {/* <button
                onClick={() => setActiveTab('solution')}
                className={`pb-2 px-1 font-medium ${
                  activeTab === 'solution' ? 'border-b-2 border-black text-black' : 'text-gray-600'
                }`}
              ></button> */}
              <div className="flex items-center gap-2">
                <p className="font-mono text-xl flex gap-2 ">
                  <LucideAlarmClock className="w-5 h-5 text-gray-600 mr-2" />
                  {timeRemaining
                    ? `${
                        timeRemaining.days > 0
                          ? `${String(timeRemaining.days).padStart(2, '0')}:`
                          : ''
                      }${String(timeRemaining.hours).padStart(2, '0')}:${String(
                        timeRemaining.minutes
                      ).padStart(2, '0')}:${String(timeRemaining.seconds).padStart(2, '0')}`
                    : '00:00:00'}
                </p>
                <div className="ml-4 pl-4 border-l border-gray-300">
                  <Button
                    onClick={handleFinish}
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    Finish Contest
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl md:text-2xl font-bold mb-6 flex  justify-between items-center">
                <span>
                  {' '}
                  {problem?.number}.{' '}
                  {problem?.title
                    .split(' ')
                    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
                    .join(' ')}
                </span>
                <div className="flex items-center gap-4">
                  {/* Status Indicator */}
                  {currentStatus.status === 'solved' || isSolved ? (
                    <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" /> Solved
                    </span>
                  ) : currentStatus.status === 'attempted' ? (
                    <span className="text-yellow-500 text-sm font-medium flex items-center gap-1">
                      <CircleDot className="w-4 h-4" /> Attempted
                    </span>
                  ) : null}

                  {/* Navigation */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePrevProblem}
                      disabled={currentIndex === 0}
                      className="p-1 hover:bg-gray-100 rounded-full disabled:opacity-30 disabled:hover:bg-transparent"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="font-mono text-sm font-medium">
                      {currentIndex + 1} / {allProblems.length}
                    </span>
                    <button
                      onClick={handleNextProblem}
                      disabled={currentIndex === allProblems.length - 1}
                      className="p-1 hover:bg-gray-100 rounded-full disabled:opacity-30 disabled:hover:bg-transparent"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </h2>

              <p className="text-gray-700 mb-4">{problem?.description}</p>

              {problem?.examples.map((ex, i) => (
                <div className="mb-6" key={ex.id}>
                  <p className="font-semibold mb-2">Example {i + 1}:</p>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                    <p>
                      <span className="font-semibold">Input:</span> {ex.input}
                    </p>
                    <p>
                      <span className="font-semibold">Output:</span> {ex.output}
                    </p>
                    <p>
                      <span className="font-semibold">Explanation:</span> {ex.output}
                    </p>
                  </div>
                </div>
              ))}

              <div className="mb-6">
                <p className="font-semibold mb-2">Constraints:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>{problem?.constrain}</li>
                </ul>
              </div>

              <div className="flex flex-wrap gap-2">
                {problem?.skills.map((s) => (
                  <span
                    key={s.id}
                    className="px-3 py-1 bg-white border border-gray-300 rounded-full text-sm"
                  >
                    {s.title.charAt(0).toUpperCase() + s.title.slice(1)}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <span className="font-mono text-sm">&lt;/&gt;</span>
              <span className="font-semibold">Code</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 gap-4 sm:gap-2">
                <Button
                  onClick={handleRunCode}
                  disabled={isRunning}
                  className="flex items-center space-x-1"
                >
                  <Play className="w-4 h-4" fill="white" />
                  <span>Run Code</span>
                </Button>
                <div className="flex items-center space-x-2">
                  {!isSolved ? (
                    <Button
                      className="px-6 py-2 border "
                      onClick={handleSubmitCode}
                      disabled={isRunning}
                      title="Submit"
                    >
                      Submit
                    </Button>
                  ) : currentIndex < allProblems.length - 1 ? (
                    <Button
                      className="px-6 py-2 border bg-black text-white hover:bg-gray-800"
                      onClick={handleNextProblem}
                      title="Next"
                    >
                      Next
                    </Button>
                  ) : null}
                  <Button
                    onClick={handleReset}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Reset"
                    variant="outline"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </Button>
                </div>
              </div>
              <SelectTag
                options={
                  problem?.templateCodes
                    ? problem.templateCodes.map((t) => ({
                        label: t.language.charAt(0).toUpperCase() + t.language.slice(1),
                        value: t.language,
                      }))
                    : []
                }
                placeholder="Languages"
                handleChange={(v) => {
                  setLanguage(v);
                }}
                label="Languages"
                name="languages"
                value={language}
              />
            </div>
          </div>

          <div className="h-[500px] lg:h-[45vh]  overflow-hidden ">
            <Editor
              className="p-2 "
              height="100%"
              theme={'vs-dark'}
              language={language}
              value={code}
              onChange={(v) => setCode(v as string)}
            />
          </div>

          <div className="border-t border-gray-200 bg-white">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveOutputTab('test')}
                className={`px-4 py-2 text-sm font-medium ${
                  activeOutputTab === 'test'
                    ? 'border-b-2 border-black text-black'
                    : 'text-gray-600'
                }`}
              >
                Test Cases
              </button>
            </div>
            <div
              className={`p-4 min-h-[120px] ${activeOutputTab === 'test' ? 'bg-[#262626] text-white' : ''}`}
            >
              {activeOutputTab === 'test' ? (
                <div className="flex flex-col space-y-4">
                  {/* Status Header */}
                  {(output || error) && (
                    <div className="flex items-center gap-4">
                      <h3
                        className={`text-lg font-bold ${
                          testPassed ? 'text-green-500' : error ? 'text-red-500' : 'text-gray-400'
                        }`}
                      >
                        {isRunning
                          ? 'Running...'
                          : testPassed
                            ? 'Accepted'
                            : error
                              ? 'Wrong Answer' // Assuming error indicates failure if not 200 OK
                              : 'Ready'}
                      </h3>
                    </div>
                  )}

                  {/* Test Case Tabs */}
                  {problem?.testcases && (
                    <div className="flex gap-2">
                      {problem.testcases.map((t, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveTestCaseId(idx)}
                          className={`px-4 py-1.5 rounded-lg text-sm transition-colors relative flex items-center gap-2 ${
                            activeTestCaseId === idx
                              ? 'bg-gray-700 text-white font-medium'
                              : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                          }`}
                        >
                          Case {idx + 1}
                          {!isRunning && t.hasOwnProperty('isCorrect') && t.isCorrect && (
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                          )}
                          {!isRunning && t.hasOwnProperty('isCorrect') && t.isCorrect === false && (
                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Test Case Details */}
                  {problem?.testcases && problem.testcases[activeTestCaseId] && (
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <p className="text-xs text-gray-400 uppercase">Input</p>
                        <div className="bg-gray-800 p-3 rounded-lg font-mono text-sm text-gray-300">
                          {problem.testcases[activeTestCaseId].input}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <p className="text-xs text-gray-400 uppercase">Output</p>
                        <div
                          className={`bg-gray-800 p-3 rounded-lg font-mono text-sm ${
                            testPassed ? 'text-white' : error ? 'text-red-400' : 'text-gray-400'
                          }`}
                        >
                          {isRunning
                            ? 'Running...'
                            : testPassed
                              ? problem.testcases[activeTestCaseId].output // Simulating correct output
                              : error
                                ? error // Showing error if failed (since actual output missing)
                                : 'Run code to see output'}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <p className="text-xs text-gray-400 uppercase">Expected</p>
                        <div className="bg-gray-800 p-3 rounded-lg font-mono text-sm text-gray-300">
                          {problem.testcases[activeTestCaseId].expected}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // Console Tab Content (Fallback to original style if needed, or simple logs)
                <div className="space-y-2 text-black">
                  <p className="text-sm font-mono">{output}</p>
                  {error && <p className="text-sm text-red-600 font-mono">{error}</p>}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContestDetails;
