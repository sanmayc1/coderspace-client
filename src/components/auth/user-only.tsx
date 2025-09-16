import { useAppSelector } from "@/app/hooks/redux-custom-hook";
import { Navigate, Outlet } from "react-router-dom";
import LoadingSpin from "../common/loading-spin";

const UserOnly: React.FC = () => {
  const auth = useAppSelector((s) => s.authReducer);

    if (auth.loading) {
    return (
      <div className="inset-0 flex min-h-screen justify-center items-center">
        <LoadingSpin size={35} />
      </div>
    );
  }

  
  if (auth.auth && auth.role !== "user") {
    if (auth.role === "admin") {
      return <Navigate to={"/admin"} />;
    } else if (auth.role === "company") {
      return <Navigate to={"/company"} />;
    }
  }
  return <><Outlet/></>;
};

export default UserOnly;
