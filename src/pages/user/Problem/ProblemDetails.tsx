import React, { useEffect, useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';
import { Editor } from '@monaco-editor/react';
import 'monaco-editor/esm/vs/basic-languages/java/java.contribution';
import 'monaco-editor/esm/vs/basic-languages/cpp/cpp.contribution';
import 'monaco-editor/esm/vs/basic-languages/python/python.contribution';
import 'monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution';
import { getProblemUser } from '@/api/user/user.problem';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { toastifyOptionsCenter } from '@/utils/toastify.options';
import type { IUserGetProblemDetailed } from '@/types/response.types';
import SelectTag from '@/components/common/Select';

const ProblemDetails: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'description' | 'solution'>('description');
  const [code, setCode] = useState(``);
  const [language, setLanguage] = useState('');
  const [problem, setProblem] = useState<IUserGetProblemDetailed>();
  const [output, setOutput] = useState('');
  const [testPassed, setTestPassed] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [activeOutputTab, setActiveOutputTab] = useState<'test' | 'console'>('test');

  const { id } = useParams();

  useEffect(() => {
    async function fetchProblemDetails() {
      try {
        const res = await getProblemUser(id as string);
        setLanguage(res.data.templateCodes[0].language);
        setCode(res.data.templateCodes[0].templateCode);
        setProblem(res.data);
      } catch (error) {
        toast.error('Something went wrong', toastifyOptionsCenter);
      }
    }
    if (id) {
      fetchProblemDetails();
    }
  }, []);

  useEffect(() => {
    setCode(problem?.templateCodes.find((t) => t.language === language)?.templateCode as string);
  }, [language]);

  const handleRunCode = () => {
    setIsRunning(true);
    setActiveOutputTab('test');
    setTimeout(() => {
      setOutput('Running Test Cases.....');
      setTimeout(() => {
        setTestPassed(true);
        setIsRunning(false);
      }, 1000);
    }, 500);
  };

  const handleReset = () => {
    setCode(`class Solution:
    
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        
        # Write your solution here
        pass`);
    setOutput('');
    setTestPassed(false);
  };

  return (
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
                  activeTab === 'solution' ? 'border-b-2 border-black text-black' : 'text-gray-600'
                }`}
              ></button>
            </div>

            <div>
              <h2 className="text-xl md:text-2xl font-bold mb-6">
                {problem?.number}.{' '}
                {problem?.title
                  .split(' ')
                  .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
                  .join(' ')}
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

          <div className="h-[500px] lg:h-auto lg:flex-1 overflow-hidden">
            <Editor
              className="p-2 "
              height="100%"
              theme={'vs-dark'}
              language={language}
              value={code}
              onChange={(v) => setCode(v as string)}
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t border-gray-200 gap-4 sm:gap-0">
            <button
              onClick={handleRunCode}
              disabled={isRunning}
              className="flex items-center space-x-2 bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              <Play className="w-4 h-4" fill="white" />
              <span>Run Code</span>
            </button>
            <div className="flex items-center space-x-2">
              <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Submit
              </button>
              <button
                onClick={handleReset}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Reset"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
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
              <button
                onClick={() => setActiveOutputTab('console')}
                className={`px-4 py-2 text-sm font-medium ${
                  activeOutputTab === 'console'
                    ? 'border-b-2 border-black text-black'
                    : 'text-gray-600'
                }`}
              >
                Console
              </button>
            </div>
            <div className="p-4 min-h-[120px]">
              {output && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">{output}</p>
                  {testPassed && (
                    <div className="flex items-center space-x-2 text-green-600">
                      <span className="text-sm font-medium">Test Case Passed</span>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemDetails;
