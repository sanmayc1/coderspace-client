import { getAllUsers } from "@/api/admin/user-management";
import EditUser from "@/components/admin/edit-user";
import LoadingSkeletonWraper from "@/components/common/loading-wraper";
import Modal from "@/components/common/modal";
import Table from "@/components/common/table";
import UserManagementTableSkeleton from "@/components/skeleton/table-skeleton";
import type { IUsersData } from "@/types/types";
import { toastifyOptionsCenter } from "@/utils/toastify.options";
import type { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const UserMangement: React.FC = () => {
  const [users, setUsers] = useState<IUsersData[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        setLoading(true);
        const res = await getAllUsers();
        setLoading(false);
        setUsers(res.data?.data?.users || []);
        setTotalPages(res.data?.data?.totalPages);
        setCurrentPage(res.data?.data?.page);
        setLoading(false);
      } catch (error) {
        const axiosError = error as AxiosError<any>;
        setLoading(false);
        toast.error(axiosError.response?.data.message, toastifyOptionsCenter);
      }
    };

    fetchAllUsers();
  }, []);

  return (
    <>
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-semibold px-2">User Management</h1>
        <LoadingSkeletonWraper
          isLoading={isLoading}
          Skeleton={UserManagementTableSkeleton}
        >
          <Table
            columns={[
              {
                key: "profileUrl",
                label: "Username",
                render: (_value = "/defaultProfile.jpg", item) => {
                  return (
                    <div className="flex justify-start  items-center gap-3">
                      <img className="h-8 rounded-full" src={_value} />
                      <p>
                        {item.username.charAt(1).toUpperCase() +
                          item.username.slice(2)}
                      </p>
                    </div>
                  );
                },
              },
              {
                key: "email",
                label: "Email",
              },
              {
                key: "level",
                label: "Level",
              },
              { key: "badge", label: "Badge" },
              {
                key: "userId",
                label: "Actions",
                render: (_value) => (
                  <button
                    onClick={() => setIsOpen(true)}
                    className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Edit
                  </button>
                ),
              },
            ]}
            data={users}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
          />
        </LoadingSkeletonWraper>
      </div>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <EditUser />
      </Modal>
    </>
  );
};

export default UserMangement;
