import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const AccessLogin: React.FC = () => {
  const navigate = useNavigate();

  const navigateTo = (path: string) => {
    navigate(path);
  };

  return (
    <>
      <motion.div
        initial={{ y: 500 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, stiffness: 80 }}
      >
        <div className="min-h-screen flex justify-center items-center">
          <div className="w-full grid sm:grid-cols-2 ">
            {/* developers */}

            <div className="py-10 flex flex-col justify-center items-center font-[anybody-regular] gap-10 sm:border-r-2  sm:border-b-0 border-b-2">
              <h3 className="text-3xl font-bold">For Coders</h3>
              <p className="text-center font-[anybody-light] px-10 text">
                Solve coding challenges, participate in <br /> contests, and
                improve your coding skills.
              </p>
              <Button
                variant="default"
                size="lg"
                className="cursor-pointer"
                onClick={() => navigateTo("/user/login")}
              >
                Login
              </Button>
              <div className="flex flex-col justify-center items-center gap-2 ">
                <p className="text-gray-600">Don't have an account ?</p>
                <p
                  className="cursor-pointer hover:scale-105 transition-all duration-500 select-none"
                  onClick={() => navigateTo("/user/signup")}
                >
                  Signup
                </p>
              </div>
            </div>

            {/* company */}

            <div className="py-10 flex flex-col justify-center items-center font-[anybody-regular] gap-10">
              <h3 className="text-3xl font-bold">For Companies</h3>
              <p className="text-center font-[anybody-light] px-10 text">
                Manage coders participation, issue offer letters,
                <br /> create and monitor coding contests, and track
                performance.{" "}
              </p>
              <Button
                variant="default"
                size="lg"
                className="cursor-pointer"
                onClick={() => navigateTo("/company/login")}
              >
                Login
              </Button>
              <div className="flex flex-col justify-center items-center gap-2 ">
                <p className="text-gray-600">Don't have an account ?</p>
                <p className="cursor-pointer hover:scale-105 transition-all duration-500 select-none" onClick={()=>navigateTo("/company/register")}>
                  Register
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default AccessLogin;
