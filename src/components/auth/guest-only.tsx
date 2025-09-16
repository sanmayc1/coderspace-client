import { useAppSelector } from "@/app/hooks/redux-custom-hook";
import { Navigate, Outlet } from "react-router-dom";
import LoadingSpin from "../common/loading-spin";

const GuestOnly: React.FC = () => {
  const auth = useAppSelector((s) => s.authReducer);

    if (auth.loading) {
    return (
      <div className="inset-0 flex min-h-screen justify-center items-center">
        <LoadingSpin size={35} />
      </div>
    );
  }

  if (auth.auth) {
    if (auth.role === "user") {
      return <Navigate to={"/"} replace />;
    } else if (auth.role === "admin") {
      return <Navigate to={"/admin"} replace />;
    } else if (auth.role === "company") {
      return <Navigate to={"/company"} replace />;
    }
  }
  return (
    <>
      <Outlet />
    </>
  );
};

export default GuestOnly;
