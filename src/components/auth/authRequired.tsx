import { useAppSelector } from "@/app/hooks/redux-custom-hook";
import type { IAuthRequireProps } from "@/types/props.types";
import { Navigate} from "react-router-dom";
import LoadingSpin from "../common/loading-spin";

const AuthRequired: React.FC<IAuthRequireProps> = ({ children, role }) => {
  const auth = useAppSelector((s) => s.authReducer);

  if (auth.loading) {
    return (
      <div className="inset-0 flex min-h-screen justify-center items-center">
        <LoadingSpin size={35} />
      </div>
    );
  }

  if (!auth.auth) {
    return <Navigate to={"/access-login"} />;
  }

  if (auth.role !== role) {
    if (auth.role === "user") {
      return <Navigate to={"/"} />;
    } else if (auth.role === "admin") {
      return <Navigate to={"/admin"} />;
    } else if (auth.role === "company") {
      return <Navigate to={"/company"} />;
    }
  }

  return <> {children}</>;
};

export default AuthRequired;
