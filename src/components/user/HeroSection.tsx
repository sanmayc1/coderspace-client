import { Button } from "../ui/Button";
import { motion } from "framer-motion";


const HeroSection = () => {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -300 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 80, damping: 20, delay: 0.2 }}
      >
        <section className="h-screen  flex flex-col justify-center items-center gap-8 ">
          <h1 className="xl:text-8xl md:text-6xl text-3xl sm:text-5xl text-center select-none font-[anybody-regular]">
            Hey Coders,
            <br />
            Welcome to CoderSpace
          </h1>
          <p className="text-center text-xs md:text-sm xl:text-lg select-none  text-gray-500 ">
            A Powerful coding platform to practice real-world challenges,
            prepare for <br />
            interview, and connect with fellow developers
          </p>
          <Button className="" size={"lg"}>
            Get's Start
          </Button>
        </section>
    </motion.div>
    </>
  );
};

export default HeroSection;
