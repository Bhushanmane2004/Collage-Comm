"use client"; // Ensure this line is present at the top

import {
  BellPlus,
  Calendar,
  Group,
  Home,
  Inbox,
  Laptop,
  Search,
  Settings,
} from "lucide-react";
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
import { UserButton } from "@clerk/nextjs";

// Menu items
const items = [
  { title: "Home", url: "#", icon: Home },
  { title: "Join Hackathon", url: "#", icon: Laptop },
  { title: "Find RoomMate", url: "#", icon: Group },
  { title: "Collage Event Update", url: "#", icon: Calendar },
  { title: "Event Update", url: "#", icon: BellPlus },
];

export function AppSidebar({
  onMenuClick,
}: {
  onMenuClick: (title: string) => void;
}) {
  return (
    <Sidebar className="flex flex-col h-full">
      <SidebarContent className="flex-grow">
        <SidebarGroup>
          <SidebarGroupLabel>Next App</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="flex-grow">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <button
                      onClick={() => onMenuClick(item.title)}
                      className="flex items-center gap-2"
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarContent>
        <UserButton />
        <SidebarMenuButton asChild>
          <button
            onClick={() => onMenuClick("Settings")}
            className="flex  gap-2 mt-auto items-center mb-5"
          >
            <Settings />
            <span>Settings</span>
          </button>
        </SidebarMenuButton>
      </SidebarContent>
    </Sidebar>
  );
}
