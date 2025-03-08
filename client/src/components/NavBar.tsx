"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import {usePathname} from "next/navigation";
import {cn} from "@/lib/utils";
import {BorderTrail} from "./border-trail";

const NavBar = () => {
  const path = usePathname();
  const isActive = path == "/" || path == "/layout";
  const hideNavBar = path === "/layout/capture";
  return (
    <header className={cn("bg-transparent pt-4 px-5 fixed w-full top-0", hideNavBar ? "hidden" : null)}>
      <nav className=" flex w-full justify-between">
        <div className="w-max cursor-pointer shadow-lg rounded-md  bg-card text-card-foreground relative">
          <BorderTrail
            style={{
              boxShadow: "0px 0px 60px 30px rgb(255 255 255 / 50%), 0 0 100px 60px rgb(0 0 0 / 50%), 0 0 140px 90px rgb(0 0 0 / 50%)",
            }}
            size={70}
          />
          <Link
            className={cn("flex items-center justify-center p-2 px-1", !isActive ? "pointer-events-none" : null)}
            href="/"
          >
            <Image
              src="/logo.png"
              height={50}
              width={50}
              alt="VTEAM Logo"
            />
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
