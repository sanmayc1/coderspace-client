import { getAllSkills } from '@/api/common/common.api';
import { getProblemsUser } from '@/api/user/user.problem';
import { useAppSelector } from '@/app/hooks/redux-custom-hook';
import SelectTag from '@/components/common/select';
import Table from '@/components/common/table';
import { Button } from '@/components/ui/button';
import type { IUserGetProblem } from '@/types/response.types';
import type { ISkill } from '@/types/types';
import { debounce } from '@/utils/debouncing';
import { toastifyOptionsCenter } from '@/utils/toastify.options';

import { LockKeyhole, LockKeyholeOpenIcon, Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const ProblemListing: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [problems, setProblems] = useState<IUserGetProblem[]>([]);
  const [search, setSearch] = useState('');
  const [skills, setSkills] = useState<ISkill[]>([]);
  const [selectedSkills, setSelectedSkills] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const debouncedFetchRef = useRef<ReturnType<typeof debounce> | null>(null);
  const auth = useAppSelector((state) => state.authReducer.auth);
  const isPremium = useAppSelector((state) => state.authReducer.isPremium);
  useEffect(() => {
    debouncedFetchRef.current = debounce(async function (
      search: string,
      currentPage: string,
      selectedDifficulty: string,
      selectedSkills: string
    ) {
      try {
        setLoading(true);
        const res = await getProblemsUser(
          search,
          String(currentPage),
          selectedDifficulty,
          selectedSkills
        );
        setProblems(res.data.problems);
        setTotalPages(res.data.totalPages);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
        toast.error('Something went wrong', toastifyOptionsCenter);
      }
    }, 500);

    return () => {
      debouncedFetchRef.current?.cancel();
    };
  }, []);

  useEffect(() => {
    async function fetchSkills() {
      try {
        const res = await getAllSkills();
        setSkills(res.data.skills);
      } catch (error) {
        console.log(error);

        toast.error('Something went wrong', toastifyOptionsCenter);
      }
    }
    fetchSkills();
  }, []);

  useEffect(() => {
    const s = searchParams.get('search') || '';
    const d = searchParams.get('difficulty') || '';
    const sk = searchParams.get('skill') || '';

    if (
      (s !== '' && search === '') ||
      (d !== '' && selectedDifficulty === '') ||
      (sk !== '' && selectedSkills === '')
    ) {
      setSearch(s);
      setSelectedDifficulty(d);
      setSelectedSkills(sk);
      return;
    }
    debouncedFetchRef.current?.(search, String(currentPage), selectedDifficulty, selectedSkills);
  }, [search, currentPage, selectedDifficulty, selectedSkills]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setSearchParams((prevParams) => {
      return {
        ...Object.fromEntries(prevParams.entries()),
        search: e.target.value,
      };
    });
  };

  const handleDifficultyChange = (value: string) => {
    setSelectedDifficulty(value);
    setSearchParams((prevParams) => {
      return {
        ...Object.fromEntries(prevParams.entries()),
        difficulty: value,
      };
    });
  };

  const handleSkillChange = (value: string) => {
    setSelectedSkills(value);
    setSearchParams((prevParams) => {
      return {
        ...Object.fromEntries(prevParams.entries()),
        skill: value,
      };
    });
  };

  const handleClearFilters = () => {
    setSearchParams({});
    setTimeout(() => {
      setSearch('');
      setSelectedDifficulty('');
      setSelectedSkills('');
    }, 100);
  };

  const navigateToProblemDetailsPage = (item: IUserGetProblem) => {
    if (item.premium) {
      if (!auth) {
        navigate(`/user/login`);
        return;
      }
      if (!isPremium) {
        navigate(`/user/upgrade`);
        return;
      }
    }
    navigate(`/problem/${item.id}`);
  };

  return (
    <div className="min-h-screen flex flex-col py-40 items-center gap-8">
      <h1 className="text-3xl !font-[anybody-bold]">Problems</h1>

      <div className="border-2 rounded-md w-[75%] gap-5 flex items-center">
        <div className="flex justify-center  items-center p-2">
          <Search size={20} />
        </div>

        <input
          type="text"
          placeholder="Search Problems"
          className="w-full h-full border-0 outline-0"
          onChange={handleSearchChange}
          value={search}
        />
      </div>
      <div className="w-[50%] flex justify-center items-end gap-7">
        <SelectTag
          options={[
            { label: 'Easy', value: 'easy' },
            { label: 'Medium', value: 'medium' },
            { label: 'Hard', value: 'hard' },
          ]}
          handleChange={handleDifficultyChange}
          label="Difficulty"
          name="difficulty"
          placeholder="Difficulty"
          value={selectedDifficulty}
        />

        <SelectTag
          options={skills.map((skill) => ({
            label: skill.title.charAt(0).toUpperCase() + skill.title.slice(1),
            value: skill.id,
          }))}
          handleChange={handleSkillChange}
          label="skill"
          name="skill"
          placeholder="Skill"
          value={selectedSkills}
        />

        <Button onClick={handleClearFilters}>Clear Filters</Button>
      </div>
      <Table
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
        columnClick={navigateToProblemDetailsPage}
        loading={loading}
        columns={[
          { label: '#', key: 'number' },
          {
            label: 'Title',
            key: 'title',
            render(value: string, item) {
              return (
                <p onClick={() => navigate(`/problem/${item.id}`)} className="w-48">
                  {value.charAt(0).toUpperCase() + value.slice(1)}
                </p>
              );
            },
          },
          {
            label: 'difficulty',
            key: 'difficulty',
            render(value: string) {
              return <p>{value.charAt(0).toUpperCase() + value.slice(1)}</p>;
            },
          },
          {
            label: 'Skills',
            key: 'skills',
            render(value: ISkill[]) {
              return (
                <div className="flex gap-2">
                  {value.map((s) => (
                    <p className="p-1 border-2 rounded-md px-3" key={s.id}>
                      {s.title.charAt(0).toUpperCase() + s.title.slice(1).toLowerCase()}
                    </p>
                  ))}
                </div>
              );
            },
          },
          {
            label: '',
            key: 'premium',
            render(value: boolean) {
              return (
                <p>
                  {value ? (
                    isPremium ? (
                      <LockKeyholeOpenIcon color="orange" size={20} />
                    ) : (
                      <LockKeyhole color="orange" size={20} />
                    )
                  ) : (
                    ''
                  )}
                </p>
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
