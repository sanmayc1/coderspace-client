import {motion} from "framer-motion"


const MotionScrollWrap:React.FC<{children:React.ReactNode}> = ({children}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.4 }}
    >{children}</motion.div>
  );
};

export default MotionScrollWrap
