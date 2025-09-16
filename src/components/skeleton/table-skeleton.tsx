import type { IUsersData } from "@/types/types";
import Table from "../common/table";
import { Skeleton } from "../ui/skeleton";

const UserManagementTableSkeleton: React.FC = () => {
  const data: IUsersData[] = new Array(6).fill(null).map((v) => ({
    accountId: "",
    username: "",
    email: "",
    profileUrl: "",
    blocked: false,
    badge: "",
    level: 0,
    userId: "",
  }));

  return (
    <Table
      columns={[
        {
          key: "profileUrl",
          label: "Username",
          render: (_value = "/defaultProfile.jpg") => {
            return (
              <div className="flex justify-start  items-center gap-3">
                <Skeleton className="h-9 w-9 bg-gray-200 rounded-full" />
                <Skeleton className="h-4 w-20 bg-gray-200" />
              </div>
            );
          },
        },
        {
          key: "email",
          label: "Email",
          render: (_value = "/defaultProfile.jpg") => {
            return (
              <div className="flex justify-start  items-center gap-3">
                <Skeleton className="h-4 w-20 bg-gray-200" />
              </div>
            );
          },
        },
        {
          key: "level",
          label: "Level",
          render: (_value = "/defaultProfile.jpg") => {
            return (
              <div className="flex justify-start  items-center gap-3">
                <Skeleton className="h-4 w-12 bg-gray-200" />
              </div>
            );
          },
        },
        {
          key: "badge",
          label: "Badge",
          render: (_value = "/defaultProfile.jpg") => {
            return (
              <div className="flex justify-start  items-center gap-3">
                <Skeleton className="h-4 w-12 bg-gray-200" />
              </div>
            );
          },
        },
        {
          key: "blocked",
          label: "Status",
          render: (_value = "/defaultProfile.jpg") => {
            return (
              <div className="flex justify-start  items-center gap-3">
                <Skeleton className="h-4 w-12 bg-gray-200" />
              </div>
            );
          },
        },
        {
          key: "userId",
          label: "Actions",
          render: (_value = "/defaultProfile.jpg") => {
            return (
              <div className="flex justify-start  items-center gap-3">
                <Skeleton className="h-6 w-11 bg-gray-200 " />
              </div>
            );
          },
        },
      ]}
      data={data}
    />
  );
};

export default UserManagementTableSkeleton;
