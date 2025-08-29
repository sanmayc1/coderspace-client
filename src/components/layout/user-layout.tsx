import { Outlet } from "react-router-dom";
import Header from "../user/header";
import Footer from "../user/footer";

const UserLayout = () => {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};
export default UserLayout;
