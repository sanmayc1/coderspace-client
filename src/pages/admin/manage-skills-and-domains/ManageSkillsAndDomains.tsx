import {
  createDomain,
  createSkill,
  deleteDomain,
  deleteSkill,
  getAllDomains,
} from '@/api/admin/skill-and-domain-management';
import { getAllSkills } from '@/api/common/common.api';
import SkillsAndDomainCapsule from '@/components/admin/SkillsAndDomainCapsule';
import InputFiled from '@/components/common/Input';
import { Button } from '@/components/ui/Button';
import type { IDomain, ISkill } from '@/types/types';
import { toastifyOptionsCenter } from '@/utils/toastify.options';
import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const ManageSkillsAndDomains: React.FC = () => {
  const [data, setData] = useState({ skill: '', domain: '' });
  const [errors, setErrors] = useState({ skill: '', domain: '' });
  const [skills, setSkills] = useState<ISkill[]>([]);
  const [domains, setDomains] = useState<IDomain[]>([]);
  const [refetch, setRefetch] = useState(false);
  const [deleting, setDeleting] = useState(false);

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
        console.log(res);
        setSkills(res.data.skills);
      } catch (error) {
        toast.error('Something Went Wrong', toastifyOptionsCenter);
      }
    }
    fetchAllDomains();
    fetchAllSkills();
  }, [refetch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setData((prev) => ({ ...prev, [name]: value }));
  };

  const addDomain = async () => {
    if (!data.domain.trim()) {
      setErrors((prev) => ({ ...prev, domain: 'Please Enter Domain' }));
      return;
    }
    setErrors((prev) => ({ ...prev, domain: '' }));

    try {
      await createDomain({ title: data.domain });
      toast.success('Domain Added', toastifyOptionsCenter);
      setRefetch((prev) => !prev);
      setData((prev) => ({ ...prev, domain: '' }));
    } catch (error) {
      if (error instanceof AxiosError) {
        setErrors((prev) => ({
          ...prev,
          domain: error.response?.data.errors[0].error,
        }));
        return;
      }
      toast.error('Something Went wrong', toastifyOptionsCenter);
    }
  };

  const addSkill = async () => {
    if (!data.skill.trim()) {
      setErrors((prev) => ({ ...prev, skill: 'Please Enter Skill' }));
      return;
    }
    setErrors((prev) => ({ ...prev, skill: '' }));

    try {
      await createSkill({ title: data.skill });
      toast.success('Skill Added', toastifyOptionsCenter);
      setRefetch((prev) => !prev);
      setData((prev) => ({ ...prev, skill: '' }));
    } catch (error) {
      if (error instanceof AxiosError) {
        setErrors((prev) => ({
          ...prev,
          skill: error.response?.data.errors[0].error,
        }));
        return;
      }
      toast.error('Something Went wrong', toastifyOptionsCenter);
    }
  };

  const removeDomain = async (id: string) => {
    try {
      if (deleting) return;
      setDeleting(true);
      await deleteDomain(id);
      toast.success('Domain Deleted', toastifyOptionsCenter);
      setRefetch((prev) => !prev);
      setDeleting(false);
    } catch (error) {
      setDeleting(false);
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.errors[0].error, toastifyOptionsCenter);
      }
    }
  };

  const removeSkill = async (id: string) => {
    try {
      if (deleting) return;
      setDeleting(true);
      await deleteSkill(id);
      toast.success('Skill Deleted', toastifyOptionsCenter);
      setRefetch((prev) => !prev);
      setDeleting(false);
    } catch (error) {
      setDeleting(false);
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.errors[0].error, toastifyOptionsCenter);
      }
    }
  };

  return (
    <div className="w-full flex flex-col  gap-5 ">
      <div className="shadow-md sm:w-full w-[100%] p-3 bg-gray-50 rounded-md h-fit flex flex-col gap-4">
        <h1 className="text-2xl font-semibold px-2">Manage Skills & Domain</h1>

        <div className="p-5 flex gap-10">
          <div className="flex flex-col gap-1">
            <h2 className="font-semibold text-sm">Skill</h2>
            <div className="flex  gap-3 items-start">
              <InputFiled
                className="border-gray-300"
                placeholder="Skill"
                name="skill"
                handleChange={handleChange}
                value={data.skill}
                error={errors.skill}
              />
              <Button size={'sm'} className="pt-1" onClick={addSkill}>
                Add
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <h2 className="font-semibold text-sm">Domain</h2>
            <div className="flex  gap-3 items-start">
              <InputFiled
                className="border-gray-300"
                placeholder="Domain"
                name="domain"
                handleChange={handleChange}
                value={data.domain}
                error={errors.domain}
              />
              <Button size={'sm'} className="pt-1" onClick={addDomain}>
                Add
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-3 bg-white shadow-md rounded-md">
        <div className="grid sm:grid-cols-2 grid-cols-1">
          <div className="p-3 ">
            <h3 className="font-semibold pb-2">Skills</h3>
            <div className="p-5 border rounded-md flex flex-wrap gap-4">
              {skills.map((s) => (
                <SkillsAndDomainCapsule
                  key={s.id}
                  deleteFn={removeSkill}
                  id={s.id}
                  title={s.title}
                />
              ))}
            </div>
          </div>
          <div className="p-3 ">
            <h3 className="font-semibold pb-2">Domains</h3>
            <div className="p-5 border rounded-md flex flex-wrap gap-4">
              {domains.map((d) => (
                <SkillsAndDomainCapsule deleteFn={removeDomain} id={d.id} title={d.title} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageSkillsAndDomains;
