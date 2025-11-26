import { getAllCreatedContestsOfCompany } from "@/api/company/company";
import InputFiled from "@/components/common/Input";
import LoadingSkeletonWraper from "@/components/common/LoadingWraper";
import Table, { type TableColumn } from "@/components/common/Table";
import UserManagementTableSkeleton from "@/components/skeleton/TableSkeleton";
import { Button } from "@/components/ui/Button";
import type { IListContestState } from "@/types/types";
import { toastifyOptionsCenter } from "@/utils/toastify.options";
import { PlusCircleIcon } from "lucide-react";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ManageContests: React.FC = () => {
  const [contests, setContests] = useState<IListContestState[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<string>("");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function getAllContest() {
      setLoading(true);
      try {
        const res = await getAllCreatedContestsOfCompany(search, String(currentPage));
        setContests(res.data.contests || []);
        setTotalPages(res.data.totalPages || 1);
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong", toastifyOptionsCenter);
      }
      setLoading(false);
    }
    getAllContest();
  }, [search, currentPage, itemsPerPage]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  // Table columns for contests
  const columns:TableColumn<IListContestState>[] = [
    {
      key: "title",
      label: "Title",
    },
    {
      key: "description",
      label: "Description",
      render: (val: string) => (
        <span title={val}>
          {val.length > 40 ? val.slice(0, 40) + "..." : val}
        </span>
      ),
    },
    {
      key: "dateAndTime",
      label: "Date & Time",
      render: (val: string) =>
        new Date(val).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }),
    },
    {
      key: "duration",
      label: "Duration (min)",
    },
    {
      key: "view",
      label: "Visibility",
      render: (val: string) => val.charAt(0).toUpperCase() + val.slice(1),
    },
  ];

  return (
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
            size={"sm"}
            onClick={() => navigate("/company/manage-contest/add")}
          >
            <span className="pt-1">Add Contest</span>
            <PlusCircleIcon />{" "}
          </Button>
        </div>
      </div>

      <LoadingSkeletonWraper
        isLoading={isLoading}
        Skeleton={UserManagementTableSkeleton}
      >
        <Table
          columns={columns}
          data={contests}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
          setItemsPerPage={setItemsPerPage}
          itemsPerPage={itemsPerPage}
        />
      </LoadingSkeletonWraper>
    </div>
  );
};

export default ManageContests;
