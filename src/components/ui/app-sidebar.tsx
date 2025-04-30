import { Tag, Newspaper } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";

// Menu items.
const items = [
  {
    title: "Articles",
    url: "/admin/articles",
    icon: Newspaper,
  },
  {
    title: "Category",
    url: "/admin/category",
    icon: Tag,
  },
];

export function AppSidebar() {
  return (
    <Sidebar className="z-[60]">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <picture>
              <Image
                src="/logo/logo_white.svg"
                alt="Logo"
                width={150}
                height={200}
                priority
              />
            </picture>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
