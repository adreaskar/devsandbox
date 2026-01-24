"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { logoutUser } from "@/actions/authActions";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import {
  LayoutDashboard,
  FolderGit2,
  LogOut,
  ChevronLeft,
  Server,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";

const Sidebar = () => {
  const cloudAscii = String.raw`

                                       ▓▓▓▓▓▓                                          
                                    ▓▓▓▓░░░░░░▓▓▓▓                                      
                                ▓▓▓▓░░░░░░░░░░░░▒▒▓▓██                                  
                            ▒▒▒▒▓▓▒▒░░░░░░░░░░░░░░▒▒▒▒▒▒▒▒                              
                        ████░░░░░░░░░░░░░░░░░░░░░░░░░░░░▒▒██                            
                    ████░░░░░░░░░░░░░░░░░░░░░░░░░░░░▒▒▒▒░░░░██                          
                ▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░▒▒░░░░░░░░░░░░██                        
            ██▓▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░▓▓▓▓░░░░░░░░░░██                      
        ████░░░░░░░░░░░░░░░░░░░░░░░░░░░░▒▒▒▒▒▒████▓▓▓▓██░░░░░░░░██                      
      ██░░░░░░░░░░░░░░░░░░░░░░░░░░░░▒▒▒▒░░████▓▓▓▓▓▓▓▓██░░░░██░░██                      
    ██░░▒▒▒▒░░░░░░░░░░░░░░░░░░░░▒▒▒▒░░████▓▓▓▓▓▓▓▓▓▓▓▓██░░████░░██                      
    ██░░░░░░▒▒▒▒░░░░░░░░░░░░▒▒▒▒░░████▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██░░██░░░░██                      
    ██░░░░░░░░░░░░░░░░░░░░░░░░██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██░░░░▒▒░░██                      
    ██░░░░░░░░░░░░░░▒▒▒▒░░████▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██░░▒▒░░░░██                      
    ██░░░░░░░░░░░░░░░░░░██▓▓▓▓▓▓░░░░▓▓░░▓▓▓▓▓▓▓▓▓▓▓▓▓▓██░░░░██░░██                      
    ██░░░░░░░░░░░░░░░░░░██▓▓▓▓░░▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██░░████░░██                      
    ██░░░░░░░░░░░░░░░░░░██▓▓▓▓░░▓▓▓▓▓▓░░▓▓▓▓▓▓▓▓▓▓▓▓▓▓██░░████░░██                      
    ██░░░░░░░░░░░░░░░░░░██▓▓▓▓▒▒░░░░▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██░░██░░░░██                      
    ██░░░░░░░░░░░░░░░░░░██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██░░░░░░░░██                      
    ██░░░░░░░░░░░░░░░░░░██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██░░░░░░░░██                      
    ██░░░░░░░░░░░░░░░░░░██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓████░░░░░░████                        
    ██░░░░░░░░░░░░░░░░░░██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓████░░░░░░████▒▒██                        
    ██░░░░░░░░░░░░░░░░░░██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓████░░░░░░▓▓▓▓▒▒▒▒▒▒██████                    
    ██░░░░░░░░░░░░░░░░░░██▓▓▓▓▓▓▓▓▓▓▓▓████░░░░░░▓▓▓▓▒▒▒▒▒▒████░░░░░░▓▓                  
    ██░░░░░░░░░░░░░░░░░░██▓▓▓▓▓▓▓▓██▓▓░░░░░░▓▓▓▓▒▒▒▒▒▒████░░░░░░▓▓▓▓██                  
    ████░░░░░░░░░░░░░░░░██▓▓▓▓████░░░░░░████▒▒▒▒▒▒████░░░░░░████░░░░░░██                
      ██████░░░░░░░░░░░░░░████░░░░░░████▒▒▒▒▒▒████░░░░░░████░░░░████░░░░██              
    ██▒▒▒▒▒▒████░░░░░░░░░░░░░░░░████▒▒▒▒▒▒██▓▓░░░░░░████░░░░████░░░░▓▓░░░░██            
    ██████▒▒▒▒▒▒▓▓██░░░░░░░░▓▓██▒▒▒▒▒▒████░░░░░░▓▓██░░░░▓▓▓▓░░░░░░░░░░██░░░░▓▓          
    ██░░░░████▒▒▒▒▒▒████████▒▒▒▒▒▒████░░░░░░██▓▓░░░░████░░░░░░░░░░░░░░░░██░░░░██        
    ██░░░░░░░░████▒▒▒▒▒▒▒▒▒▒▒▒████░░░░░░████░░░░████░░░░░░░░░░░░░░░░░░░░░░██░░░░██      
    ██░░░░░░░░░░░░████████████░░░░░░████░░░░██▓▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░██░░░░██    
  ██░░░░░░░░░░░░░░░░░░░░░░░░░░░░████░░░░████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██░░░░██  
  ██░░░░░░░░░░░░░░░░░░░░░░░░████░░░░████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░████░░░░██████
  ██░░░░░░░░░░░░░░░░░░░░░░▓▓░░██░░░░██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░▓▓▓▓░░░░▓▓▓▓░░░░██
  ████░░░░░░░░░░░░░░░░░░▓▓░░░░░░██░░░░██░░░░░░░░░░░░░░░░░░░░░░░░░░████░░░░████░░░░░░░░██
      ████░░░░░░░░░░░░░░▓▓░░░░░░░░██░░░░██░░░░░░░░░░░░░░░░░░░░████░░░░████░░░░░░░░░░░░██
          ████░░░░░░░░░░▓▓░░░░░░░░░░██░░░░██░░░░░░░░░░░░░░████░░░░████░░░░░░░░░░░░████  
              ████░░░░░░▓▓░░░░░░░░░░░░██░░░░██░░░░░░░░████░░░░████░░░░░░░░░░░░████      
                  ▓▓██░░▓▓░░░░░░░░░░░░░░██░░░░▓▓░░▓▓▓▓░░░░▓▓██░░░░░░░░░░░░████          
                      ██▓▓░░░░░░░░░░░░░░▒▒▓▓░░░░██░░▒▒▓▓▓▓░░░░░░░░░░░░▓▓██              
                        ░░▓▓▓▓░░░░░░░░░░░░▒▒▒▒░░▒▒▓▓▓▓▒▒░░░░░░░░░░▓▓▒▒░░                
                              ████░░░░░░░░░░▒▒████░░░░░░░░░░░░████                      
                                  ████░░░░░░░░░░░░░░░░░░░░████                          
                                      ████░░░░░░░░░░░░████                              
                                          ▓▓▓▓░░░░▓▓██                                  
                                          ░░░░▓▓▓▓░░                                    

  `;

  const location = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navItems = [
    { icon: LayoutDashboard, label: "Overview", path: "/dashboard/overview" },
    { icon: FolderGit2, label: "Templates", path: "/dashboard/templates" },
  ];

  const SidebarContent = ({ isMobile = false }) => (
    <div className="flex flex-col h-full">
      {/* Title */}
      <div
        className={cn(
          "p-4 border-b border-border/50 flex items-center",
          !isMobile && "justify-between",
        )}
      >
        {(!collapsed || isMobile) && (
          <>
            <Server className="w-5 h-5 mr-2" />
            <span className="text-2xl">Dashboard</span>
          </>
        )}
        {!isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className={cn("ml-auto", collapsed && "mx-auto")}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </Button>
        )}
        {isMobile && (
          <DrawerClose className="ml-auto" asChild>
            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-9 w-9">
              <X className="w-4 h-4" />
            </button>
          </DrawerClose>
        )}
      </div>

      <nav className="flex flex-col h-full p-4 space-y-2">
        {/* Sidebar items */}
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.path;

          return (
            <Button
              key={item.path}
              variant={isActive ? "outline" : "ghost"}
              className={cn(
                "w-full justify-start gap-3",
                !isMobile && collapsed && "justify-center",
              )}
              asChild
            >
              <Link
                href={item.path}
                onClick={() => isMobile && setDrawerOpen(false)}
              >
                <Icon className="w-4 h-4" />
                {(!collapsed || isMobile) && <span>{item.label}</span>}
              </Link>
            </Button>
          );
        })}

        <hr className="my-4 opacity-70 border-dashed" />

        {/* Logout Button */}
        <Button
          variant="ghost"
          onClick={() => logoutUser()}
          className={cn(
            "w-full justify-start self-end",
            !isMobile && collapsed && "justify-center",
          )}
        >
          <LogOut className="w-4 h-4" />
          {(!collapsed || isMobile) && <span>Sign out</span>}
        </Button>

        {(!collapsed || isMobile) && (
          <div className="mt-auto">
            <pre className="select-none text-center font-mono text-[3px] text-white/20 opacity-65">
              {cloudAscii}
            </pre>
          </div>
        )}
      </nav>
    </div>
  );

  return (
    <>
      {/* Mobile Drawer */}
      <div className="md:hidden">
        <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
          <DrawerTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="fixed top-4 left-4 z-50 md:hidden"
            >
              <Menu className="w-6 h-6" />
            </Button>
          </DrawerTrigger>
          <DrawerContent className="h-[85vh]">
            <DrawerTitle className="sr-only">Navigation Menu</DrawerTitle>
            <SidebarContent isMobile={true} />
          </DrawerContent>
        </Drawer>
      </div>

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden md:flex border-r border-border/50 transition-all duration-300 flex-col",
          collapsed ? "w-16" : "w-64",
        )}
      >
        <SidebarContent isMobile={false} />
      </aside>
    </>
  );
};

export default Sidebar;
