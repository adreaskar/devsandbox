'use client'

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from 'next/navigation'
import { Button } from "@/components/ui/button";
import {
    LayoutDashboard,
    FolderGit2,
    Settings,
    Terminal,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

const Sidebar = () => {

    const location = usePathname();

    const [collapsed, setCollapsed] = useState(false);

    const navItems = [
        { icon: LayoutDashboard, label: "Overview", path: "/overview" },
        { icon: FolderGit2, label: "Templates", path: "/templates" },
        { icon: Settings, label: "Settings", path: "/settings" },
    ];

    return (
        <aside
            className={cn(
                "glass-card border-r border-border/50 transition-all duration-300 flex flex-col",
                collapsed ? "w-16" : "w-64"
            )}
        >
            <div className="p-4 border-b border-border/50 flex items-center justify-between">
                {!collapsed && (
                    <Link href="/" className="flex items-center gap-2 font-bold text-lg">
                        <div className="p-2 rounded-lg gradient-primary">
                            <Terminal className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-gradient">DevSandbox</span>
                    </Link>
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
                                variant={isActive ? "secondary" : "ghost"}
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
            </nav>
        </aside>
    );
}

export default Sidebar;