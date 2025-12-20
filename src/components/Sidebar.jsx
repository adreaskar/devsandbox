'use client'

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from 'next/navigation'
import { Button } from "@/components/ui/button";
import { logoutUser } from "@/actions/authActions";
import Image from "next/image";
import {
    LayoutDashboard,
    FolderGit2,
    LogOut,
    ChevronLeft,
    Server,
    ChevronRight,
} from "lucide-react";

const Sidebar = () => {

    const location = usePathname();
    const [collapsed, setCollapsed] = useState(false);

    const navItems = [
        { icon: LayoutDashboard, label: "Overview", path: "/dashboard/overview" },
        { icon: FolderGit2, label: "Templates", path: "/dashboard/templates" },
    ];

    return (
        <aside
            className={cn(
                "border-r border-border/50 transition-all duration-300 flex flex-col bg-primary",
                collapsed ? "w-16" : "w-64"
            )}
        >
            <div className="p-4 border-b border-border/50 flex items-center justify-between">
                {!collapsed && (
                    <>
                        <Server className="w-5 h-5 mr-2" />
                        <span className="text-2xl">Dashboard</span>
                    </>
                )}
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
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location === item.path;

                    return (
                        <Link key={item.path} href={item.path}>
                            <Button
                                variant={isActive ? "default" : "ghost"}
                                className={cn(
                                    "w-full justify-start gap-3 mb-2",
                                    collapsed && "justify-center"
                                )}
                            >
                                <Icon className="w-4 h-4" />
                                {!collapsed && <span>{item.label}</span>}
                            </Button>
                        </Link>
                    );
                })}

                {/* 4. Render Logout Button Separately */}
                <Button
                    variant="ghost"
                    onClick={() => logoutUser()} // Calls the server action
                    className={cn(
                        "w-full justify-start ",
                        collapsed && "justify-center"
                    )}
                >
                    <LogOut className="w-4 h-4" />
                    {!collapsed && <span>Sign out</span>}
                </Button>
            </nav>
        </aside >
    );
}

export default Sidebar;