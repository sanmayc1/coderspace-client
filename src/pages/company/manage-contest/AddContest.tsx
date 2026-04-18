import { getAllDomains } from '@/api/admin/skill-and-domain-management';
import { getAllSkills } from '@/api/common/common.api';
import { createContest, getAllAvailableProblems } from '@/api/company/company';
import SkillsAndDomainCapsule from '@/components/admin/SkillsAndDomainCapsule';
import InputFiled from '@/components/common/input';
import SelectTag from '@/components/common/select';
import TextArea from '@/components/common/Textarea';
import { Button } from '@/components/ui/button';
import type { IContestError, IContestState, IDomain, IReward, ISkill } from '@/types/types';
import { toastifyOptionsCenter } from '@/utils/toastify.options';
import { createContestSchema } from '@/utils/validation/company-validation';
import { Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { v4 as uuid } from 'uuid';

const AddContest: React.FC = () => {
  const [data, setData] = useState<IContestState>({
    title: '',
    description: '',
    dateAndTime: '',
    duration: '',
    visibility: '',
    domain: '',
    skill: '',
    problem: '',
    constrain: '',
    difficulty: '',
    rewardRank: '',
    rewardDescription: '',
  });

  const [error, setError] = useState<IContestError>({
    title: '',
    description: '',
    dateAndTime: '',
    duration: '',
    visibility: '',
    domain: '',
    skill: '',
    problem: '',
    rewardRank: '',
    rewardDescription: '',
    rewards: '',
  });

  const [skills, setSkills] = useState<ISkill[]>([]);
  const [domains, setDomains] = useState<IDomain[]>([]);
  const [availableProblems, setAvailableProblems] = useState<{ id: string; title: string }[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<ISkill[]>([]);
  const [selectedProblems, setSelectedProblems] = useState<{ id: string; title: string }[]>([]);
  const [rewards, setRewards] = useState<IReward[]>([]);
  const [showSkillsProblemsError, setShowSkillsProblemsError] = useState(false); // <--- added
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchAllDomains() {
      try {
        const res = await getAllDomains();
        setDomains(res.data.domains);
      } catch (error) {
        toast.error('Something Went Wrong', toastifyOptionsCenter);
      }
    }
    async function fetchAllSkills() {
      try {
        const res = await getAllSkills();
        setSkills(res.data.skills);
      } catch (error) {
        toast.error('Something Went Wrong', toastifyOptionsCenter);
      }
    }

    async function fetchAllProblems() {
      const res = await getAllAvailableProblems();
      setAvailableProblems(res.problems);
    }
    fetchAllDomains();
    fetchAllSkills();
    fetchAllProblems();
  }, []);

  // Helper: validate a single field with current state and set error.
  function validateField(
    newValue: any,
    fieldName: string,
    overrideData?: Partial<IContestState>
  ): string {
    let newData = { ...data, ...overrideData, [fieldName]: newValue };
    let body = {
      ...newData,
      skills: selectedSkills,
      problems: selectedProblems,
      rewards,
    };
    const res = createContestSchema.safeParse(body);
    if (res.success) return '';

    for (let er of res.error.issues) {
      const path = er.path[0];
      // Don't show array validation error *unless array is not empty* -- instead, show our own message below.
      if (fieldName === 'skill' && path === 'skills') return '';
      if (fieldName === 'problem' && path === 'problems') return '';
      if (fieldName === path) return er.message;
      if (fieldName === 'rewards' && path === 'rewards') return er.message;
      if (fieldName === 'rewardRank' && path === 'rewardRank') return er.message;
      if (fieldName === 'rewardDescription' && path === 'rewardDescription') return er.message;
    }
    return '';
  }

  // --- Handlers ---
  const handleChangeInputField = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let v = value;
    if (type === 'number') v = value.replace(/^0+/, '');

    setData((prev) => {
      const newData = { ...prev, [name]: v };
      setError((prevError) => ({
        ...prevError,
        [name]: validateField(v, name),
      }));
      return newData;
    });
  };

  const handleChangeOtherTag = (v: string | undefined | boolean, name: string) => {
    setData((prev) => {
      let newData = { ...prev };
      if (name === 'visibility' || name === 'domain' || name === 'skill' || name === 'problem') {
        newData[name as keyof IContestState] = v as string;
      } else {
        newData[name as keyof IContestState] = v as any;
      }
      setError((prevError) => ({
        ...prevError,
        [name]: validateField(v, name, newData),
      }));
      return newData;
    });
  };

  // --- Skills ---
  const addSkills = () => {
    if (!data.skill) return;
    const exists = selectedSkills.find((s) => s.id === data.skill);
    if (exists) {
      toast.error(`${exists.title} already added`, toastifyOptionsCenter);
      return;
    }
    const skill = skills.find((s) => s.id === data.skill);
    if (skill) {
      const newSkills = [...selectedSkills, skill];
      setSelectedSkills(newSkills);
    }
    setData((prev) => ({ ...prev, skill: '' }));
  };

  const removeSkill = (id: string) => {
    setSelectedSkills((prev) => prev.filter((s) => s.id !== id));
  };

  // --- Problems ---
  const addProblem = () => {
    if (!data.problem) return;
    const exists = selectedProblems.find((p) => p.id === data.problem);
    if (exists) {
      toast.error(`${exists.title} already added`, toastifyOptionsCenter);
      return;
    }
    const problem = availableProblems.find((p) => p.id === data.problem);
    if (problem) {
      setSelectedProblems((prev) => [...prev, problem]);
    }
    setData((prev) => ({ ...prev, problem: '' }));
  };

  const removeProblem = (id: string) => {
    setSelectedProblems((prev) => prev.filter((p) => p.id !== id));
  };

  // --- Rewards ---
  const handleRewardInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prev) => {
      const newData = { ...prev, [name]: value };
      setError((prevError) => ({
        ...prevError,
        [name]: validateField(value, name, newData),
      }));
      return newData;
    });
  };

  const addReward = () => {
    let rewardRankError = validateField(data.rewardRank, 'rewardRank');
    let rewardDescriptionError = validateField(data.rewardDescription, 'rewardDescription');
    // fallback for empty
    if (!data.rewardRank.trim()) rewardRankError = 'Rank is required';
    if (!data.rewardDescription.trim()) rewardDescriptionError = 'Description is required';

    if (rewardRankError || rewardDescriptionError) {
      setError((prev) => ({
        ...prev,
        rewardRank: rewardRankError,
        rewardDescription: rewardDescriptionError,
      }));
      return;
    }
    setError((prev) => ({
      ...prev,
      rewardRank: '',
      rewardDescription: '',
    }));

    setRewards((prev) => {
      const newRewards = [
        ...prev,
        {
          id: uuid(),
          rank: data.rewardRank,
          description: data.rewardDescription,
        },
      ];
      // Validate rewards (array) live after add
      const rError = validateField('', 'rewards');
      setError((errPrev) => ({
        ...errPrev,
        rewards: rError,
      }));
      return newRewards;
    });
    setData((prev) => ({
      ...prev,
      rewardRank: '',
      rewardDescription: '',
    }));
  };

  const removeReward = (id: string) => {
    const newRewards = rewards.filter((r) => r.id !== id);
    setRewards(newRewards);
    // Validate rewards (array) live after remove
    const rError = validateField('', 'rewards');
    setError((prev) => ({
      ...prev,
      rewards: rError,
    }));
  };

  // Helper for proper "need at least one" warning for skills/problems
  const getSkillWarning = () =>
    selectedSkills.length === 0 ? 'At least one skill is required' : '';
  const getProblemWarning = () =>
    selectedProblems.length === 0 ? 'At least one problem is required' : '';

  const handleSubmit = async () => {
    setShowSkillsProblemsError(true); // <--- show the errors now
    let submitErrors: IContestError = {
      title: '',
      description: '',
      dateAndTime: '',
      duration: '',
      visibility: '',
      domain: '',
      skill: '',
      problem: '',
      rewardRank: '',
      rewardDescription: '',
      rewards: '',
    };

    // Manual skills/problems check for empty, instead of validator
    if (selectedSkills.length === 0) submitErrors.skill = 'At least one skill is required';
    if (selectedProblems.length === 0) submitErrors.problem = 'At least one problem is required';

    const body = {
      ...data,
      skills: selectedSkills,
      problems: selectedProblems,
      rewards,
    };

    const result = createContestSchema.safeParse(body);

    if (!result.success) {
      result.error.issues.forEach((er) => {
        const key = er.path[0] as keyof IContestError;
        if (key in submitErrors) {
          if (er.path[0] === 'skills') {
            // ignore if already have empty error (overridden)
            if (!submitErrors.skill) submitErrors.skill = er.message;
          } else if (er.path[0] === 'problems') {
            if (!submitErrors.problem) submitErrors.problem = er.message;
          } else if (er.path[0] === 'rewards') {
            submitErrors.rewards = er.message;
          } else if (er.path[0] === 'rewardRank') {
            submitErrors.rewardRank = er.message;
          } else if (er.path[0] === 'rewardDescription') {
            submitErrors.rewardDescription = er.message;
          } else {
            (submitErrors[key] as string) = er.message;
          }
        }
      });
    }

    setError(submitErrors);

    // If any errors exist, don't submit
    const hasError = Object.values(submitErrors).some((v) => !!v);
    if (hasError) return;

    const dateAndTime = new Date(data.dateAndTime);
    try {
      const contestBody = {
        title: data.title,
        description: data.description,
        dateAndTime: dateAndTime.toString(),
        duration: Number(data.duration),
        visibility: data.visibility,
        domain: data.domain,
        problems: selectedProblems.map((p) => p.id),
        skills: selectedSkills.map((s) => s.id),
        rewards: rewards.map((r) => ({
          rank: Number(r.rank),
          description: r.description,
        })),
      };
      // API submit
      await createContest(contestBody);
      toast.success('Contest Created!', toastifyOptionsCenter);
      navigate(`/company/manage-contest?search=${contestBody.title}`);
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong', toastifyOptionsCenter);
    }
  };

  const getNow = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  return (
    <>
      <div className="flex flex-col gap-4 ">
        <div className=" bg-white shadow-sm rounded-md grid grid-flow-col grid-cols-3  justify-center items-center">
          <div className="flex px-5 justify-start">
            <Button variant={'ghost'} onClick={() => navigate('/company/manage-contest')}>
              Back
            </Button>
          </div>
          <h1 className="text-xl text-center p-3">Add Contest</h1>
        </div>
        <div className="w-full p-6 bg-white shadow-md rounded-md flex flex-col gap-9">
          <form className="space-y-4" autoComplete="off">
            <InputFiled
              label="Title"
              placeholder="Problem Title"
              name="title"
              value={data.title}
              error={error.title}
              handleChange={handleChangeInputField}
            />
            <TextArea
              label="Description"
              name="description"
              placeholder="Description of the problem "
              error={error.description}
              value={data.description}
              handleChange={handleChangeInputField}
            />
            <InputFiled
              type="datetime-local"
              min={getNow()}
              placeholder="Select Date and Time"
              label="Date and time"
              value={data.dateAndTime}
              handleChange={handleChangeInputField}
              name="dateAndTime"
              error={error.dateAndTime}
            />
            <InputFiled
              type="number"
              placeholder="Enter Duration in minutes"
              label="Duration"
              name="duration"
              value={data.duration}
              error={error.duration}
              handleChange={handleChangeInputField}
            />

            <div className="flex flex-col gap-4">
              <div className="flex items-end gap-4">
                <SelectTag
                  options={availableProblems.map((p) => ({
                    label: p.title,
                    value: p.id,
                  }))}
                  placeholder="Select Problem"
                  label="Problem"
                  head="Problem"
                  name="problem"
                  value={data.problem}
                  handleChange={(v) => handleChangeOtherTag(v, 'problem')}
                />
                <Button size={'sm'} type="button" className="pt-1 mb-1" onClick={addProblem}>
                  Add Problem
                </Button>
              </div>
              <div
                className={`border ${
                  showSkillsProblemsError && error.problem && 'border-red-400'
                } px-3 py-2 border-gray-200 flex flex-wrap rounded-md w-full gap-3 min-h-28`}
              >
                {selectedProblems.map((v) => {
                  return (
                    <SkillsAndDomainCapsule
                      key={v.id}
                      id={v.id}
                      title={v.title}
                      deleteFn={removeProblem}
                    />
                  );
                })}
              </div>
            </div>

            {showSkillsProblemsError && getProblemWarning() && (
              <span className="text-xs pt-1 pl-1 text-red-400">{getProblemWarning()}</span>
            )}

            {showSkillsProblemsError && error.problem && !getProblemWarning() && (
              <span className="text-xs pt-1 pl-1 text-red-400">{error.problem}</span>
            )}

            <div className="flex flex-col gap-4">
              <div className="flex items-end gap-4">
                <SelectTag
                  options={skills.map((s) => ({
                    label: s.title.charAt(0).toUpperCase() + s.title.slice(1),
                    value: s.id,
                  }))}
                  placeholder="Select Skill"
                  label="Skills"
                  head="Skills"
                  name="skill"
                  value={data.skill}
                  handleChange={(v) => handleChangeOtherTag(v, 'skill')}
                ></SelectTag>
                <Button size={'sm'} type="button" className="pt-1 mb-1" onClick={addSkills}>
                  Add Skill
                </Button>
              </div>
              <div
                className={`border ${
                  showSkillsProblemsError && error.skill && 'border-red-400'
                } px-3 py-2 border-gray-200 flex flex-wrap rounded-md w-full gap-3 min-h-28`}
              >
                {selectedSkills.map((v) => {
                  return (
                    <SkillsAndDomainCapsule
                      key={v.id}
                      id={v.id}
                      title={v.title}
                      deleteFn={removeSkill}
                    />
                  );
                })}
              </div>
            </div>

            {showSkillsProblemsError && getSkillWarning() && (
              <span className="text-xs pt-1 pl-1 text-red-400">{getSkillWarning()}</span>
            )}

            {showSkillsProblemsError && error.skill && !getSkillWarning() && (
              <span className="text-xs pt-1 pl-1 text-red-400">{error.skill}</span>
            )}

            <SelectTag
              options={domains.map((d) => ({
                label: d.title.charAt(0).toUpperCase() + d.title.slice(1),
                value: d.id,
              }))}
              placeholder="Select Domain"
              label="Domain"
              head="Domain"
              name="domain"
              value={data.domain}
              error={error.domain}
              handleChange={(v) => handleChangeOtherTag(v, 'domain')}
            ></SelectTag>
            <SelectTag
              options={[
                { label: 'Public', value: 'public' },
                { label: 'Private', value: 'private' },
              ]}
              placeholder="Select Visibility"
              label="Visibility"
              head="Visibility"
              name="visibility"
              value={data.visibility}
              error={error.visibility}
              handleChange={(v) => handleChangeOtherTag(v, 'visibility')}
            ></SelectTag>

            <p className="text-gray-900 pl-1 text-sm">Rewards</p>
            <div className="flex flex-col sm:items-center sm:flex-row gap-5">
              <div className="flex flex-col sm:items-center sm:flex-row  gap-4 p-2">
                <InputFiled
                  label="Rank"
                  placeholder="Enter the rank of reward"
                  name="rewardRank"
                  type="number"
                  error={error.rewardRank}
                  value={data.rewardRank}
                  handleChange={handleRewardInputChange}
                />
                <InputFiled
                  label="Description"
                  placeholder="Get an offer letter"
                  name="rewardDescription"
                  value={data.rewardDescription}
                  error={error.rewardDescription}
                  handleChange={handleRewardInputChange}
                />
              </div>
              <Button size={'sm'} type="button" className="pt-1 mb-1" onClick={addReward}>
                Add
              </Button>
            </div>
            <div
              className={`bg-white border ${
                error.rewards && 'border-red-400'
              } rounded-md p-4 min-h-32 shadow-sm max-w-full`}
            >
              <div className="grid grid-cols-4 gap-4">
                {rewards.map((re) => (
                  <section
                    key={re.id}
                    className="border group rounded p-3 gap-3 flex flex-col bg-gray-50"
                  >
                    <div className=" justify-between  flex">
                      <p className="text-sm text-gray-700 ">Reward</p>
                      <Trash2
                        size={15}
                        className="text-red-500 hidden group-hover:block cursor-pointer"
                        onClick={() => removeReward(re.id)}
                      />
                    </div>
                    <p className="text-xs text-gray-500">Rank : {re.rank}</p>
                    <p className="text-xs text-gray-500">Description : {re.description}</p>
                  </section>
                ))}
              </div>
            </div>
            {error.rewards && (
              <span className="text-xs pt-1 pl-1 text-red-400">{error.rewards}</span>
            )}

            <div className="flex justify-end">
              <Button type="button" size={'lg'} onClick={handleSubmit}>
                Save
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddContest;
