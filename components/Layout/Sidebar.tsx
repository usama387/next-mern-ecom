"use client";
// global import
import Image from "next/image";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

// local import
import { navLinks } from "@/lib/constants";
import { usePathname } from "next/navigation";

const Sidebar = () => {

  //   pathname to hook to change color of the current url
  const pathname = usePathname();

  return (
    <div className="h-screen left-0 top-0 sticky p-10 flex flex-col gap-16 bg-blue-2 shadow-lg max-lg:hidden">
      <Image src="/logo.png" alt="logo" width={80} height={70} />

      <div className="flex flex-col gap-12">
        {navLinks.map((item) => (
          <Link
            href={item.url}
            key={item.id}
            className={`flex gap-4 text-body-medium ${pathname === item.url ? "text-blue-400" : ""}`}
          >
            {item.icon}
            <p>{item.label}</p>
          </Link>
        ))}
      </div>
      {/* USER BUTTON */}
      <div className="flex gap-4 text-body-medium items-center ">
        <p>View Profile</p>
        <UserButton />
      </div>
    </div>
  );
};

export default Sidebar;
