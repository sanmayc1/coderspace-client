import Footer from "@/components/user/footer";
import Header from "@/components/user/header";
import { CloudAlert } from "lucide-react";

const PageNotFoundError:React.FC = () => {
  return (
    <>
      <Header />
      <div className="h-screen w-full flex justify-center items-center gap-4">
        <CloudAlert size={40} color="red" className="animate-pulse" />
        <p className="text-2xl font-bold ">404 - Oops! Page Not Found</p>
      </div>
      <Footer />
    </>
  );
};

export default PageNotFoundError;
