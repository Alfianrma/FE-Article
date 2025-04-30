"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAdminUser } from "@/context/AdminContext";

function getPageTitle(pathname: string) {
  const routeTitles: { [key: string]: string } = {
    // "/": "Beranda",
    "/admin/articles": "Article",
    "/admin/category": "Category",
  };
  return routeTitles[pathname] || "Halaman";
}

export default function NavbarAdmin() {
  const router = useRouter();
  const user = useAdminUser();
  const [isTop, setIsTop] = useState(true);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const handleScroll = () => setIsTop(window.scrollY < 10);
    if (isHome) {
      window.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (isHome) {
        window.removeEventListener("scroll", handleScroll);
      }
    };
  }, [isHome]);

  const isTransparent = isHome && isTop;

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isTransparent ? "bg-transparent" : "bg-white shadow-sm"
      }`}
    >
      <nav className="mx-auto px-8 py-3 flex justify-between items-center">
        <div className="md:hidden"></div>
        <h1
          className={`text-xl font-semibold ml-64 hidden md:block ${
            isTransparent ? "text-white" : "text-gray-800"
          }`}
        >
          {getPageTitle(pathname)}
        </h1>

        {user && (
          <Popover>
            <PopoverTrigger asChild>
              <div className="flex items-center gap-3 hover:cursor-pointer">
                <img
                  src="/image/default_user.png"
                  alt="Profile"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <span
                  className={`hidden sm:block font-medium ${
                    isTransparent ? "text-white" : "text-gray-800"
                  }`}
                >
                  {user.username}
                </span>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-60 mr-10">
              <div className="rounded-lg bg-white shadow-md overflow-hidden">
                <div
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => router.push("/profile")}
                >
                  My Account
                </div>
                <div className="flex flex-row items-center gap-2 border-t border-gray-200 p-2 hover:bg-gray-100 cursor-pointer">
                  <LogOut className="text-red-500" size={16} />
                  <div className="text-red-500">Log out</div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        )}
      </nav>
    </header>
  );
}
