"use client";

import {motion, AnimatePresence} from "motion/react";
import {usePathname} from "next/navigation";
import {LayoutRouterContext} from "next/dist/shared/lib/app-router-context.shared-runtime";
import {useContext, useRef} from "react";
import NavBar from "./NavBar/NavBar";

function FrozenRouter(props: {children: React.ReactNode}) {
  const context = useContext(LayoutRouterContext ?? {});
  const frozen = useRef(context).current;

  if (!frozen) {
    return <>{props.children}</>;
  }

  return <LayoutRouterContext.Provider value={frozen}>{props.children}</LayoutRouterContext.Provider>;
}

const variants = {
  hidden: {x: 200},
  enter: {x: 0},
  exit: {x: -200},
};

const PageTransitionEffect = ({children}: {children: React.ReactNode}) => {
  const key = usePathname();

  return (
    <>
      <NavBar />
      <AnimatePresence mode="popLayout">
        <motion.div
          key={key}
          initial="hidden"
          animate="enter"
          exit="exit"
          variants={variants}
          transition={{ease: "easeInOut", duration: 0.75}}
          className="w-full h-full "
        >
          <FrozenRouter>{children}</FrozenRouter>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default PageTransitionEffect;
