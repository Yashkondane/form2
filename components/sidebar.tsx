"use client";

import { Button } from "./ui/button";
import { Search, Folder, Clock, Users, Star, ChevronDown } from "lucide-react";
import Link from "next/link";

export default function Sidebar() {
    const navItems = [
        { icon: Search, label: "Search" },
        { icon: Folder, label: "Projects" },
        { icon: Clock, label: "Recent Chats" },
        { icon: Users, label: "Community" },
    ];

    const recentChats = [
        "Pointer AI landing page",
        "Shaders Hero Section",
        "Remya portfolio website",
        "SmartSample Web App",
        "Business AI assistant",
    ];

    return (
        <aside className="w-72 m-2 mr-0 p-4 space-y-6 glass-card flex flex-col">
            <div className="flex-shrink-0">
                <Button className="w-full bg-primary/90 backdrop-blur-sm">New Chat</Button>
            </div>
            <nav className="space-y-2 flex-shrink-0">
                {navItems.map((item) => (
                    <Link
                        key={item.label}
                        href="#"
                        className="flex items-center gap-3 p-2 rounded-md hover:bg-white/10 transition-colors text-sm text-muted-foreground"
                    >
                        <item.icon className="w-5 h-5" />
                        <span>{item.label}</span>
                    </Link>
                ))}
            </nav>
            <div className="flex-grow overflow-y-auto">
                <div className="space-y-2">
                    <h3 className="px-2 text-sm font-semibold text-muted-foreground flex justify-between items-center">
                        Favorites <Star className="w-4 h-4" />
                    </h3>
                    <h3 className="px-2 text-sm font-semibold text-muted-foreground flex justify-between items-center mt-4">
                        Recent Chats <ChevronDown className="w-4 h-4" />
                    </h3>
                    <div className="pl-2">
                        {recentChats.map((chat) => (
                            <Link
                                key={chat}
                                href="#"
                                className="flex items-center gap-3 p-2 rounded-md hover:bg-white/10 transition-colors text-sm text-muted-foreground"
                            >
                                {chat}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </aside>
    );
}