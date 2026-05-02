import { getAllCompanies, rejectCompany, verifyCompany } from '@/api/admin/company-management';
import { updateUserStatus } from '@/api/admin/user-management';
import InputFiled from '@/components/common/input';
import Modal from '@/components/common/modal';
import SelectTag from '@/components/common/select';
import Table from '@/components/common/table';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/Switch';
import type { ICompany, IErrorResponse } from '@/types/response.types';
import { COMPANY_SORT_SELECT } from '@/utils/constants-admin';
import { toastifyOptionsCenter } from '@/utils/toastify.options';
import type { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Building2, Mail, FileText, CheckCircle, XCircle, AlertCircle, Eye } from 'lucide-react';
import LoadingSpin from '@/components/common/LoadingSpin';

const CompanyManagement: React.FC = () => {
  const [companies, setCompanies] = useState<ICompany[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedFilter, setFilter] = useState<string>('');
  const [itemsPerPage, setItemsPerPage] = useState<string>('');
  const [search, setSearch] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<ICompany | null>(null);
  const [refetch, setRefetch] = useState<boolean>(false);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [isLoadingApproval, setIsLoadingApproval] = useState(false);
  const [isLoadingReject, setIsLoadingReject] = useState(false);

  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

 
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await getAllCompanies({
          filter: selectedFilter,
          limit: itemsPerPage || '5',
          page: currentPage,
          search: debouncedSearch,
        });
        setCompanies(res.data.companies);
        setTotalPages(res.data.totalPages);
        if (currentPage !== res.data.currentPage) {
          setCurrentPage(res.data.currentPage);
        }
      } catch (error) {
        const axiosError = error as AxiosError<IErrorResponse>;
        toast.error(axiosError.response?.data.message, toastifyOptionsCenter);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [selectedFilter, currentPage, itemsPerPage, debouncedSearch, refetch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  const openEditModal = (company: ICompany) => {
    setSelectedCompany(company);
    setIsOpen(true);
  };

  const handleFilterChange = (value: string) => {
    setFilter(value);
  };

  const closeEditModal = () => {
    setSelectedCompany(null);
    setIsOpen(false);
    setIsRejectModalOpen(false);
    setRejectReason('');
  };

  const renderUserCell = (_value = '/defaultProfile.jpg', item: ICompany) => {
    return (
      <div className="flex pr-8 md:pr-0 justify-start items-center gap-2">
        <p>{item.name.charAt(0).toUpperCase() + item.name.slice(1)}</p>
      </div>
    );
  };

  const renderUserStatus = (value: boolean) => {
    return !value ? (
      <p className="bg-green-200 text-xs p-1 w-fit px-3 flex justify-center items-center rounded-2xl">
        Active
      </p>
    ) : (
      <p className="bg-red-100 text-xs p-1 w-fit px-3 flex justify-center items-center rounded-2xl">
        Blocked
      </p>
    );
  };

  const handleBlockToggle = async (accountId: string, blocked: boolean) => {
    const prevUsers = [...companies];
    setCompanies((prev) =>
      prev.map((u) => (u.accountId === accountId ? { ...u, isBlocked: blocked } : u))
    );

    try {
      await updateUserStatus(accountId);
      toast.success(
        `Company ${blocked ? 'blocked' : 'unblocked'} successfully`,
        toastifyOptionsCenter
      );
    } catch (error) {
      setCompanies(prevUsers);
      toast.error('Failed to update company status', toastifyOptionsCenter);
      console.log(error);
    }
  };

  const renderUserBlockSwitch = (value: boolean, item: ICompany) => (
    <Switch checked={value} onCheckedChange={(c) => handleBlockToggle(item.accountId, c)} />
  );

  const renderUserEdit = (value: boolean, item: ICompany) =>
    !value ? (
      <Button size="sm" className="text-xs pt-1" onClick={() => openEditModal(item)}>
        Update
      </Button>
    ) : (
      <Button
        size="sm"
        variant={'outline'}
        className="text-xs pt-1 flex items-center gap-2"
        onClick={() => openEditModal(item)}
      >
        <Eye className="text-xs" />
        View
      </Button>
    );

  const ApprovalStatus = (value: boolean, item: ICompany) => (
    <p
      className={`text-xs pl-5 ${!value && !item.isApproved ? 'text-yellow-500' : !item.isApproved && value ? 'text-red-500' : 'text-green-500'}`}
    >
      {!value && !item.isApproved ? 'Pending' : !item.isApproved && value ? 'Rejected' : 'Approved'}
    </p>
  );

  const handleApprove = async () => {
    try {
      if (!selectedCompany) return;
      setIsLoadingApproval(true);
      await verifyCompany(selectedCompany.accountId);
      toast.success('Company approved successfully', toastifyOptionsCenter);
      closeEditModal();
      setRefetch(!refetch);
    } catch (error) {
      const axiosError = error as AxiosError<IErrorResponse>;
      toast.error(axiosError.response?.data.message, toastifyOptionsCenter);
    } finally {
      setIsLoadingApproval(false);
    }
  };
  const handleReject = async () => {
    try {
      if (!selectedCompany) return;
      setIsLoadingReject(true);
      await rejectCompany(selectedCompany.accountId, rejectReason);
      toast.success('Company rejected successfully', toastifyOptionsCenter);
      closeEditModal();
      setRefetch(!refetch);
    } catch (error) {
      const axiosError = error as AxiosError<IErrorResponse>;
      toast.error(axiosError.response?.data.message, toastifyOptionsCenter);
    } finally {
      setIsLoadingReject(false);
    }
  };

  return (
    <>
      <div className="w-full flex flex-col gap-4 ">
        <div className="shadow-md sm:w-full w-[100%] p-3 bg-gray-50 rounded-md h-fit flex flex-col gap-4">
          <h1 className="text-2xl font-semibold px-2">Manage Companies</h1>
          <InputFiled
            className="border-gray-300"
            placeholder="Search Companies"
            name="search"
            handleChange={handleSearchChange}
            value={search}
          />
          <div className="flex sm:flex-row flex-col sm:w-60">
            <SelectTag
              options={COMPANY_SORT_SELECT}
              placeholder="Filters"
              label="Filters"
              name="Filter"
              handleChange={handleFilterChange}
              value={selectedFilter}
            />
          </div>
        </div>

        <Table
          columns={[
            {
              key: 'name',
              label: 'Company Name',
              render: renderUserCell,
            },
            {
              key: 'email',
              label: 'Company Email',
            },
            {
              key: 'gstNumber',
              label: 'GST',
            },

            {
              key: 'isBlocked',
              label: 'Status',
              render: renderUserStatus,
            },
            {
              key: 'remarks',
              label: 'Approval Status',
              render: ApprovalStatus,
            },
            {
              key: 'isBlocked',
              label: 'Block/Unblock',
              render: renderUserBlockSwitch,
            },
            {
              key: 'isApproved',
              label: 'Actions',
              render: renderUserEdit,
            },
          ]}
          loading={isLoading}
          data={companies}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
          setItemsPerPage={setItemsPerPage}
          itemsPerPage={itemsPerPage}
        />
      </div>
      {selectedCompany && (
        <Modal isOpen={isOpen} className="max-w-5xl p-0 overflow-hidden flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="bg-white p-6 flex items-center justify-center shrink-0">
            <div className="flex items-center gap-3 text-black">
              <Building2 size={28} className="text-black" />
              <h3 className="text-xl font-bold tracking-wide">
                {selectedCompany.isApproved ? 'Company Details' : 'Company Approval Request'}
              </h3>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 sm:p-8 flex flex-col gap-6 sm:gap-8 bg-gray-50/50 overflow-y-auto">
            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-start gap-4 transition-all hover:shadow-md">
                <div className="bg-blue-50 p-3 rounded-lg shrink-0">
                  <Building2 size={20} className="text-blue-600" />
                </div>
                <div className="overflow-hidden w-full">
                  <p className="text-sm text-gray-500 font-medium mb-1">Company Name</p>
                  <p
                    className="text-lg text-gray-900 font-semibold truncate"
                    title={selectedCompany.name}
                  >
                    {selectedCompany.name}
                  </p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-start gap-4 transition-all hover:shadow-md">
                <div className="bg-purple-50 p-3 rounded-lg shrink-0">
                  <Mail size={20} className="text-purple-600" />
                </div>
                <div className="overflow-hidden w-full">
                  <p className="text-sm text-gray-500 font-medium mb-1">Email Address</p>
                  <p
                    className="text-lg text-gray-900 font-semibold truncate"
                    title={selectedCompany.email}
                  >
                    {selectedCompany.email}
                  </p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-start gap-4 transition-all hover:shadow-md md:col-span-2">
                <div className="bg-emerald-50 p-3 rounded-lg shrink-0">
                  <FileText size={20} className="text-emerald-600" />
                </div>
                <div className="overflow-hidden w-full">
                  <p className="text-sm text-gray-500 font-medium mb-1">GST Number</p>
                  <p
                    className="text-lg text-gray-900 font-semibold tracking-wide truncate"
                    title={selectedCompany.gstNumber}
                  >
                    {selectedCompany.gstNumber}
                  </p>
                </div>
              </div>
            </div>

            {/* Certificate Section */}
            <div className="flex flex-col gap-3">
              <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                <AlertCircle size={16} /> Document Proof
              </h4>
              <div className="relative w-full h-48 sm:h-64 bg-white rounded-xl shadow-inner border-2 border-dashed border-gray-200 flex items-center justify-center p-2 group overflow-hidden shrink-0">
                {selectedCompany.certificateUrl ? (
                  <>
                    <img
                      src={selectedCompany.certificateUrl}
                      alt={`${selectedCompany.name} certificate`}
                      className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-105"
                    />
                    <a
                      href={selectedCompany.certificateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      download={`${selectedCompany.name.replace(/\s+/g, '_')}_certificate`}
                      className="absolute bottom-2 right-2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center shadow-md backdrop-blur-sm"
                      title="View Certificate"
                    >
                      <Eye size={20} />
                    </a>
                  </>
                ) : (
                  <span className="text-gray-400 flex flex-col items-center gap-2">
                    <FileText size={32} /> No certificate provided
                  </span>
                )}
              </div>
              {selectedCompany.remarks && <>
               
                <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                  Rejection Remarks
                </h4>
                <div className="relative w-full p-5 bg-red-50 rounded-xl shadow-inner border-2 border-dashed border-red-400 flex items-center justify-center  group overflow-hidden shrink-0">
                  {selectedCompany.remarks && (
                    <p className="text-gray-700 font-medium">{selectedCompany.remarks}</p>
                  )}
                </div>
              </>}
            </div>
          </div>

          {/* Actions */}
          <div className="p-4 sm:p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 rounded-b-2xl shrink-0">
            <Button
              variant="outline"
              onClick={closeEditModal}
              className="px-6 py-2.5 rounded-lg font-medium border-gray-300 text-gray-700 hover:bg-gray-100 transition-all"
            >
              Cancel
            </Button>
            {!selectedCompany?.isApproved && (
              <>
                
               { !selectedCompany.remarks && <Button
                  variant="destructive"
                  className="px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 shadow-sm transition-all bg-red-600 hover:bg-red-700"
                  onClick={() => {
                    setIsOpen(false);
                    setIsRejectModalOpen(true);
                  }}
                  disabled={isLoadingApproval || isLoadingReject}
                >
                  <XCircle size={18} /> Reject
                </Button>}
                <Button
                  onClick={handleApprove}
                  disabled={isLoadingApproval || isLoadingReject}
                  className="px-6 py-2.5 rounded-lg font-medium bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 shadow-sm transition-all"
                >
                  {isLoadingApproval ? (
                    <LoadingSpin size={18} />
                  ) : (
                    <>
                      <CheckCircle size={18} /> Approve
                    </>
                  )}
                </Button>
              </>
            )}
          </div>
        </Modal>
      )}

      {/* Reject Modal */}
      <Modal isOpen={isRejectModalOpen} className="max-w-md p-0 overflow-hidden">
        <div className="bg-red-500 p-5 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <XCircle size={24} className="text-red-100" />
            <h3 className="text-lg font-bold">Reject Application</h3>
          </div>
        </div>

        <div className="p-6 flex flex-col gap-4 bg-white">
          <p className="text-gray-600 text-sm">
            Please provide a reason for rejecting{' '}
            <span className="font-semibold text-gray-900">{selectedCompany?.name}</span>'s
            application. This will be communicated to the company.
          </p>

          <div className="flex flex-col gap-2">
            <label htmlFor="rejectReason" className="text-sm font-medium text-gray-700">
              Rejection Reason
            </label>
            <textarea
              id="rejectReason"
              rows={4}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="E.g., Invalid GST number, unclear certificate..."
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all resize-none text-sm"
            ></textarea>
          </div>
        </div>

        <div className="p-5 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 rounded-b-2xl">
          <Button
            variant="outline"
            onClick={() => {
              setIsRejectModalOpen(false);
              setIsOpen(true);
            }}
            className="px-5 py-2 text-gray-600 hover:bg-gray-100"
          >
            Back
          </Button>
          <Button
            variant="destructive"
            className="px-5 py-2 flex items-center gap-2 bg-red-600 hover:bg-red-700"
            disabled={!rejectReason.trim() || isLoadingReject}
            onClick={handleReject}
          >
            {isLoadingReject ? <LoadingSpin size={18} /> : 'Confirm Rejection'}
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default CompanyManagement;
