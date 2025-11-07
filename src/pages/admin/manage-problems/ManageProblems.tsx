import InputFiled from "@/components/common/Input";
import CustomPagination from "@/components/common/Pagination";
import SelectTag from "@/components/common/Select";
import { Button } from "@/components/ui/Button";
import { SORT_SELECT_1 } from "@/utils/constants-admin";
import {
  Edit,
  Eye,
  EyeOff,
  MoveRight,
  PlusCircleIcon,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ProblemManagement: React.FC = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedSort, setSort] = useState<string>("");
  const [itemsPerPage, setItemsPerPage] = useState<string>("");

  const navigate = useNavigate();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };
  const handleSortChange = (value: string) => {
    setSort(value);
  };
  const renderUserEdit = (_: string, item: any) => (
    <Button
      size="sm"
      className="text-xs pt-1"
      onClick={() => {
        alert("edit");
      }}
    >
      Edit
    </Button>
  );

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
                options={SORT_SELECT_1}
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
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <div className="p-5 bg-white group h-fit   rounded-2xl shadow-md flex  border-1   flex-col gap-3">
                <div className="flex justify-between items-center">
                  <p className="text-lg">
                    <span>1. </span>Two Sum
                  </p>
                  <div className="flex gap-3 items-center">
                    {i % 2 == 0 ? (
                      <Eye
                        className="opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer"
                        size={20}
                      />
                    ) : (
                      <EyeOff
                        className="opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer"
                        size={20}
                      />
                    )}
                    <Edit
                      size={20}
                      className="opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer"
                    />
                    <Trash2
                      size={20}
                      className="text-red-600 opacity-0 group-hover:opacity-100 transition-all duration-300  cursor-pointer"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3 ">
                  <SelectTag
                    handleChange={() => {}}
                    name="lan"
                    value=""
                    options={[
                      { label: "Javascript", value: "javascript" },
                      { label: "Java", value: "java" },
                    ]}
                    placeholder="Select Language"
                    label="Language"
                  />
                  <Button
                    className="text-xs flex justify-center items-center pt-1"
                    size={"sm"}
                  >
                    Add
                  </Button>
                </div>
                <div className="px-4 py-2 bg-gray-50  border-1  h-  flex flex-col gap-2 rounded-md">
                  {["Javascript", "Java", "Python", "C"].map((l) => (
                    <div
                      onClick={() =>
                        navigate(`/admin/manage-problems/language/${l}`)
                      }
                      className="bg-white hover:scale-105 transition-all duration-300  text-sm shadow-md py-2 px-3  rounded-md flex justify-between items-center border-1 cursor-pointer"
                    >
                      {l}
                      <span>
                        <MoveRight size={15} className="text-gray-500" />
                      </span>
                    </div>
                  ))}
                </div>
                <Button
                  onClick={() =>
                    navigate(`/admin/manage-problems/testcase/sdfsafd`)
                  }
                  className="hover:scale-105 transition-all duration-300  text-sm shadow-md py-2 px-3  rounded-md flex justify-center items-center border-1 cursor-pointer"
                >
                  Testcase
                </Button>
              </div>
            ))}
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
