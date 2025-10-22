import { motion } from "framer-motion";

const AuthFormWraper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <motion.div
        initial={{ y: 500 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, stiffness: 80 }}
        className="bg-white shadow-2xl p-7 w-[90%] xl:w-[27%] sm:w-[40%] rounded-2xl flex flex-col my-28 border border-gray-200"
      >
        {children}
      </motion.div>
    </div>
  );
};


export default AuthFormWraper