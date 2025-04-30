import Image from "next/image";
import { User } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";
import App from "next/app";
import NavbarAdmin from "@/components/ui/admin-navbar";
import { AdminUserProvider } from "@/context/AdminContext";

export default function SidebarPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminUserProvider>
      <SidebarProvider>
        <div className="flex flex-col min-h-screen">
          <AppSidebar />
          <main>
            <NavbarAdmin />
            <SidebarTrigger className="fixed top-4 left-4 z-50 " />
            <div className="pt-16 pl-4 md:pl-72 md:pt-20 pr-4 md:pr-6 min-w-screen bg-gray-50 pb-6 min-h-screen">
              {children}
            </div>
          </main>
        </div>
      </SidebarProvider>
    </AdminUserProvider>
  );
}
