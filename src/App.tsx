import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "./App.css";
import { useEffect } from "react";
import { authCheck } from "./api/auth/auth.api";
import { useAppDispatch } from "./app/hooks/redux-custom-hook";
import { clearAuth, setAuth } from "./app/redux-slice/authReducer";

function App() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    const isUserAuthenticated = async () => {
      try {
        const res = await authCheck();
        if (res && res.status === 200) {
          dispatch(
            setAuth({
              accountId: res.data?.data?.accountId,
              profileUrl: res.data?.data?.profileUrl,
              profileComplete: res.data?.data?.profileComplete,
              role:res.data?.data?.role
            })
          );
        }
      } catch (error) {
        dispatch(clearAuth());
      }
    };
    isUserAuthenticated();
  }, []);
  return (
    <>
      <Outlet />
      <ToastContainer limit={1} />
    </>
  );
}

export default App;
