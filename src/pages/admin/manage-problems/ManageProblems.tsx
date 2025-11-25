import { getAllProblemAdminListing } from "@/api/admin/problem-management";
import ProblemCard from "@/components/admin/ProblemCard";
import InputFiled from "@/components/common/Input";
import CustomPagination from "@/components/common/Pagination";
import SelectTag from "@/components/common/Select";
import { Button } from "@/components/ui/Button";
import type { IProblemListing, TLanguages } from "@/types/types";
import { LANGUAGES } from "@/utils/constants";
import { SORT_SELECT_1, SORT_SELECT_2 } from "@/utils/constants-admin";
import { toastifyOptionsCenter } from "@/utils/toastify.options";
import {
  Edit,
  Eye,
  EyeOff,
  MoveRight,
  PlusCircleIcon,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

const ProblemManagement: React.FC = () => {
  const [search, setSearch] = useState("");
  const [problems, setProblems] = useState<IProblemListing[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedSort, setSort] = useState<string>("OLDEST");
  const [itemsPerPage, setItemsPerPage] = useState<string>("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [refetch,setRefetch] = useState(false)

  const navigate = useNavigate();

  useEffect(() => {
    const searchQuery = searchParams.get("search");
    if (searchQuery && search === "") {
      setSearch(searchQuery);
      return;
    }

    async function fetchAllProblems() {
      try {
        const res = await getAllProblemAdminListing(
          search,
          selectedSort,
          String(currentPage)
        );
        setProblems(res.data.problems);
        setTotalPages(res.data.totalPages);
      } catch (error) {
        toast.error("Something went wrong", toastifyOptionsCenter);
      }
    }
    fetchAllProblems();
  }, [search, selectedSort, currentPage,refetch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setSearchParams((prevParams) => ({
      ...Object.fromEntries(prevParams.entries()),
      search: e.target.value,
    }));
  };
  const handleSortChange = (value: string) => {
    setSort(value);
  };

 

  return (
    <>
      <div className="w-full flex flex-col  gap-5 ">
        <div className="shadow-md sm:w-full w-[100%] p-3 bg-gray-50 rounded-md h-fit flex flex-col gap-4">
          <h1 className="text-2xl font-semibold px-2">Manage Problems</h1>
          <InputFiled
            className="border-gray-300"
            placeholder="Search Users"
            name="search"
            handleChange={handleSearchChange}
            value={search}
          />
          <div className="flex justify-between w-full gap-4  ">
            <div className="flex flex-grow sm:flex-none   sm:w-60">
              <SelectTag
                options={SORT_SELECT_2}
                placeholder="Sort By"
                label="Sort"
                name="sort"
                handleChange={handleSortChange}
                value={selectedSort}
              />
            </div>

            <Button
              className="text-xs flex justify-center items-center "
              size={"sm"}
              onClick={() => navigate("/admin/manage-problems/add")}
            >
              <span className="pt-1">Add Problem</span>
              <PlusCircleIcon />{" "}
            </Button>
          </div>
        </div>
        <div className=" grid xl:grid-cols-4  lg:grid-cols-3  gap-4 sm:grid-cols-1 md:grid-cols-2 grid-cols-1  rounded-md ">
          {problems.length !== 0 ? (
            problems.map((p) => <ProblemCard key={p.id} problem={p} refetch={setRefetch} />)
          ) : (
            <div className="col-span-4 p-8">
              <p className="text-center">No Problems Found</p>
            </div>
          )}
        </div>
        <div className="flex justify-center w-full">
          <CustomPagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            className="justify-center"
          />
        </div>
      </div>
    </>
  );
};

export default ProblemManagement;
