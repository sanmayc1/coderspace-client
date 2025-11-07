import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useEffect } from "react";
import { fetchRoleData } from "./api/asyncThunk/thunk-api"; 
import { useAppDispatch, useAppSelector } from "./app/hooks/redux-custom-hook";
import LoadingSpin from "./components/common/LoadingSpin";
import { routers } from "./app/routes/index.routes";
import UserExperienceModal from "./components/user/UserExperienceModal";
import { socket } from "./socket";

function App() {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((s) => s.authReducer.loading);
  useEffect(() => {
     dispatch(fetchRoleData());
    socket.on("connect",()=>{
      console.log("Connected to socket server",socket.id)
    })
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="inset-0 flex min-h-screen justify-center items-center">
        <LoadingSpin size={35} />
      </div>
    );
  }

  return (
    <>
      <RouterProvider router={routers} />
      <ToastContainer limit={1} />
      <UserExperienceModal />
    </>
  );
}

export default App;
