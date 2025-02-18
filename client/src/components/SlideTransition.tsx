import {AnimatePresence, motion} from "framer-motion";
import {createPortal} from "react-dom";

const blackBox = {
  initial: {
    x: "100vw",
  },
  animate: {
    x: 0,
    transition: {
      x: {duration: 1, ease: "easeInOut", when: "beforeChildren"},
    },
  },
};

const EndTransition = () => {
  if (typeof window === "undefined") return null;

  return createPortal(
    <AnimatePresence mode="wait">
      <motion.div
        className="fixed inset-0 z-[60] flex items-center justify-center flex-col w-full bg-black"
        initial="initial"
        animate="animate"
        onAnimationStart={() => document.body.classList.add("overflow-hidden")}
        onAnimationComplete={() => document.body.classList.remove("overflow-hidden")}
        variants={blackBox}
      ></motion.div>
    </AnimatePresence>,
    document.body
  );
};

export default EndTransition;
