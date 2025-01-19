import Image from "next/image";
import Link from "next/link";
import React from "react";
import NavLink from "./NavLink";

const NavBar = () => {
  return (
    <header className="bg-transparent pt-4 px-12 fixed w-full top-0">
      <nav className=" flex w-full justify-between">
        <div className="w-max cursor-pointer shadow-lg rounded-xl border bg-card text-card-foreground">
          <Link
            className="flex items-center justify-center p-3 px-2"
            href="/"
          >
            <Image
              src="/logo.png"
              height={70}
              width={70}
              alt="VTEAM Logo"
            />
          </Link>
        </div>
        <div className="flex gap-8">
          <div className="w-max cursor-pointer shadow-lg rounded-xl border bg-card text-card-foreground text-3xl  ">
            <NavLink
              className="flex items-center justify-center  uppercase px-6 font-bold h-full"
              href="/"
            >
              Theme
            </NavLink>
          </div>
          <div className="w-max cursor-pointer shadow-lg rounded-xl border bg-card text-card-foreground text-3xl  ">
            <NavLink
              className="flex items-center justify-center  uppercase px-6 font-bold h-full"
              href="/layout"
            >
              Layout
            </NavLink>
          </div>
          <div className="w-max cursor-pointer shadow-lg rounded-xl border bg-card text-card-foreground text-3xl  ">
            <NavLink
              className="flex items-center justify-center uppercase px-6 font-bold h-full"
              href="/capture"
            >
              Capture
            </NavLink>
          </div>
        </div>
        <div></div>
      </nav>
    </header>
  );
};

export default NavBar;
