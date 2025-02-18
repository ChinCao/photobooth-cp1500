/* eslint-disable @next/next/no-img-element */
import {AnimatePresence, motion} from "framer-motion";
import {createPortal} from "react-dom";

const blackBox = {
  initial: {
    height: "100vh",
    bottom: 0,
  },
  animate: {
    height: 0,
    transition: {
      when: "afterChildren",
      duration: 1.5,
      ease: [0.87, 0, 0.13, 1],
    },
  },
};

const textContainer = {
  initial: {
    opacity: 1,
  },
  animate: {
    opacity: 0,
    transition: {
      duration: 0.25,
      when: "afterChildren",
    },
  },
};
const text = {
  initial: {
    y: 40,
  },
  animate: {
    y: 80,
    transition: {
      duration: 1.5,
      ease: [0.87, 0, 0.13, 1],
    },
  },
};

const imageContainer = {
  initial: {
    y: 10,
  },
  animate: {
    y: 30,
    transition: {
      duration: 1.5,
      when: "beforeChildren",
      ease: [0.87, 0, 0.13, 1],
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
      >
        <motion.svg
          className="flex w-full"
          viewBox="0 0 1200 160"
          variants={imageContainer}
          preserveAspectRatio="xMidYMid meet"
        >
          <motion.pattern
            id="image-pattern"
            patternUnits="userSpaceOnUse"
            width="100%"
            height="100%"
            className="text-white"
          ></motion.pattern>

          <image
            href="/logo.png"
            x="500"
            y="70"
            width="160"
            height="160"
            style={{fill: "url(#image-pattern)"}}
            className="object-contain filter invert"
            preserveAspectRatio="xMidYMid meet"
            transform="translate(-80, -80)"
          />
          <image
            href="/vectr-bw.png"
            x="720"
            y="90"
            width="125"
            height="125"
            style={{fill: "url(#image-pattern)"}}
            className="object-contain"
            preserveAspectRatio="xMidYMid meet"
            transform="translate(-80, -80)"
          />
        </motion.svg>

        <motion.svg className="flex w-full">
          <motion.pattern
            id="pattern"
            patternUnits="userSpaceOnUse"
            width={750}
            height={800}
            variants={textContainer}
            className="text-white"
          >
            <rect className="w-full h-full fill-current" />
            <motion.rect
              variants={text}
              className="w-full h-full text-gray-600 fill-current"
            />
          </motion.pattern>

          <text
            className="text-6xl font-bold w-full"
            text-anchor="middle"
            x="50%"
            y="50%"
            style={{fill: "url(#pattern)"}}
          >
            VTEAM x VECTR
          </text>
        </motion.svg>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};

export default EndTransition;
