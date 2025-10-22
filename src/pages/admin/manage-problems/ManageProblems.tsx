import InputFiled from "@/components/common/Input";
import SelectTag from "@/components/common/Select";
import Table from "@/components/common/Table";
import { Button } from "@/components/ui/Button";
import { SORT_SELECT_1 } from "@/utils/constants-admin";
import { PlusCircleIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ProblemManagement: React.FC = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedSort, setSort] = useState<string>("");
  const [itemsPerPage, setItemsPerPage] = useState<string>("");

  const navigate = useNavigate()

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };
  const handleSortChange = (value: string) => {
    setSort(value);
  };
  const renderUserEdit = (_value: string, item: any) => (
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
              onClick={()=>navigate("/admin/manage-problems/add")}
            >
              {" "}
              <span className="pt-1">Add Problem </span><PlusCircleIcon />{" "}
            </Button>
          </div>
        </div>

        <Table
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          setCurrentPage={setCurrentPage}
          setItemsPerPage={setItemsPerPage}
          totalPages={totalPages}
          columns={[
            { label: "No", key: "no" },
            { label: "Tittle", key: "title" },
            { label: "difficultty", key: "difficultty" },
            { label: "Submissions", key: "submissions" },
            { label: "status", key: "status" },
            { label: "Actions", key: "_id", render: renderUserEdit },
          ]}
          data={[
            {
              difficultty: "easy",
              no: "1",
              status: "Public",
              submissions: "1200",
              title: "Two sum",
              _id: "s",
            },
            {
              difficultty: "easy",
              no: "2",
              status: "Public",
              submissions: "1200",
              title: "Two sum",
              _id: "s",
            },
          ]}
        />
      </div>
    </>
  );
};

export default ProblemManagement;
