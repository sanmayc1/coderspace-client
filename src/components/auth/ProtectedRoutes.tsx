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
    return <Navigate to="/404" replace />
  }

  return <>{element}</>;
};

export default ProtectRoutes