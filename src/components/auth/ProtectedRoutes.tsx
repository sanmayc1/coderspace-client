import { useAppSelector } from "@/app/hooks/redux-custom-hook";
import type { Role } from "@/types/types";
import { Navigate } from "react-router-dom";

const ProtectRoutes: React.FC<{
  element: React.ReactNode;
  allowedRoles?: Role[];
}> = ({ element, allowedRoles }) => {

  const auth = useAppSelector((s) => s.authReducer);
 

  if (!auth.auth && allowedRoles?.includes("guest")) {
    return <>{element}</>;
  }

  if (!auth.auth) {
    return <Navigate to="/access-login" replace />;
  }


  if (!allowedRoles?.includes(auth.role)) {
    
    if(auth.role === "guest"){
      return <Navigate to="/access-login" replace />;
    }

    if(auth.role === "user"){
      return <Navigate to="/" replace />;
    }

    if(auth.role === "admin"){
      return <Navigate to="/admin" replace />;
    }

    if(auth.role === "company"){
      return <Navigate to="/company" replace />;
    }

    return <Navigate to="/404" replace />;
  }

  return <>{element}</>;
};

export default ProtectRoutes;
