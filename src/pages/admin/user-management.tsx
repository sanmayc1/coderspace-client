import Table from "@/components/common/table";
import type { IUsersData } from "@/types/types";
import { useState } from "react";

const UserMangement: React.FC = () => {
  const [users, setUsers] = useState<IUsersData[]>([
    {
      username: "sanmay",
      badge: "silver",
      email: "sanmay@gamil.com",
      id: "df",
      level: 33,
      status: true,
    },
  ]);
  const [isOpen,setIsOpen ] = useState(false)
  console.log(isOpen)
  return (
    <>
      <div>
        <h1 className="text-xl font-semibold">User Management</h1>
        <Table
          columns={[
            {
              key: "profileUrl",
              label: "Username",
              render: (_value ="/defaultProfile.jpg", item) => {
                return(
                    <div className="flex justify-start  items-center gap-3">
                        <img className="h-8 rounded-full" src={_value} />
                        <p>{item.username.charAt(0).toUpperCase() + item.username.slice(1)}</p>
                    </div>
                )
              },
            },
            {
              key: "email",
              label: "Email",
            },
            {
              key: "level",
              label: "Level",
            },
            {key:"badge",label:"Badge"},
            {
              key: "actions",
              label: "Actions",
              render: (_value, item) => (
                <button
                  onClick={() => setIsOpen(true)}
                  className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Edit
                </button>
              ),
            },
          ]}
          data={users}
        />
      </div>
    </>
  );
};

export default UserMangement;
