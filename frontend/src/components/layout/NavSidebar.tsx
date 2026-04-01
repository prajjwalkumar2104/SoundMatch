import {
  Compass,
  Heart,
  MessageCircle,
  Music,
  CalendarDays,
  User,
  Home,
  Users,
  Activity,
  BarChart3,
  FileText,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const navItems = [
  { title: "Home", url: "/", icon: Home },
  { title: "Discover", url: "/discover", icon: Compass },
  { title: "Matches", url: "/matches", icon: Heart },
  { title: "Chat", url: "/chat", icon: MessageCircle },
  { title: "Music Lounge", url: "/lounge", icon: Music },
  { title: "Group Lounges", url: "/group-lounges", icon: Users },
  { title: "Activity Feed", url: "/feed", icon: Activity },
  { title: "Events", url: "/events", icon: CalendarDays },
  { title: "Stats", url: "/stats", icon: BarChart3 },
  { title: "Weekly Report", url: "/weekly-report", icon: FileText },
  { title: "My Profile", url: "/me", icon: User },
];

export const NavSidebar = () => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarContent className="pt-4">
        {!collapsed && (
          <div className="px-4 pb-4">
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              SoundMatch
            </h1>
          </div>
        )}
        {collapsed && (
          <div className="flex justify-center pb-4">
            <Music className="h-6 w-6 text-primary" />
          </div>
        )}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Navigate
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/" || item.url === "/discover"}
                      className="hover:bg-sidebar-accent"
                      activeClassName="bg-sidebar-accent text-primary font-medium"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
