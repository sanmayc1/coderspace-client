import { getUser } from '@/api/user/user.profile';
import { useAppDispatch, useAppSelector } from '@/app/hooks/redux-custom-hook';
import LoadingSpin from '@/components/common/LoadingSpin';
import { Button } from '@/components/ui/Button';
import type { IErrorResponse } from '@/types/response.types';
import { toastifyOptionsCenter } from '@/utils/toastify.options';
import type { AxiosError } from 'axios';
import { Settings } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import SettingsModal from '@/components/user/SettingsModal';
import EditProfileModal from '@/components/user/EditProfileModal';
import { updateProfileUrl } from '@/app/redux-slice/authReducer';

export interface IUserState {
  id: string;
  name: string;
  username: string;
  xpCoin: number;
  currentLevel: number;
  currentBadge: string;
  accountId: string;
  about?: string;
  premiumActive: boolean;
  skills: any[];
  profileUrl: string;
  auth: string;
  followers: number;
  following: number;
}

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<IUserState>();
  const [isLoading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('Overview');
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isSettingsModalOpen, setSettingsModalOpen] = useState(false);
  const [refetch, setRefetch] = useState(false);
  const profileUrl = useAppSelector((s) => s.authReducer.profileUrl) || '/defaultProfile.jpg';
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const userProfile = await getUser();
        setUser(userProfile.data?.data as IUserState);
        setLoading(false);
        if (profileUrl !== userProfile.data.data.profileUrl) {
          dispatch(updateProfileUrl(userProfile.data.data.profileUrl));
        }
      } catch (error) {
        setLoading(false);
        const axiosError = error as AxiosError<IErrorResponse>;
        toast.error(axiosError.response?.data?.message, toastifyOptionsCenter);
      }
    };
    fetchUser();
  }, [refetch]);

  const handleEditOpen = () => {
    if (user) {
      setEditModalOpen(true);
    }
  };

  if (isLoading) {
    return (
      <div className="inset-0 flex min-h-screen justify-center items-center">
        <LoadingSpin size={35} />
      </div>
    );
  }
  return (
    <div className="min-h-screen flex flex-col px-32 font-[anybody-regular] mb-10">
      <div className="h-32"></div>
      {/* first content */}
      <div className="h-52 flex gap-5">
        {/* left */}
        <div className="h-full flex items-center gap-5">
          <img
            src={user?.profileUrl || '/defaultProfile.jpg'}
            alt="profile"
            className="h-40  w-40 border  rounded-full object-cover object-center "
          />
          <div className="flex flex-col gap-10">
            <p className="flex flex-col gap-1">
              <span className="text-3xl font-bold select-none ">
                {(user?.name?.charAt(0).toUpperCase() as string) + user?.name?.slice(1)}
              </span>
              <span className="text-gray-600 font-semibold pl-2 select-none ">
                {user?.username}
              </span>
            </p>
            <Button size={'sm'} className="cursor-pointer" onClick={handleEditOpen}>
              Edit Profile
            </Button>
          </div>
        </div>
        {/* right */}
        <div className="flex flex-grow flex-col h-full">
          {/* top */}
          <div className=" h-1/2 flex items-center justify-between ">
            <Button
              variant="outline"
              className="rounded-xl  w-32 border-amber-500 text-amber-500 cursor-pointer"
            >
              Upgrade
            </Button>
            {/* settings ,logout ,xp */}
            <div className="px-14 flex items-center gap-4  ">
              <p className="px-2 py-1 flex gap-1 border-1 border-black rounded-full font-semibold cursor-pointer items-center justify-center">
                <img src="/coin.png" className="w-7 h-7" alt="xp-coin" /> {user?.xpCoin} Xp
              </p>
              <Settings className="cursor-pointer" onClick={() => setSettingsModalOpen(true)} />
            </div>
          </div>
          {/* bottom */}
          <div className="h-1/2 flex justify-center gap-32 items-center">
            <div className="flex flex-col items-center">
              <p className="text-xl font-bold select-none">900</p>
              <p className="select-none font-semibold text-gray-700 opacity-75">Problems Solved</p>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-xl font-bold select-none">{user?.following}</p>
              <p className="select-none font-semibold text-gray-700 opacity-75">Following</p>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-xl font-bold select-none">{user?.followers}</p>
              <p className="select-none font-semibold text-gray-700 opacity-75">Followers</p>
            </div>
          </div>
        </div>
      </div>
      {/* second content */}
      <div className="w-full px-12 mt-36 mb-16 font-['anybody-bold'] ">
        <div className="relative w-full h-2 bg-gray-200 rounded-full">
          {/* Progress */}

          <div
            className="absolute top-0 left-0 h-full bg-black rounded-full transition-all duration-500 flex justify-end "
            style={{ width: `${Math.min(user?.currentLevel || 0, 100)}%` }}
          >
            <span
              className="font-semibold text-lg pt-10 text-nowrap
            "
            >
              Level {user?.currentLevel}
            </span>
          </div>

          {/* Silver Node */}
          <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2">
            {/* Marker */}
            <div className="w-5 h-5 bg-black rotate-45 transform"></div>

            {/* Top Section */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-6 flex flex-col items-center w-max">
              <img
                src="/silver.png"
                alt="Silver"
                className={`w-14 h-16 object-contain mb-2 ${
                  user?.currentLevel && user.currentLevel < 0 ? 'opacity-50 grayscale' : ''
                }`}
              />
              <span className="font-bold text-xl">Silver</span>
            </div>
          </div>

          {/* Gold Node */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div
              className={`w-5 h-5 rotate-45 transform ${
                user?.currentLevel && user.currentLevel >= 50 ? 'bg-black' : 'bg-gray-200'
              }`}
            ></div>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-6 flex flex-col items-center w-max">
              <img
                src="/gold.png"
                alt="Gold"
                className={`w-14 h-16 object-contain mb-2 ${
                  user?.currentLevel && user.currentLevel >= 50 ? '' : 'opacity-50 grayscale'
                }`}
              />
              <span
                className={`font-bold text-xl ${
                  user?.currentLevel && user.currentLevel >= 50 ? '' : 'text-gray-400'
                }`}
              >
                Gold
              </span>
            </div>
          </div>

          {/* Platinum Node */}
          <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2">
            <div
              className={`w-5 h-5 rotate-45 transform ${
                user?.currentLevel && user.currentLevel >= 100 ? 'bg-black' : 'bg-gray-200'
              }`}
            ></div>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-6 flex flex-col items-center w-max">
              <img
                src="/platinum.png"
                alt="Platinum"
                className={`w-14 h-16 object-contain mb-2 ${
                  user?.currentLevel && user.currentLevel >= 100 ? '' : 'grayscale opacity-50'
                }`}
              />
              <span
                className={`font-bold text-xl ${
                  user?.currentLevel && user.currentLevel >= 100 ? '' : 'text-gray-400'
                }`}
              >
                Platinum
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-gray-200 mt-10 mb-8 flex gap-8 ">
        {['Overview', 'Submissions', 'Contests'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-lg font-medium transition-colors relative ${
              activeTab === tab
                ? 'text-black border-b-2 border-black -mb-[2px]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-3 gap-8">
        {/* Left Column (2/3 width) */}
        <div className="col-span-2 flex flex-col gap-8">
          {/* About Card */}
          <div className="border border-gray-300 rounded-lg p-6 relative">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold">About</h3>
            </div>
            <p className="text-gray-700 leading-relaxed text-sm">
              {user?.about || <span className="text-gray-500">No about added yet.</span>}
            </p>
          </div>

          {/* Skills Card */}
          <div className="border border-gray-300 rounded-lg p-6 h-64">
            <h3 className="text-xl font-bold mb-6">Skills</h3>
            <div className="flex flex-wrap gap-3">
              {user?.skills && user.skills.length > 0 ? (
                user.skills.map((skill: any, idx: number) => (
                  <span
                    key={idx}
                    className="border border-gray-300 rounded-full px-6 py-2 text-sm text-gray-800 font-medium"
                  >
                    {typeof skill === 'string' ? skill : skill.name || 'Skill'}
                  </span>
                ))
              ) : (
                <div className="flex gap-3">
                  <span className="border border-gray-300 rounded-full px-6 py-2 text-sm text-gray-800 font-medium">
                    Array
                  </span>
                  <span className="border border-gray-300 rounded-full px-6 py-2 text-sm text-gray-800 font-medium">
                    Strings
                  </span>
                  <span className="border border-gray-300 rounded-full px-6 py-2 text-sm text-gray-800 font-medium">
                    Dynamic Programming
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column (1/3 width) */}
        <div className="col-span-1 mb-5">
          {/* Top Languages Card */}
          <div className="border border-gray-300 rounded-lg p-6 h-full min-h-[300px] flex flex-col">
            <h3 className="text-xl font-bold mb-8">Top Languages</h3>

            <div className="flex-grow flex flex-col items-center justify-center gap-8">
              {/* Donut Chart */}
              <div
                className="w-40 h-40 rounded-full relative"
                style={{
                  background: 'conic-gradient(#6b7280 0% 35%, #9ca3af 35% 100%)',
                }}
              >
                <div className="absolute inset-4 bg-white rounded-full"></div>
              </div>

              {/* Legend */}
              <div className="flex gap-8 w-full justify-center px-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                  <span className="text-sm font-medium text-gray-800">JavaScript</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                  <span className="text-sm font-medium text-gray-800">Python</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {user && (
        <EditProfileModal
          setRefetch={setRefetch}
          isOpen={isEditModalOpen}
          onClose={() => setEditModalOpen(false)}
          data={user}
          setEditModalOpen={setEditModalOpen}
        />
      )}

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
        auth={user?.auth as string}
      />
    </div>
  );
};

export default UserProfile;
