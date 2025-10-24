import { getUser } from "@/api/user/user.profile";
import { useAppSelector } from "@/app/hooks/redux-custom-hook";
import LoadingSpin from "@/components/common/LoadingSpin";
import { Button } from "@/components/ui/Button";
import type { IErrorResponse } from "@/types/response.types";
import { toastifyOptionsCenter } from "@/utils/toastify.options";
import type { AxiosError } from "axios";
import { CircleDot, LogOut, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export interface IGetUserUsecaseOutputDto {
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
}

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<IGetUserUsecaseOutputDto>();
  const [isLoading, setLoading] = useState(false);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const userProfile = await getUser();
        setUser(userProfile.data?.data as IGetUserUsecaseOutputDto);
        setLoading(false);
        console.log(userProfile.data?.data);
      } catch (error) {
        setLoading(false);
        const axiosError = error as AxiosError<IErrorResponse>;
        toast.error(axiosError.response?.data?.message, toastifyOptionsCenter);
      }
    };
    fetchUser();
  }, []);

  const profileUrl =
    useAppSelector((s) => s.authReducer.profileUrl) || "/defaultProfile.jpg";

  if (isLoading) {
    return (
      <div className="inset-0 flex min-h-screen justify-center items-center">
        <LoadingSpin size={35} />
      </div>
    );
  }
  return (
    <div className="min-h-screen flex flex-col px-32 font-[anybody-regular]">
      <div className="h-32"></div>
      {/* first content */}
      <div className="h-52 flex gap-5">
        {/* left */}
        <div className="h-full flex items-center gap-5">
          <img src={profileUrl} alt="profile" className="h-40 rounded-full " />
          <div className="flex flex-col gap-10">
            <p className="flex flex-col gap-1">
              <span className="text-3xl font-bold select-none ">
                {(user?.name?.charAt(0).toUpperCase() as string) +
                  user?.name?.slice(1)}
              </span>
              <span className="text-gray-600 font-semibold pl-2 select-none ">
               {user?.username}
              </span>
            </p>
            <Button size={"sm"} className="cursor-pointer">
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
            <div className="px-14 flex items-center gap-4 ">
              <p className="px-2 py-1 flex gap-1 border-1 border-black rounded-full font-semibold cursor-pointer">
                <CircleDot className="fill-amber-500" /> {user?.xpCoin} Xp
              </p>
              <Settings className="cursor-pointer" />
              <LogOut className="cursor-pointer" />
            </div>
          </div>
          {/* bottom */}
          <div className="h-1/2 flex justify-center gap-32 items-center">
            <div className="flex flex-col items-center">
              <p className="text-xl font-bold select-none">900</p>
              <p className="select-none font-semibold text-gray-700 opacity-75">
                Problems Solved
              </p>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-xl font-bold select-none">500</p>
              <p className="select-none font-semibold text-gray-700 opacity-75">
                Following
              </p>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-xl font-bold select-none">1.5k</p>
              <p className="select-none font-semibold text-gray-700 opacity-75">
                Followers
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* second content */}
    </div>
  );
};

export default UserProfile;
