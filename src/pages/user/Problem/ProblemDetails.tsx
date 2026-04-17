import React, { useEffect, useState } from 'react';
import { CheckCircle, CircleDot, Play, RotateCcw } from 'lucide-react';
import { Editor } from '@monaco-editor/react';
import 'monaco-editor/esm/vs/basic-languages/java/java.contribution';
import 'monaco-editor/esm/vs/basic-languages/typescript/typescript.contribution';
import 'monaco-editor/esm/vs/basic-languages/python/python.contribution';
import 'monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution';
import {
  getProblemupdates,
  getProblemUser,
  runProblemUser,
  submitProblemUser,
} from '@/api/user/user.problem';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { toastifyOptionsCenter } from '@/utils/toastify.options';
import type {
  IGetProblemUpdatesResponse,
  ISubmitProblemResponse,
  IUserGetProblemDetailed,
} from '@/types/response.types';
import SelectTag from '@/components/common/Select';
import { Button } from '@/components/ui/Button';
import { AxiosError } from 'axios';
import { useAppSelector } from '@/app/hooks/redux-custom-hook';
import LoadingSpin from '@/components/common/LoadingSpin';
import Modal from '@/components/common/Modal';

const ProblemDetails: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'description' | 'solution'>('description');
  const [code, setCode] = useState(``);
  const [defaultCode, setDefaultCode] = useState(``);
  const [language, setLanguage] = useState('');
  const [problem, setProblem] = useState<IUserGetProblemDetailed>();
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
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successData, setSuccessData] =
    useState<Pick<ISubmitProblemResponse, 'levelReached' | 'badgeReached' | 'xpCoinEarned'>>();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProblemDetails() {
      try {
        const res = await getProblemUser(id as string);

        let updates: IGetProblemUpdatesResponse | null = null;
        if (auth) {
          updates = await getProblemupdates(id as string, res.data.templateCodes[0].language);
          console.log('updates', updates);
          setCurrentStatus(updates);
        }

        if (updates?.status === 'solved' || updates?.status === 'attempted') {
          setCode(updates?.solution);
          setLanguage(updates?.language);
        } else {
          setCode(res.data.templateCodes[0].templateCode);
          setLanguage(res.data.templateCodes[0].language);
        }
        setDefaultCode(res.data.templateCodes[0].templateCode);

        setProblem(res.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast.error('Something went wrong', toastifyOptionsCenter);
      }
    }
    if (id) {
      fetchProblemDetails();
    }
  }, []);

  useEffect(() => {
    if (currentStatus.language === language) {
      setCode(currentStatus.solution);
      return;
    }
    setCode(problem?.templateCodes.find((t) => t.language === language)?.templateCode as string);
  }, [language]);

  const handleRunCode = async () => {
    try {
      setError('');
      setTestPassed(false);
      setIsRunning(true);
      setOutput('Running Test Cases.....');
      const res = await runProblemUser(id as string, code, language);
      setIsRunning(false);
      console.log(res);
      setTestPassed(res.success);
      console.log(res.testcases);
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
        console.log(error.response?.data);
        setOutput('');
        setIsRunning(false);
        setError(error.response?.data.message);
      }

      // toast.error('Something went wrong', toastifyOptionsCenter);
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
      const res = await submitProblemUser(id as string, code, language);
      setIsRunning(false);
      setTestPassed(res.success);
      setProblem(
        (prev) =>
          prev && {
            ...prev,
            testcases: res.testcases,
          }
      );

      if (res.success) {
        setCurrentStatus({
          solution: code,
          status: 'solved',
          language,
        });

        setSuccessData({
          levelReached: res.levelReached,
          badgeReached: res.badgeReached,
          xpCoinEarned: res.xpCoinEarned,
        });
        setIsSuccessModalOpen(true);
      } else {
        setCurrentStatus({
          solution: code,
          status: 'attempted',
          language,
        });
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpin size={30} />
      </div>
    );
  }

  const backToProblems = () => {
    navigate('/problems');
    setIsSuccessModalOpen(false);
  };

  return (
    <>
      <div className="min-h-screen bg-white flex flex-col">
        <div className="flex-1 flex flex-col lg:flex-row my-4 mx-2 md:my-20 md:mx-10 lg:my-28 lg:mx-14 border-2 rounded-lg p-2 h-auto lg:h-[calc(100vh-160px)]">
          <div className="w-full lg:w-1/2 border-b lg:border-b-0 lg:border-r border-gray-200 overflow-y-auto h-[50vh] lg:h-auto">
            <div className="p-4 md:p-8">
              <div className="flex border-b border-gray-200 mb-6">
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
                <button
                  onClick={() => setActiveTab('solution')}
                  className={`pb-2 px-1 font-medium ${
                    activeTab === 'solution'
                      ? 'border-b-2 border-black text-black'
                      : 'text-gray-600'
                  }`}
                ></button>
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
                  {currentStatus.status && currentStatus.status === 'solved' ? (
                    <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" /> Solved
                    </span>
                  ) : currentStatus.status && currentStatus.status === 'attempted' ? (
                    <span className="text-yellow-500 text-sm font-medium flex items-center gap-1">
                      <CircleDot className="w-4 h-4" /> Attempted
                    </span>
                  ) : (
                    <span className="text-gray-600 text-sm font-medium flex items-center gap-1"></span>
                  )}
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
                    <Button
                      className="px-6 py-2 border "
                      onClick={handleSubmitCode}
                      disabled={isRunning}
                      title="Submit"
                    >
                      Submit
                    </Button>
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
                            {!isRunning &&
                              t.hasOwnProperty('isCorrect') &&
                              t.isCorrect === false && (
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
                              : !testPassed
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

      <Modal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        className="max-w-2xl"
      >
        <div className="flex flex-col items-center p-6 text-center space-y-4">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-2 shadow-inner">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>

          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Congratulations!</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            You have successfully solved this problem and passed all test cases.
          </p>

          <div className="grid grid-cols-2 gap-4 w-full mt-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800/50 flex flex-col items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                Current Level
              </span>
              <span className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                {successData?.levelReached}
              </span>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl border border-purple-100 dark:border-purple-800/50 flex flex-col items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Badge</span>
              <span className="text-2xl font-bold text-purple-700 dark:text-purple-400">
                {successData?.badgeReached}
              </span>
            </div>
          </div>
          {successData && successData?.xpCoinEarned > 0 ? (
            <div className="bg-[#fff9e6] dark:bg-yellow-900/20 w-full p-4 rounded-xl flex items-center justify-center gap-3 mt-2 border border-yellow-200 dark:border-yellow-700/50 shadow-sm">
              <img
                src="/coin.png"
                alt="XP Coin"
                className="w-10 h-10 object-contain drop-shadow-md"
              />

              <div className="flex flex-col items-start">
                <span className="text-sm text-yellow-700 dark:text-yellow-500 font-semibold uppercase tracking-wider">
                  XP Earned
                </span>
                <span className="text-2xl font-black text-yellow-600 dark:text-yellow-400">
                  +{successData?.xpCoinEarned}
                </span>
              </div>
            </div>
          ):""}
          <Button
            onClick={backToProblems}
            className="w-full mt-6 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            Back to Problems
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default ProblemDetails;
