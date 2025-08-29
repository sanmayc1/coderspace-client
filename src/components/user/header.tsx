import { Menu, X } from "lucide-react";
import { useState } from "react";
import { navIcons, navHeads } from "@/utils/constants";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [auth, setAuth] = useState(false);
  const navigate = useNavigate();
  const closeAndOpenMenu = () => {
    setIsOpen((prev) => !prev);
  };
  const navigateTo = (path: string) => {
    if (isOpen) {
      closeAndOpenMenu();
    }
    navigate(path);
  };
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -300 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 80, damping: 20 }}
      >
        <header className="w-full fixed min-h-20 md:h-30 flex justify-center items-center z-49">
          <nav className="md:border-1  bg-white md:border-gray-700 md:rounded-sm h-20 md:h-16  w-full md:w-[80%] flex items-center justify-between px-2 md:px-0 box-border">
            {/* left */}
            <div className="flex items-center">
              <div className="flex items-center h-full xl:pl-8 md:p-4 pt-1  ">
                <img
                  onClick={()=>navigateTo("/")}
                  src="logo.png"
                  alt="logo"
                  className="max-h-12 min-h-10 min-w-32 select-none cursor-pointer"
                />
              </div>
              <div className="hidden md:block pl-10">
                <ul className="flex xl:gap-9 md:gap-5 md:text-xs xl:text-sm text-gray-600 font-[anybody-regular]">
                  {navHeads.map((head, index) => (
                    <li
                      key={index}
                      className="cursor-pointer select-none hover:text-black hover:scale-105 transition-all duration-400"
                    >
                      {head.title}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button className="p-2 text-gray-600" onClick={closeAndOpenMenu}>
                {isOpen ? <X /> : <Menu />}
              </button>
            </div>

            {/* right - desktop only */}
            <div className="hidden md:flex flex-grow justify-end pr-8">
              {auth ? (
                <ul className="flex xl:gap-5 md:gap-3  ">
                  {navIcons.map((icon, index) => (
                    <li key={index}>{icon.icon}</li>
                  ))}
                </ul>
              ) : (
                <div className="flex">
                  <Button
                    variant="ghost"
                    size={"sm"}
                    className="cursor-pointer"
                    onClick={() => navigateTo("/access-login")}
                  >
                    Login
                  </Button>
                </div>
              )}
            </div>
          </nav>
        </header>
      </motion.div>
      {/* mobile view  */}
      {isOpen ? (
        <div
          className={`md:hidden fixed  flex flex-col gap-5  justify-center items-center inset-0 z-50  bg-white  transform transition-transform duration-300 ${
            isOpen ? "translate-x-0" : "translate-x-full"
          } `}
        >
          <div className="absolute top-7 right-5">
            <X onClick={closeAndOpenMenu} />
          </div>
          <ul className=" flex flex-col gap-4 text-xl text-center  font-[anybody-regular]">
            {navHeads.map((head) => (
              <li className="select-none "> {head.title}</li>
            ))}
          </ul>
          {auth ? (
            <ul className=" flex flex-row-reverse gap-6 text-xl text-center font-[anybody-regular]">
              {navIcons.map((icon) => (
                <li>{icon.icon}</li>
              ))}
            </ul>
          ) : (
            <div className="flex gap-4">
              <Button
                variant="outline"
                size={"sm"}
                className="w-20"
                onClick={() => navigateTo("/access-login")}
              >
                Login
              </Button>
            </div>
          )}
        </div>
      ) : null}
    </>
  );
};

export default Header;
