import React, { useEffect, useState } from 'react';
import Table, { type TableColumn } from '@/components/common/Table';
import type { IGetAllPaymentsResponse } from '@/types/dummy-payment.types';
import { getAllPaymentsAdmin } from '@/api/admin/payment-management';
import { Search } from 'lucide-react';

const ListAllPayments: React.FC = () => {
  const [payments, setPayments] = useState<IGetAllPaymentsResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [limit, setLimit] = useState('5');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to page 1 on new search
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    fetchPayments();
  }, [page, debouncedSearch, limit]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await getAllPaymentsAdmin({
        page,
        limit,
        search: debouncedSearch,
        sort: 'NEWEST',
      });
      setPayments(response.data);
      // @ts-ignore - Pagination metadata handled in dummy API
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Failed to fetch payments', error);
    } finally {
      setLoading(false);
    }
  };

  const columns: TableColumn<IGetAllPaymentsResponse>[] = [
    {
      key: 'username',
      label: 'User Name',
      render: (username) => <span className="font-medium text-gray-900">{username}</span>,
    },
    {
      key: 'email',
      label: 'Email',
      render: (email) => <span className="text-gray-500">{email}</span>,
    },
    {
      key: 'paymentId',
      label: 'Payment ID',
      className: 'font-mono text-xs',
      render: (paymentId) => (
        <span className="text-gray-500">{paymentId ? paymentId : 'N/A'}</span>
      ),
    },
    {
      key: 'planName',
      label: 'Plan',
      render: (planName) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {planName}
        </span>
      ),
    },
    {
      key: 'amount',
      label: 'Amount',
      render: (amount) => <span className="text-gray-900 font-semibold">₹{amount}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (status) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
            status === 'success'
              ? 'bg-green-100 text-green-800'
              : status === 'failed'
                ? 'bg-red-100 text-red-800'
                : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {status}
        </span>
      ),
    },
    {
      key: 'date',
      label: 'Date',
      render: (date) => (
        <span className="text-gray-500">{new Date(date).toLocaleDateString()}</span>
      ), // Using simple date string for now, user asked for 'date'
    },
  ];

  return (
    <div className="w-full p-6 bg-gray-50 min-h-screen font-['anybody-regular']">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent">
            Payment History
          </h1>
          <p className="text-gray-500 text-sm mt-1">Manage and view all transaction records.</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <div className="relative w-full sm:w-72">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by name, email, or Order ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
            {/* Optional: Add Filter/Export buttons here */}
          </div>

          <Table
            data={payments}
            columns={columns}
            loading={loading}
            currentPage={page}
            setCurrentPage={setPage}
            totalPages={totalPages}
            itemsPerPage={limit}
            setItemsPerPage={setLimit}
            className="shadow-none border border-gray-100 rounded-lg overflow-hidden"
          />
        </div>
      </div>
    </div>
  );
};

export default ListAllPayments;
