import { getAllUsers, updateUserStatus } from "@/api/admin/user-management";
import EditUser from "@/components/admin/EditUser";
import InputFiled from "@/components/common/Input";
import LoadingSkeletonWraper from "@/components/common/LoadingWraper";
import Modal from "@/components/common/Modal";
import SelectTag from "@/components/common/Select";
import Table from "@/components/common/Table";
import UserManagementTableSkeleton from "@/components/skeleton/TableSkeleton";
import { Button } from "@/components/ui/Button";
import { Switch } from "@/components/ui/Switch";
import type { IErrorResponse } from "@/types/response.types";
import type { IUsersData } from "@/types/types";
import { SORT_SELECT_1 } from "@/utils/constants-admin";
import { toastifyOptionsCenter } from "@/utils/toastify.options";
import type { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<IUsersData[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedSort, setSort] = useState<string>("");
  const [itemsPerPage, setItemsPerPage] = useState<string>("");
  const [search, setSearch] = useState("");
  const [selectedUser, setUser] = useState<IUsersData | null>(null);
  const [refetch, setRefetch] = useState<boolean>(false);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        setLoading(true);
        const res = await getAllUsers({
          sort: selectedSort,
          limit: itemsPerPage || "5",
          page: currentPage,
          search: search,
        });

        setUsers(res.data?.data?.users || []);
        setTotalPages(res.data?.data?.totalPages);
        setCurrentPage(
          Math.min(res.data?.data?.page, res.data?.data?.totalPages)
        );
      } catch (error) {
        const axiosError = error as AxiosError<IErrorResponse>;
        toast.error(axiosError.response?.data.message, toastifyOptionsCenter);
      } finally {
        setLoading(false);
      }
    };

    fetchAllUsers();
  }, [selectedSort, currentPage, itemsPerPage, search, refetch]);

  const handleSortChange = (value: string) => {
    setSort(value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const openEditModal = (user: IUsersData) => {
    setUser(user);
    setIsOpen(true);
  };

  const closeEditModal = () => {
    setUser(null);
    setIsOpen(false);
  };

  const renderUserCell = (_value = "/defaultProfile.jpg", item: IUsersData) => {
    return (
      <div className="flex pr-8 md:pr-0 justify-start items-center gap-2">
        <img className="h-8 rounded-full " src={_value} />
        <p>{item.username.charAt(1).toUpperCase() + item.username.slice(2)}</p>
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
    const prevUsers = [...users];
    setUsers((prev) =>
      prev.map((u) => (u.accountId === accountId ? { ...u, blocked } : u))
    );

    try {
      await updateUserStatus(accountId);
      toast.success(
        `User ${blocked ? "blocked" : "unblocked"} successfully`,
        toastifyOptionsCenter
      );
    } catch (error) {
      setUsers(prevUsers);
      toast.error("Failed to update user status", toastifyOptionsCenter);
      console.log(error)
    }
  };

  const renderUserBlockSwitch = (value: boolean, item: IUsersData) => (
    <Switch
      checked={value}
      onCheckedChange={(c) => handleBlockToggle(item.accountId, c)}
    />
  );

  const renderUserEdit = (_value: string, item: IUsersData) => (
    <Button size="sm" className="text-xs pt-1" onClick={() => openEditModal(item)}>
      Edit
    </Button>
  );

  return (
    <>
      <div className="w-full  flex flex-col gap-4 ">
        <div className="shadow-md sm:w-full w-[100%] p-3 bg-gray-50 rounded-md h-fit flex flex-col gap-4">
          <h1 className="text-2xl font-semibold px-2">Manage Users</h1>
          <InputFiled
            className="border-gray-300"
            placeholder="Search Users"
            name="search"
            handleChange={handleSearchChange}
            value={search}
          />
          <div className="flex sm:flex-row flex-col sm:w-60">
            <SelectTag
              options={SORT_SELECT_1}
              placeholder="Sort By"
              label="Sort"
              name="sort"
              handleChange={handleSortChange}
              value={selectedSort}
            />
          </div>
        </div>

        <LoadingSkeletonWraper
          isLoading={isLoading}
          Skeleton={UserManagementTableSkeleton}
        >
          <Table
            columns={[
              {
                key: "profileUrl",
                label: "Username",
                render: renderUserCell,
              },
              {
                key: "email",
                label: "Email",
              },
              {
                key: "level",
                label: "Level",
              },
              {
                key: "badge",
                label: "Badge",
                render: (val) => val.charAt(0).toUpperCase() + val.slice(1),
              },
              {
                key: "blocked",
                label: "Status",
                render: renderUserStatus,
              },
              {
                key: "blocked",
                label: "Block",
                render: renderUserBlockSwitch,
              },
              {
                key: "userId",
                label: "Actions",
                render: renderUserEdit,
              },
            ]}
            data={users}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            setItemsPerPage={setItemsPerPage}
            itemsPerPage={itemsPerPage}
          />
        </LoadingSkeletonWraper>
      </div>
      {selectedUser && (
        <Modal isOpen={isOpen}>
          <EditUser
            user={selectedUser as IUsersData}
            onClose={closeEditModal}
            setRefetch={setRefetch}
          />
        </Modal>
      )}
    </>
  );
};

export default UserManagement;
