import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Calendar } from 'lucide-react';
import { toastifyOptionsCenter } from '@/utils/toastify.options';
import LoadingSpin from '@/components/common/LoadingSpin';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { followCoder, getCoder, unFollowCoder } from '@/api/user/user.coders';
import type { IGetCoderResponse } from '@/types/response.types';

const CodersDetails: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [coder, setCoder] = useState<IGetCoderResponse | null>(null);
  const [disable, setDisable] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    async function fetchCoder() {
      try {
        const res = await getCoder(id as string);
        setCoder(res);
        console.log(res)
        setLoading(false);
      } catch (error) {
        toast.error('Something went wrong', toastifyOptionsCenter);
      }
    }
    fetchCoder();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpin size={35} />
      </div>
    );
  }

  const handleFollowAndUnfollow = async () => {
    if (!coder) {
      return;
    }
    try {
      setDisable(true);
      if (!coder?.isFollowing) {
        await followCoder(coder?.userId as string);

        setCoder({ ...coder, isFollowing: true, followers: coder?.followers + 1 });
        setDisable(false);
        return;
      } else {
        await unFollowCoder(coder?.userId as string);
        setCoder({ ...coder, isFollowing: false, followers: coder?.followers - 1 });
        setDisable(false);
        return;
      }
    } catch (error) {
      toast.error('Something went wrong', toastifyOptionsCenter);
      setDisable(false);
    }
  };

  return (
    <main className="flex-grow pt-32 lg:pt-40 pb-16 px-4 md:px-10 lg:px-32 max-w-8xl mx-auto w-full ">
      {/* Profile Header Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-20">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Avatar */}
          <img
            src={coder?.profileUrl || '/defaultProfile.jpg'}
            alt="profile"
            className="h-40  w-40 border  rounded-full object-cover object-center "
          />

          {/* Profile Info */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900 mb-1">{coder?.name}</h1>
              <p className="text-lg text-gray-500 font-medium">{coder?.username}</p>
            </div>

            <div className="flex gap-3">
              <Button
                className="border-gray-300  px-5 py-2  flex items-center gap-2 shadow-sm"
                onClick={handleFollowAndUnfollow}
                variant={coder?.isFollowing ? 'outline' : 'default'}
                disabled={disable}
              >
                {coder?.isFollowing ? 'Following' : 'Follow'}
              </Button>
              {coder?.isFollowing && (
                <Button
                  variant="outline"
                  className=" border-gray-300 text-gray-700 px-6 py-2 hover:bg-gray-50"
                  onClick={()=>navigate(`/chat?contactId=${coder.accountId}`)}
                >
                  Message
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="h-1/2 flex justify-center gap-12 sm:gap-16 items-center">
          <div className="flex flex-col items-center">
            <p className="text-xl font-bold select-none">{coder?.problemSolved}</p>
            <p className="select-none font-semibold text-gray-700 opacity-75">Problems Solved</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-xl font-bold select-none">{coder?.following}</p>
            <p className="select-none font-semibold text-gray-700 opacity-75">Following</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-xl font-bold select-none">{coder?.followers}</p>
            <p className="select-none font-semibold text-gray-700 opacity-75">Followers</p>
          </div>
        </div>

        {/* Level Badge */}
        <div className="flex flex-col items-center gap-2 mt-4 md:mt-0">
          <img src={`/${coder?.badge}.png`} alt="badge" className="w-20 h-24 object-contain" />
          <p className="font-bold text-lg">Level {coder?.level}</p>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1  gap-6">
        {/* Left Column */}
        <div className=" flex flex-col gap-6">
          {/* About Card */}
          <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
            <h2 className="text-lg font-bold mb-4 text-gray-900">About</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              {coder?.about || 'No about added yet.'}
            </p>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 text-gray-500 text-xs font-semibold">
                <Calendar size={16} className="text-gray-900" />
                <span>Member Since {coder?.joinDate}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CodersDetails;
