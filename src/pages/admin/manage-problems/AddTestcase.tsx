import { addSingleTestcase, deleteTestcase, getAllTestcase } from '@/api/admin/problem-management';
import LoadingSpin from '@/components/common/LoadingSpin';
import Modal from '@/components/common/Modal';
import CustomPagination from '@/components/common/pagination';
import { Button } from '@/components/ui/Button';
import type { IGetTestcase } from '@/types/response.types';
import { toastifyOptionsCenter } from '@/utils/toastify.options';
import { Editor } from '@monaco-editor/react';
import { AxiosError } from 'axios';
import { Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const AddTestcase = () => {
  const [value, setValue] = useState('');
  const [testcases, setTestcases] = useState<IGetTestcase[]>([]);
  const [refetch, setRefetch] = useState(false);
  const [testcaseModal, setTestcaseModal] = useState(false);
  const [passedLanguages, setPassedLanguages] = useState<{ language: string; isPassed: boolean }[]>(
    []
  );
  const [loading, setLoading] = useState(false);

  const { id } = useParams();

  useEffect(() => {
    async function fetchAllTestCase() {
      try {
        const res = await getAllTestcase(id as string);
        setTestcases(res.data);
      } catch (error) {
        toast.error('Something went wrong', toastifyOptionsCenter);
      }
    }
    if (id) {
      fetchAllTestCase();
    }
  }, [refetch]);

  const navigate = useNavigate();

  const handleSingleTestcaseSubmit = async () => {
    setLoading(true);
    let data;
    try {
      data = JSON.parse(value);
      if (!data.hasOwnProperty('input')) {
        toast.error('Input missing', toastifyOptionsCenter);
        return;
      }

      if (!data.hasOwnProperty('output')) {
        toast.error('output missing', toastifyOptionsCenter);
        return;
      }

      if (!(data.input instanceof Array)) {
        toast.error('Input must be an array', toastifyOptionsCenter);
        return;
      }

      if (data.hasOwnProperty('example') && typeof data.example !== 'boolean') {
        toast.error('Example must be boolean', toastifyOptionsCenter);
        return;
      }
    } catch (error) {
      toast.error('Invalid JSON Format', toastifyOptionsCenter);
      return;
    }

    try {
      const res = await addSingleTestcase({
        problemId: id,
        input: JSON.stringify(data.input),
        output: JSON.stringify(data.output),
        ...(data.example ? { example: data.example } : {}),
      });

      setPassedLanguages(res.data);
      setTestcaseModal(true);
      if (res.success) {
        setRefetch((prev) => !prev);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.errors[0].error, toastifyOptionsCenter);
      } else {
        toast.error('Something went wrong', toastifyOptionsCenter);
      }
    }
  };

  // const handleAutoGenerateTestcase = async () => {
  //   try {
  //     await autoGenerateTestcases(id as string);
  //     toast.success('Auto generated successfully', toastifyOptionsCenter);
  //     window.location.reload();
  //   } catch (error) {
  //     if (error instanceof AxiosError) {
  //       toast.error(error.response?.data.errors[0].error, toastifyOptionsCenter);
  //     } else {
  //       toast.error('Something went wrong', toastifyOptionsCenter);
  //     }
  //   }
  // };

  const handleDeleteTestcase = async (id: string) => {
    try {
      await deleteTestcase(id);
      toast.success('Testcase Deleted', toastifyOptionsCenter);
      setRefetch((prev) => !prev);
    } catch (error) {
      toast.error('Something went wrong', toastifyOptionsCenter);
    }
  };
  return (
    <>
      <div className="flex flex-col gap-2">
        <div className=" bg-white shadow-sm rounded-md grid grid-flow-col grid-cols-3  justify-center items-center">
          <div className="flex px-5 justify-start">
            <Button variant={'ghost'} onClick={() => navigate('/admin/manage-problems/')}>
              Back
            </Button>
          </div>
          <h1 className="text-xl text-center p-3">Add Testcase</h1>
        </div>

        <div className="flex flex-col bg-white p-5 rounded-md shadow-md gap-5">
          <div className="flex justify-center w-full gap-6">
            <div className="w-full flex items-end gap-4">
              <div className="bg-[#1E1E1E] rounded-md">
                <div className="py-2 bg-[#5F5F5F] text-white px-4 flex items-center justify-between text-sm rounded-t-md ">
                  <p>Single Testcase</p>
                  <div className="flex gap-3">
                    <Button
                      size={'sm'}
                      className="text-xs cursor-pointer"
                      onClick={handleSingleTestcaseSubmit}
                      disabled={loading}
                    >
                      {loading ? <LoadingSpin /> : 'Add testcase'}
                    </Button>
                    {/* <Button
                    size={'sm'}
                    className="text-xs cursor-pointer"
                    onClick={handleAutoGenerateTestcase}
                  >
                    Auto Generate
                  </Button> */}
                  </div>
                </div>
                <div className="p-2">
                  <Editor
                    theme="vs-dark"
                    height={210}
                    language="json"
                    width={500}
                    defaultValue={`\n\n{ \n\n "input" : [ param1, param2, param4 ], \n\n "output" : any \n\n }`}
                    options={{
                      minimap: { enabled: false },
                      formatOnPaste: true,
                      formatOnType: true,
                    }}
                    onChange={(v) => setValue(v || '')}
                    value={value}
                  />
                </div>
              </div>
            </div>

            {/* <div className="w-full flex items-end gap-4 ">
            <div className="bg-[#1E1E1E] rounded-md">
              <div className="py-2 bg-[#5F5F5F] text-white px-4 flex items-center justify-between text-sm rounded-t-md ">
                <p>Bulk Testcase Json</p>
                <Button size={"sm"} className="text-xs cursor-pointer">
                  Add testcases
                </Button>
              </div>
              <div className="p-2">
                <Editor
                  theme="vs-dark"
                  height={210}
                  language="json"
                  width={500}
                  defaultValue={`\n[\n { \n   "input" : [ param1, param2, param4 ], \n   "output" : any \n  },\n { \n   "input" : [ param1, param2, param4 ], \n   "output" : any \n  }\n]`}
                  options={{
                    minimap: { enabled: false },
                    formatOnPaste: true,
                    formatOnType: true,
                  }}
                  onChange={(v) => setValue(v || "")}
                  value={value}
                />
              </div>
            </div>
          </div> */}
          </div>

          {/* added testcases */}
          <p>Added Testcases</p>
          <div className="bg-gray-100 p-5 border rounded-md grid gap-5 grid-cols-5">
            {testcases.map((t) => (
              <div key={t.id} className="bg-white p-3 flex flex-col gap-2 shadow-md rounded-md">
                <div className="flex justify-between gap-2">
                  <p className="text-sm">Testcase</p>
                  <div className="flex gap-3">
                    <Trash2
                      size={17}
                      className="text-red-500 cursor-pointer"
                      onClick={() => handleDeleteTestcase(t.id)}
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500 ">Input : {t.input}</p>
                <p className="text-xs text-gray-500 ">Output : {t.output}</p>
                {t.example && (
                  <p className="text-xs text-gray-500 ">example : {String(t.example)}</p>
                )}
              </div>
            ))}
          </div>
          <CustomPagination currentPage={1} setCurrentPage={() => {}} totalPages={1} />
        </div>
      </div>

      <Modal
        isOpen={testcaseModal}
        onClose={() => setTestcaseModal(false)}
        className="max-w-[550px] p-8 !rounded-[2rem] font-[anybody-regular]"
      >
        <div className="flex flex-col gap-7">
          {/* Header */}
          <div className="space-y-1.5 flex flex-col items-center">
            <h3 className="text-2xl font-black text-gray-900 tracking-tight text-center">
              Testcase Details
            </h3>
            <p className="text-sm text-gray-500 text-center font-medium">
              Evaluation summary across all languages
            </p>
          </div>

          {/* Output Block */}
          <div className="flex flex-col gap-3 p-5 bg-gray-50 rounded-2xl border border-gray-200/60 shadow-inner overflow-hidden">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-1">
                Input Data
              </span>
              <div className="bg-white p-3 rounded-xl border border-gray-100 text-gray-800 overflow-x-auto whitespace-pre-wrap max-h-24 shadow-sm text-sm font-mono custom-scrollbar">
                {(() => {
                  try {
                    return JSON.stringify(JSON.parse(value).input);
                  } catch {
                    return value;
                  }
                })() || 'No Input'}
              </div>
            </div>
            <div className="flex flex-col gap-1 mt-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-1">
                Expected Output
              </span>
              <div className="bg-white p-3 rounded-xl border border-gray-100 text-gray-800 overflow-x-auto whitespace-pre-wrap max-h-24 shadow-sm text-sm font-mono custom-scrollbar">
                {(() => {
                  try {
                    return JSON.stringify(JSON.parse(value).output);
                  } catch {
                    return value;
                  }
                })() || 'No Output'}
              </div>
            </div>
          </div>

          {/* Languages Status */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="h-[1px] bg-gray-200 flex-1"></span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                Language Status
              </span>
              <span className="h-[1px] bg-gray-200 flex-1"></span>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              {passedLanguages.map((l) => (
                <div
                  key={l.language}
                  className={`flex justify-between items-center p-3.5 rounded-[1rem] border transition-all duration-300 ${
                    l.isPassed
                      ? 'bg-green-50 border-green-200 hover:shadow-[0_4px_15px_rgba(34,197,94,0.15)]'
                      : 'bg-red-50 border-red-200 hover:shadow-[0_4px_15px_rgba(239,68,68,0.15)]'
                  }`}
                >
                  <span className="font-bold text-gray-800 capitalize text-sm">{l.language}</span>
                  <span
                    className={`text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full shadow-sm ${
                      l.isPassed
                        ? 'bg-green-100 text-green-700 border border-green-200'
                        : 'bg-red-100 text-red-700 border border-red-200'
                    }`}
                  >
                    {l.isPassed ? 'Passed' : 'Failed'}
                  </span>
                </div>
              ))}
              {passedLanguages.length === 0 && (
                <div className="col-span-2 text-center text-sm text-gray-400 italic font-medium p-2">
                  No languages evaluated
                </div>
              )}
            </div>

            {!passedLanguages.every((l) => l.isPassed) && passedLanguages.length > 0 ? (
              <div className="bg-amber-50/80 backdrop-blur text-amber-800 p-3.5 rounded-2xl border border-amber-200/60 text-xs font-semibold mt-4 flex items-center justify-center gap-2 shadow-sm transition-all duration-300 hover:bg-amber-100">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                Please check your testcase or failed language solutions
              </div>
            ) : passedLanguages.every((l) => l.isPassed) && passedLanguages.length > 0 ? (
              <div className="bg-blue-50/80 backdrop-blur text-blue-800 p-3.5 rounded-2xl border border-blue-200/60 text-xs font-semibold mt-4 flex items-center justify-center gap-2 shadow-sm">
                <span className="text-base">🎉</span> All active languages successfully passed!
              </div>
            ) : null}
          </div>

          <div className="flex justify-end gap-3 mt-2">
            <Button
              onClick={() => setTestcaseModal(false)}
              variant="outline"
              className="flex-1 h-12 rounded-xl text-gray-600 border-gray-300 font-bold hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              Close Center
            </Button>
            <Button
              onClick={() => setTestcaseModal(false)}
              className="flex-1 h-12 bg-gray-900 text-white rounded-xl shadow-md hover:bg-black hover:shadow-lg font-bold transition-all"
            >
              Done
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AddTestcase;
