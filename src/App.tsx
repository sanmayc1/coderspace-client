import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "./App.css";
import { useEffect } from "react";
import { authCheck } from "./api/auth/auth.api";
import { useAppDispatch, useAppSelector } from "./app/hooks/redux-custom-hook";
import { clearAuth, setAuth, setLoading } from "./app/redux-slice/authReducer";
import LoadingSpin from "./components/common/loading-spin";

function App() {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((s) => s.authReducer.loading);
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
              role: res.data?.data?.role,
            })
          );
          dispatch(setLoading({ loading: false }));
        }
      } catch (error) {
        dispatch(setLoading({ loading: false }));
        dispatch(clearAuth())
      }
    };
    isUserAuthenticated();
  }, []);

  if (isLoading) {
    return (
      <div className="inset-0 flex min-h-screen justify-center items-center">
        <LoadingSpin size={35} />
      </div>
    );
  }

  return (
    <>
      <Outlet />
      <ToastContainer limit={1} />
    </>
  );
}

export default App;
