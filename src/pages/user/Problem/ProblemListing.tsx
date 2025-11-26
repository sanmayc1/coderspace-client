import { getProblemsUser } from "@/api/user/user.problem";
import Table from "@/components/common/Table";
import type { IUserGetProblem } from "@/types/response.types";
import type { ISkill } from "@/types/types";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ProblemListing: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [problems, setProblems] = useState<IUserGetProblem[]>([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchAllProblems() {
      try {
        const res = await getProblemsUser(search, String(currentPage));
        setProblems(res.data.problems);
        setTotalPages(res.data.totalPages);
      } catch (error) {}
    }
    fetchAllProblems();
  }, [search, currentPage]);

  return (
    <div className="h-screen flex flex-col pt-40 items-center gap-8">
      <h1 className="text-3xl !font-[anybody-bold]">Problems</h1>

      <div className="border-2 rounded-md w-[75%] gap-5 flex items-center">
        <div className="flex justify-center  items-center p-2">
          <Search size={20} />
        </div>

        <input
          type="text"
          placeholder="Search Problems"
          className="w-full h-full border-0 outline-0"
          onChange={(e) => setSearch(e.target.value)}
          value={search}
        />
      </div>
      <Table
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
        columns={[
          { label: "#", key: "number" },
          {
            label: "Title",
            key: "title",
            render(value: string,item) {
              return (
                <p onClick={()=>navigate(`/problem/${item.id}`)} className="w-48">
                  {value.charAt(0).toUpperCase() + value.slice(1)}
                </p>
              );
            },
          },
          {
            label: "difficulty",
            key: "difficulty",
            render(value: string) {
              return <p>{value.charAt(0).toUpperCase() + value.slice(1)}</p>;
            },
          },
          {
            label: "Skills",
            key: "skills",
            render(value: ISkill[]) {
              return (
                <div className="flex gap-2">
                  {value.map((s) => (
                    <p className="p-1 border-2 rounded-md px-3" key={s.id}>
                      {s.title.charAt(0).toUpperCase() +
                        s.title.slice(1).toLowerCase()}
                    </p>
                  ))}
                </div>
              );
            },
          },
        ]}
        data={problems}
        className="w-[85%] border-1 shadow-md "
      />
    </div>
  );
};

export default ProblemListing;
