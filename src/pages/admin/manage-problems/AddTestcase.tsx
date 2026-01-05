import { addSingleTestcase, deleteTestcase, getAllTestcase } from '@/api/admin/problem-management';
import CustomPagination from '@/components/common/Pagination';
import { Button } from '@/components/ui/Button';
import type { IGetTestcase } from '@/types/response.types';
import { toastifyOptionsCenter } from '@/utils/toastify.options';
import { Editor } from '@monaco-editor/react';
import { Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const AddTestcase = () => {
  const [value, setValue] = useState('');
  const [testcases, setTestcases] = useState<IGetTestcase[]>([]);
  const [refetch, setRefetch] = useState(false);
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
      await addSingleTestcase({
        problemId: id,
        input: JSON.stringify(data.input),
        output: JSON.stringify(data.output),
        ...(data.example ? { example: data.example } : {}),
      });
      toast.success('Test Cases Added', toastifyOptionsCenter);
      setRefetch((prev) => !prev);
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong', toastifyOptionsCenter);
    }
  };

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
                <Button
                  size={'sm'}
                  className="text-xs cursor-pointer"
                  onClick={handleSingleTestcaseSubmit}
                >
                  Add testcase
                </Button>
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
              {t.example && <p className="text-xs text-gray-500 ">example : {String(t.example)}</p>}
            </div>
          ))}
        </div>
        <CustomPagination currentPage={1} setCurrentPage={() => {}} totalPages={1} />
      </div>
    </div>
  );
};

export default AddTestcase;
