import { useNavigate } from 'react-router-dom';
import { getUser } from '@/api/user/user.profile';
import { useAppDispatch, useAppSelector } from '@/app/hooks/redux-custom-hook';
import LoadingSpin from '@/components/common/LoadingSpin';
import { Button } from '@/components/ui/Button';
import type { IErrorResponse } from '@/types/response.types';
import { toastifyOptionsCenter } from '@/utils/toastify.options';
import type { AxiosError } from 'axios';
import { Crown, Settings, Edit3 } from 'lucide-react';
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
  problemSolved: number;
}

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<IUserState>();
  const [isLoading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('Overview');
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isSettingsModalOpen, setSettingsModalOpen] = useState(false);
  const [refetch, setRefetch] = useState(false);
  const profileUrl = useAppSelector((s) => s.authReducer.profileUrl) || '/defaultProfile.jpg';
  const isPremium = useAppSelector((s) => s.authReducer.isPremium);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

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
      <div className="inset-0 flex min-h-screen justify-center items-center bg-gray-50/30 backdrop-blur-sm">
        <LoadingSpin size={40} />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-12 font-[anybody-regular] mb-20 pt-12">
      <div className="h-10 md:h-16 lg:h-24"></div>
      
      {/* 1. Header Section */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Left Side: Avatar & Info */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 lg:w-[55%]">
          {/* Avatar */}
          <div className="relative group shrink-0">
            <div className="absolute inset-0 bg-gradient-to-tr from-gray-200 to-gray-50 rounded-full blur-md scale-105 group-hover:scale-110 transition-transform duration-500 -z-10"></div>
            <img
              src={user?.profileUrl || '/defaultProfile.jpg'}
              alt="profile"
              className={`h-32 w-32 sm:h-40 sm:w-40 border-4 border-white shadow-xl rounded-full object-cover object-center transition-transform duration-500 group-hover:-translate-y-1 ${
                isPremium ? 'ring-4 ring-amber-400 ring-offset-2' : ''
              }`}
            />
            {isPremium && (
              <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 bg-gradient-to-br from-amber-400 to-amber-600 p-2 sm:p-2.5 rounded-full border-4 border-white shadow-lg  hover:animate-none">
                <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-white fill-white drop-shadow-md" />
              </div>
            )}
          </div>
          
          {/* Info */}
          <div className="flex flex-col gap-4 text-center sm:text-left pt-2 sm:pt-4">
            <div className="space-y-1.5">
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-gray-900 drop-shadow-sm">
                {user?.name ? user.name.charAt(0).toUpperCase() + user.name.slice(1) : ''}
              </h1>
              <p className="text-gray-500 font-semibold text-sm sm:text-base bg-gray-100 rounded-full px-4 py-1.5 w-fit mx-auto sm:mx-0 shadow-inner">
                {user?.username}
              </p>
            </div>
            <div className="flex flex-wrap gap-3 justify-center sm:justify-start mt-2">
              <Button variant="outline" className="rounded-full shadow-sm hover:shadow-md transition-shadow font-bold h-10 px-5 border-gray-200 hover:bg-gray-50" onClick={handleEditOpen}>
                <Edit3 className="w-4 h-4 mr-2" /> Edit Profile
              </Button>
              <Button className="rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md shadow-amber-500/20 hover:shadow-lg hover:shadow-amber-500/30 transition-all font-bold h-10 px-5 border-none" onClick={() => navigate('/user/upgrade')}>
                <Crown className="w-4 h-4 mr-2" /> Upgrade
              </Button>
            </div>
          </div>
        </div>

        {/* Right Side: Stats Widget */}
        <div className="flex flex-col gap-5 flex-grow lg:w-[45%] bg-white/70 backdrop-blur-md rounded-[2rem] p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 relative overflow-hidden group">
          {/* Ambient Card Background */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-amber-100/50 rounded-full blur-[50px] pointer-events-none group-hover:scale-110 transition-transform duration-700"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-50/50 rounded-full blur-[40px] pointer-events-none group-hover:scale-110 transition-transform duration-700"></div>

          {/* Card Header */}
          <div className="flex justify-between items-center relative z-10 w-full mb-2">
            <div className="bg-amber-50/80 backdrop-blur border border-amber-200/60 text-amber-700 px-4 py-2 rounded-full font-black flex items-center gap-2 shadow-sm hover:shadow transition-shadow cursor-default">
              <img src="/coin.png" className="w-6 h-6 object-contain drop-shadow-sm" alt="xp" /> 
              <span>{user?.xpCoin || 0} XP</span>
            </div>
            <button
               onClick={() => setSettingsModalOpen(true)}
               className="p-3 bg-white rounded-full shadow-sm hover:shadow-md text-gray-500 hover:text-gray-900 border border-gray-100 transition-all hover:rotate-90"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 relative z-10 flex-grow">
            <div className="flex flex-col items-center justify-center p-3 sm:p-4 bg-gray-50/80 backdrop-blur rounded-2xl border border-gray-100/80 hover:bg-white hover:shadow-md transition-all duration-300">
              <span className="text-2xl sm:text-3xl font-black text-gray-900">{user?.problemSolved || 0}</span>
              <span className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-widest mt-1 text-center">Problems</span>
            </div>
            <div className="flex flex-col items-center justify-center p-3 sm:p-4 bg-gray-50/80 backdrop-blur rounded-2xl border border-gray-100/80 hover:bg-white hover:shadow-md transition-all duration-300">
               <span className="text-2xl sm:text-3xl font-black text-gray-900">{user?.following || 0}</span>
               <span className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-widest mt-1 text-center">Following</span>
            </div>
            <div className="flex flex-col items-center justify-center p-3 sm:p-4 bg-gray-50/80 backdrop-blur rounded-2xl border border-gray-100/80 hover:bg-white hover:shadow-md transition-all duration-300">
               <span className="text-2xl sm:text-3xl font-black text-gray-900">{user?.followers || 0}</span>
               <span className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-widest mt-1 text-center">Followers</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Level Progress Path */}
      <div className="w-full px-4 sm:px-12 mt-20 sm:mt-32 mb-10 sm:mb-16 font-['anybody-bold']">
        <div className="relative w-full h-3 bg-gray-100 rounded-full shadow-inner border border-gray-200/50">
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-gray-700 via-gray-900 to-black rounded-full transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(0,0,0,0.5)] flex justify-end items-center"
            style={{ width: `${Math.min(user?.currentLevel || 0, 100)}%` }}
          >
            <div className="absolute top-8 right-0 translate-x-1/2 bg-black text-white text-xs sm:text-sm font-black tracking-wide px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl shadow-xl whitespace-nowrap animate-bounce drop-shadow-lg z-20">
              Level {user?.currentLevel || 0}
              <div className="absolute w-3 h-3 bg-black rotate-45 -top-1.5 left-1/2 -translate-x-1/2 rounded-sm"></div>
            </div>
          </div>

          {/* Silver Node */}
          <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 z-10 group">
            <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-[4px] sm:border-[5px] border-white shadow-md transition-colors duration-500 ${user?.currentLevel && user.currentLevel >= 0 ? 'bg-gray-900' : 'bg-gray-300'}`}></div>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 flex flex-col items-center w-max">
              <div className="relative group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300">
                <img src="/silver.png" alt="Silver" className={`w-12 h-14 sm:w-16 sm:h-[4.5rem] object-contain drop-shadow-md ${user?.currentLevel && user.currentLevel < 0 ? 'opacity-50 grayscale blur-[1px]' : ''}`} />
              </div>
              <span className="font-bold text-xs sm:text-sm mt-1 sm:mt-2 text-gray-700 tracking-wider">SILVER</span>
            </div>
          </div>

          {/* Gold Node */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 group">
            <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-[4px] sm:border-[5px] border-white shadow-md transition-colors duration-500 ${user?.currentLevel && user.currentLevel >= 50 ? 'bg-amber-400 shadow-amber-400/50' : 'bg-gray-200'}`}></div>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 flex flex-col items-center w-max">
               <div className="relative group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300">
                  <img src="/gold.png" alt="Gold" className={`w-12 h-14 sm:w-16 sm:h-[4.5rem] object-contain drop-shadow-md ${user?.currentLevel && user.currentLevel >= 50 ? '' : 'opacity-40 grayscale blur-[1px]'}`} />
               </div>
               <span className={`font-bold text-xs sm:text-sm mt-1 sm:mt-2 tracking-wider ${user?.currentLevel && user.currentLevel >= 50 ? 'text-amber-500' : 'text-gray-400'}`}>GOLD</span>
            </div>
          </div>

          {/* Platinum Node */}
          <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 z-10 group">
            <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-[4px] sm:border-[5px] border-white shadow-md transition-colors duration-500 ${user?.currentLevel && user.currentLevel >= 100 ? 'bg-blue-400 shadow-blue-400/50' : 'bg-gray-200'}`}></div>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 flex flex-col items-center w-max">
               <div className="relative group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300">
                  <img src="/platinum.png" alt="Platinum" className={`w-12 h-14 sm:w-16 sm:h-[4.5rem] object-contain drop-shadow-md ${user?.currentLevel && user.currentLevel >= 100 ? '' : 'grayscale opacity-40 blur-[1px]'}`} />
               </div>
               <span className={`font-bold text-xs sm:text-sm mt-1 sm:mt-2 tracking-wider ${user?.currentLevel && user.currentLevel >= 100 ? 'text-blue-500' : 'text-gray-400'}`}>PLATINUM</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Navigation Tabs */}
      <div className="flex gap-8 border-b border-gray-200/60 mt-10 mb-8 w-full overflow-x-auto select-none no-scrollbar px-2">
        {['Overview'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-sm sm:text-base lg:text-lg font-bold tracking-wide transition-colors relative whitespace-nowrap px-1 ${
              activeTab === tab
                ? 'text-gray-900'
                : 'text-gray-400 hover:text-gray-700'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gray-900 rounded-t-[4px]"></div>
            )}
          </button>
        ))}
      </div>

      {/* 4. Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 pb-10">
        
        {/* Left Column (2/3) */}
        <div className="lg:col-span-2 flex flex-col gap-6 lg:gap-8">
          {/* About Section */}
          <div className="bg-white border border-gray-100 rounded-[2rem] p-6 sm:p-8 hover:shadow-[0_8px_30px_rgb(0,0,0,0.03)] transition-shadow group relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-gray-50 rounded-full blur-3xl group-hover:bg-amber-50 transition-colors duration-500 pointer-events-none"></div>
            <h3 className="text-xl sm:text-2xl font-black mb-4 sm:mb-6 text-gray-900 flex items-center gap-3">
               About Me
            </h3>
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base font-medium relative z-10">
              {user?.about || <span className="text-gray-400 italic font-semibold">No about added yet. Tell the world about yourself!</span>}
            </p>
          </div>

          {/* Skills Section */}
          <div className="bg-white border border-gray-100 rounded-[2rem] p-6 sm:p-8 hover:shadow-[0_8px_30px_rgb(0,0,0,0.03)] transition-shadow min-h-[16rem] group relative overflow-hidden flex flex-col">
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gray-50 rounded-full blur-3xl group-hover:bg-blue-50 transition-colors duration-500 pointer-events-none"></div>
            <h3 className="text-xl sm:text-2xl font-black mb-6 sm:mb-8 text-gray-900 relative z-10 flex items-center gap-3">
              Superpowers
            </h3>
            <div className="flex flex-wrap gap-3 relative z-10 flex-grow content-start">
              {user?.skills && user.skills.length > 0 ? (
                user.skills.map((skill: any, idx: number) => (
                  <span
                    key={idx}
                    className="border border-gray-200 bg-gray-50/80 backdrop-blur hover:bg-gray-900 hover:text-white hover:border-gray-900 hover:shadow-md transition-all duration-300 rounded-2xl px-6 py-2.5 text-sm sm:text-base text-gray-700 font-bold cursor-default hover:-translate-y-0.5"
                  >
                    {typeof skill === 'string' ? skill : skill.name || 'Skill'}
                  </span>
                ))
              ) : (
                <div className="flex flex-wrap gap-3">
                  <span className="border border-gray-200 bg-gray-50 hover:bg-gray-100 rounded-2xl px-6 py-2.5 text-sm sm:text-base text-gray-400 font-bold transition-colors cursor-default border-dashed">
                    Data Structures
                  </span>
                  <span className="border border-gray-200 bg-gray-50 hover:bg-gray-100 rounded-2xl px-6 py-2.5 text-sm sm:text-base text-gray-400 font-bold transition-colors cursor-default border-dashed">
                    Algorithms
                  </span>
                  <span className="border border-gray-200 bg-gray-50 hover:bg-gray-100 rounded-2xl px-6 py-2.5 text-sm sm:text-base text-gray-400 font-bold transition-colors cursor-default border-dashed">
                    Problem Solving
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column (1/3) - The Badge Card */}
        <div className="lg:col-span-1 mb-5 group h-full">
          <div className="relative border border-gray-200/60 bg-gradient-to-b from-white to-gray-50/50 rounded-[2rem] p-8 h-full min-h-[350px] flex flex-col items-center justify-center overflow-hidden transition-all duration-700 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] shadow-sm hover:-translate-y-1">
            {/* Ambient Background Glows */}
            <div className="absolute -top-24 -right-24 w-56 h-56 bg-amber-300/10 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-400/20 transition-colors duration-700"></div>
            <div className="absolute -bottom-24 -left-24 w-56 h-56 bg-gray-300/20 rounded-full blur-3xl pointer-events-none group-hover:bg-gray-400/30 transition-colors duration-700"></div>

            <div className="z-10 flex flex-col items-center w-full h-full justify-between">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-[1px] w-8 bg-gray-200 group-hover:bg-amber-200 transition-colors duration-500"></div>
                <h3 className="text-[11px] font-bold tracking-[0.25em] text-gray-400 uppercase">Honor Badge</h3>
                <div className="h-[1px] w-8 bg-gray-200 group-hover:bg-amber-200 transition-colors duration-500"></div>
              </div>
              
              <div className="relative flex justify-center items-center w-full flex-grow py-2 group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-700 ease-out will-change-transform">
                 <div className="absolute inset-0 bg-amber-400/5 blur-2xl rounded-full scale-50 group-hover:scale-100 group-hover:bg-amber-400/10 transition-all duration-700"></div>
                 <img 
                   src={`/${user?.currentBadge || 'silver'}.png`} 
                   alt={user?.currentBadge || 'Badge'} 
                   className="w-48 h-48 object-contain drop-shadow-[0_15px_15px_rgba(0,0,0,0.15)] relative z-10" 
                 />
              </div>

              <div className="flex flex-col items-center gap-2 mt-5">
                <p className="text-2xl font-black tracking-[0.15em] text-transparent bg-clip-text bg-gradient-to-br from-gray-900 to-gray-600 select-none uppercase">
                  {user?.currentBadge || 'Loading'}
                </p>
                <div className="flex gap-2 justify-center items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">
                    Active Tier
                  </p>
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse delay-75"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
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
