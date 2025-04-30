import Image from "next/image";
import Navbar from "@/components/ui/navbar";
import { UserProvider } from "@/context/UserContext";
import { User } from "lucide-react";

export default function UserPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main>{children}</main>
        <footer className="bg-primaryBlue flex flex-col md:flex-row py-4 justify-center items-center text-white text-sm md:gap-4 w-screen">
          <Image
            src="/logo/logo_white.svg"
            alt="Footer Logo"
            width={100}
            height={200}
          />
          <p> © {new Date().getFullYear()} Blog Genzet. All rights reserved.</p>
        </footer>
      </div>
    </UserProvider>
  );
}
