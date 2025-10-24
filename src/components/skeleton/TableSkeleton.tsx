import type { IUsersData } from "@/types/types";
import Table from "../common/Table";
import { Skeleton } from "../ui/Skeleton";

const UserManagementTableSkeleton: React.FC = () => {
  const data: IUsersData[] = new Array(5).fill(null).map((_) => ({
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
          render: () => {
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
          render: () => {
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
          render: () => {
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
          render: () => {
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
          render: () => {
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
          render: () => {
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
