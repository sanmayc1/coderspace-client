import {
  createInterview,
  deleteInterview,
  getAllInterviewsAdmin,
} from '@/api/admin/interview-management';
import AddEditInterviewModal from '@/components/admin/AddEditInterviewModal';
import InputFiled from '@/components/common/Input';
import Table from '@/components/common/table';
import { Button } from '@/components/ui/Button';
import type { IInterviewData } from '@/types/types';
import { toastifyOptionsCenter } from '@/utils/toastify.options';
import { Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const ListAllInterviews: React.FC = () => {
  const [interviews, setInterviews] = useState<IInterviewData[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<string>('5');
  const [search, setSearch] = useState('');
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const [interviewData, setInterviewData] = useState<IInterviewData>({
    title: '',
    description: '',
    context: '',
    numberOfQuestions: 5,
    difficulty: 'easy',
    premium: false,
    duration: 10,
  });

  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce the search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (isOpenAddModal) {
      window.document.body.style.overflow = 'hidden';
    } else {
      window.document.body.style.overflow = 'auto';
    }
  }, [isOpenAddModal]);

  // Fetch interviews when dependencies (including debouncedSearch) change
  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        setLoading(true);
        const res = await getAllInterviewsAdmin({
          limit: itemsPerPage || '5',
          page: currentPage,
          search: debouncedSearch,
        });

        setInterviews(res.data?.interviews || []);
        setTotalPages(res.data?.totalPages || 1);
        setCurrentPage(Math.min(res.data?.currentPage || 1, res.data?.totalPages || 1));
      } catch (error) {
        toast.error('Failed to load interviews', toastifyOptionsCenter);
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, [currentPage, itemsPerPage, debouncedSearch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };
  const renderPremium = (val: string) => {
    return (
      <p
        className={`text-xs p-1 w-fit px-3 flex justify-center items-center rounded-2xl ${
          val ? 'bg-yellow-200 text-yellow-800' : 'bg-green-200 text-green-800'
        }`}
      >
        {val ? 'Premium' : 'Free'}
      </p>
    );
  };

  const closeEditModal = () => {
    setIsOpenAddModal(false);

    setInterviewData({
      title: '',
      id: '',
      description: '',
      context: '',
      numberOfQuestions: 5,
      difficulty: 'easy',
      premium: false,
      duration: 10,
    });
  };

  const handleCreateInterview = async () => {
    try {
      setLoading(true);
      const res = await createInterview(interviewData);
      setInterviews((prev) => [res.data, ...prev]);
      toast.success(res.message || 'Interview created successfully', toastifyOptionsCenter);
      closeEditModal();
    } catch (error) {
      toast.error('Failed to create interview', toastifyOptionsCenter);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteInterview = async (id: string) => {
    try {
      setLoading(true);
      const res = await deleteInterview(id);
      setInterviews((prev) => prev.filter((interview) => interview.id !== id));
      toast.success(res.message || 'Interview deleted successfully', toastifyOptionsCenter);
    } catch (error) {
      toast.error('Failed to delete interview', toastifyOptionsCenter);
    } finally {
      setLoading(false);
    }
  };

  const renderActions = (id: string) => {
    return (
      <div className="flex gap-2">
        <Button
          className="text-xs"
          size={'sm'}
          variant={'ghost'}
          onClick={() => handleDeleteInterview(id)}
        >
          <Trash2 className="text-red-500" />
        </Button>
      </div>
    );
  };

  const renderDescription = (val: string) => {
    return (
      <p className="text-xs p-1 w-fit px-3 flex justify-center items-center rounded-2xl">
        {val.length > 50 ? val.slice(0, 50) + '...' : val}
      </p>
    );
  };

  const renderDuration = (val: number) => {
    return (
      <p className="text-xs p-1 w-fit px-3 flex justify-center items-center rounded-2xl">
        {val} <span className="text-xs pl-2">Minutes</span>
      </p>
    );
  };

  return (
    <>
      <div className="w-full flex flex-col gap-4">
        <div className="shadow-md sm:w-full w-[100%] p-3 bg-gray-50 rounded-md h-fit flex flex-col gap-4">
          <h1 className="text-2xl font-semibold px-2">Manage Interviews</h1>
          <InputFiled
            className="border-gray-300"
            placeholder="Search Title"
            name="search"
            handleChange={handleSearchChange}
            value={search}
          />
          <div className="flex sm:flex-row flex-col justify-end ">
            <Button onClick={() => setIsOpenAddModal(true)}>Add Interview</Button>
          </div>
        </div>

        <Table
          columns={[
            {
              key: 'title',
              label: 'Title',
            },
            {
              key: 'description',
              label: 'Description',
              render: renderDescription,
            },
            {
              key: 'difficulty',
              label: 'Difficulty',
            },
            {
              key: 'duration',
              label: 'Duration',
              render: renderDuration,
            },

            {
              key: 'premium',
              label: 'Premium',
              render: renderPremium,
            },
            {
              key: 'id',
              label: ' ',
              render: renderActions,
            },
          ]}
          loading={isLoading}
          data={interviews}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
          setItemsPerPage={setItemsPerPage}
          itemsPerPage={itemsPerPage}
        />
      </div>
      <AddEditInterviewModal
        isOpen={isOpenAddModal}
        loading={isLoading}
        onClose={closeEditModal}
        onSubmit={handleCreateInterview}
        data={interviewData}
        setData={setInterviewData}
      />
    </>
  );
};

export default ListAllInterviews;
