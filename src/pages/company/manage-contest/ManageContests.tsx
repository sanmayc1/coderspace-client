import { deleteContest, getAllCreatedContestsOfCompany } from '@/api/company/company';
import InputFiled from '@/components/common/Input';
import Modal from '@/components/common/Modal';
import Table, { type TableColumn } from '@/components/common/table';
import { Button } from '@/components/ui/Button';
import type { IListContestState } from '@/types/types';
import { debounce } from '@/utils/debouncing';
import { toastifyOptionsCenter } from '@/utils/toastify.options';
import { Edit2, PlusCircleIcon, Trash2, Trophy } from 'lucide-react';

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ManageContests: React.FC = () => {
  const [contests, setContests] = useState<IListContestState[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<string>('');
  const [search, setSearch] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedContestId, setSelectedContestId] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const debouncedFetchAllContests = debounce(async () => {
      setLoading(true);
      try {
        const res = await getAllCreatedContestsOfCompany(search, String(currentPage), itemsPerPage);
        setContests(res.data.contests || []);
        setTotalPages(res.data.totalPages || 1);
      } catch (error) {
        console.log(error);
        toast.error('Something went wrong', toastifyOptionsCenter);
      }
      setLoading(false);
    }, 500);
    debouncedFetchAllContests();
  }, [search, currentPage, itemsPerPage]);

  // Reset page to 1 when search or itemsPerPage changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, itemsPerPage]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleOpenDeleteModal = (id: string) => {
    setSelectedContestId(id);
    setIsDeleteModalOpen(true);
  };

  const onClose = () => {
    setIsDeleteModalOpen(false);
    setSelectedContestId('');
  };

  const handleDeleteContest = async () => {
    try {
      if (!selectedContestId) return;
      const res = await deleteContest(selectedContestId);
      toast.success(res.message, toastifyOptionsCenter);
      setContests(contests.filter((contest) => contest.id !== selectedContestId));
      setSelectedContestId('');
      onClose();
    } catch (error) {
      toast.error('Something went wrong', toastifyOptionsCenter);
    }
  };

  // Table columns for contests
  const columns: TableColumn<IListContestState>[] = [
    {
      key: 'title',
      label: 'Title',
      render: (val: string) => (
        <span>
          {val
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')}
        </span>
      ),
    },
    {
      key: 'description',
      label: 'Description',
      render: (val: string) => (
        <span title={val}>{val.length > 40 ? val.slice(0, 40) + '...' : val}</span>
      ),
    },
    {
      key: 'dateAndTime',
      label: 'Date & Time',
      render: (val: string) =>
        new Date(val).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }),
    },
    {
      key: 'duration',
      label: 'Duration (min)',
    },
    {
      key: 'view',
      label: 'Visibility',
      render: (val: string) => val.charAt(0).toUpperCase() + val.slice(1),
    },
    {
      key: 'id',
      label: 'Action',
      render: (_, item) => (
        <div className="flex items-center gap-4">
          {item.dateAndTime > new Date().toISOString() && (
            <>
              <div
                className="cursor-pointer text-blue-600 hover:text-blue-800 transition-colors"
                title="Edit Contest"
                onClick={() => navigate(`/company/manage-contest/edit/${item.id}`)}
              >
                <Edit2 size={18} />
              </div>
              <div
                className="cursor-pointer text-red-600 hover:text-red-800 transition-colors"
                title="Delete Contest"
                onClick={() => handleOpenDeleteModal(item.id)}
              >
                <Trash2 className="hover:text-red-500 transition-colors" size={18} />
              </div>
            </>
          )}
          {item.endDateAndTime < new Date().toISOString() && (
            <div
              className="cursor-pointer text-amber-500 hover:text-amber-700 transition-colors"
              title="Leaderboard"
              onClick={() => navigate(`/company/manage-contest/${item.id}/leaderboard`)}
            >
              <Trophy size={18} />
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="w-full flex flex-col gap-4 ">
        <div className="shadow-md sm:w-full w-[100%] p-3 bg-gray-50 rounded-md h-fit flex flex-col gap-4">
          <h1 className="text-2xl font-semibold px-2">Manage Contests</h1>
          <InputFiled
            className="border-gray-300"
            placeholder="Search Contest"
            name="search"
            handleChange={handleSearchChange}
            value={search}
          />
          <div className="flex justify-end w-full gap-4">
            <Button
              className="text-xs flex justify-center items-center"
              size={'sm'}
              onClick={() => navigate('/company/manage-contest/add')}
            >
              <span className="pt-1">Add Contest</span>
              <PlusCircleIcon />{' '}
            </Button>
          </div>
        </div>

        <Table
          columns={columns}
          data={contests}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
          setItemsPerPage={setItemsPerPage}
          itemsPerPage={itemsPerPage}
          loading={isLoading}
        />
      </div>

      <Modal isOpen={isDeleteModalOpen} onClose={onClose}>
        <div className="flex flex-col gap-2">
          <h3 className=" font-semibold">Are you sure you want to delete this contest?</h3>
          <p className="text-gray-500 text-sm">
            Once deleted, you will not be able to recover this contest.
          </p>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button className="text-xs" size={'sm'} onClick={onClose}>
            Cancel
          </Button>
          <Button className="text-xs" size={'sm'} onClick={handleDeleteContest}>
            Delete
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default ManageContests;
