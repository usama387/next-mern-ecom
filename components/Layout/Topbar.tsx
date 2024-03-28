"use client";
// global import
import { UserButton } from "@clerk/nextjs";
import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

// local import
import { navLinks } from "@/lib/constants";

const Topbar = () => {
  // managing state for hamburger menu
  const [hamburger, setHamburger] = useState(false);

  //   pathname to hook to change color of the current url
  const pathname = usePathname();

  return (
    <div className="sticky top-0 z-20 flex justify-between items-center px-8 py-4 bg-blue-2 shadow-xl lg:hidden">
      <Image src="/logo.png" alt="logo" width={80} height={70} />
      <div className="flex gap-8 max-md:hidden">
        {navLinks.map((item) => (
          <Link
            href={item.url}
            key={item.id}
            className={`flex gap-4 text-body-medium ${pathname === item.url ? "text-amber-300" : ""}`}
          >
            <p>{item.label}</p>
          </Link>
        ))}
      </div>

      {/* USER BUTTON WITH RESPONSIVE HAMBURGER*/}
      <div className="flex gap-4 items-center relative">
        <Menu
          className="cursor-pointer md:hidden"
          onClick={() => setHamburger(!hamburger)}
        />
        {/* Most outer box of hamburger dropdown */}
        {hamburger && (
          <div className="flex flex-col gap-8 p-5 bg-amber-100 shadow-xl rounded-lg top-10 right-6 absolute">
            {navLinks.map((item) => (
              <Link
                href={item.url}
                key={item.id}
                className="flex gap-4 text-body-medium"
              >
                {item.icon}
                <p>{item.label}</p>
              </Link>
            ))}
          </div>
        )}
        <UserButton />
      </div>
    </div>
  );
};

export default Topbar;
