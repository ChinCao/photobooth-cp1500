"use client";

import {motion} from "motion/react";
import React from "react";

export default function Template({children}: {children: React.ReactNode}) {
  return (
    <motion.div
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      exit={{opacity: 0}}
      transition={{ease: "easeInOut", duration: 0.75}}
      className="w-full h-full flex items-center justify-center flex-col"
    >
      {children}
    </motion.div>
  );
}
