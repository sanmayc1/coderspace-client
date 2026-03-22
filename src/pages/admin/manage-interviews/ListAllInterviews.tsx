import { createInterview, getAllInterviewsAdmin } from '@/api/admin/interview-management';
import AddEditInterviewModal from '@/components/admin/AddEditInterviewModal';
import InputFiled from '@/components/common/Input';
import Table from '@/components/common/Table';
import { Button } from '@/components/ui/Button';
import type { IInterviewData } from '@/types/types';
import { toastifyOptionsCenter } from '@/utils/toastify.options';
import { Edit, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const ListAllInterviews: React.FC = () => {
  const [interviews, setInterviews] = useState<IInterviewData[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedSort, setSort] = useState<string>('');
  const [itemsPerPage, setItemsPerPage] = useState<string>('5');
  const [search, setSearch] = useState('');
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
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
    if (isOpenAddModal || isOpenEditModal) {
      window.document.body.style.overflow = 'hidden';
    } else {
      window.document.body.style.overflow = 'auto';
    }
  }, [isOpenAddModal, isOpenEditModal]);

  // Fetch interviews when dependencies (including debouncedSearch) change
  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        setLoading(true);
        const res: any = await getAllInterviewsAdmin({
          sort: selectedSort,
          limit: itemsPerPage || '5',
          page: currentPage,
          search: debouncedSearch,
        });

        setInterviews(res.data?.data?.interviews || []);
        setTotalPages(res.data?.data?.totalPages || 1);
        setCurrentPage(Math.min(res.data?.data?.page || 1, res.data?.data?.totalPages || 1));
      } catch (error) {
        toast.error('Failed to load interviews', toastifyOptionsCenter);
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, [selectedSort, currentPage, itemsPerPage, debouncedSearch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };
  const renderPremium = (val: string) => {
    return (
      <p
        className={`text-xs p-1 w-fit px-3 flex justify-center items-center rounded-2xl ${
          val ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
        }`}
      >
        {val ? 'Premium' : 'Free'}
      </p>
    );
  };

   const openEditModal = (item: IInterviewData) => {
    setInterviewData(item);
    setIsOpenEditModal(true);
   }
  
   const closeEditModal = () => {
    if(isOpenEditModal){
      setIsOpenEditModal(false);
    }
    if(isOpenAddModal){
      setIsOpenAddModal(false);
    }
    
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
   }

   const handleCreateInterview = async () => {
    try {
      setLoading(true);
      const res: any = await createInterview(interviewData);
      toast.success(res.data?.message || 'Interview created successfully', toastifyOptionsCenter);
      closeEditModal();
    } catch (error) {
      toast.error('Failed to create interview', toastifyOptionsCenter);
    } finally {
      setLoading(false);
    }
   }


  const renderActions = ( _: string, item: IInterviewData) => {
    return (
      <div className="flex gap-2">
        <Button className="text-xs" size={'sm'} variant={'ghost'} onClick={()=>openEditModal(item)}>
          <Edit />
        </Button>
        <Button className="text-xs" size={'sm'} variant={'ghost'}>
          <Trash2 className="text-red-500" />
        </Button>
      </div>
    );
  };

  return (
    <>
      <div className="w-full flex flex-col gap-4">
        <div className="shadow-md sm:w-full w-[100%] p-3 bg-gray-50 rounded-md h-fit flex flex-col gap-4">
          <h1 className="text-2xl font-semibold px-2">Manage Interviews</h1>
          <InputFiled
            className="border-gray-300"
            placeholder="Search Roles"
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
            },

            {
              key: 'premium',
              label: 'Premium',
              render: renderPremium,
            },
            {
              key: 'id',
              label: 'Actions',
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
        onClose={closeEditModal}
        onSubmit={handleCreateInterview}
        data={interviewData}
        setData={setInterviewData}
      />
      <AddEditInterviewModal
        isOpen={isOpenEditModal}
        onClose={closeEditModal}
        onSubmit={() => {}}
        data={interviewData}
        setData={setInterviewData}
      />
    </>
  );
};

export default ListAllInterviews;
