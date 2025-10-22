import { Outlet } from "react-router-dom";
import Header from "../user/Header";
import Footer from "../user/Footer";

const UserLayout:React.FC = () => {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};
export default UserLayout;
