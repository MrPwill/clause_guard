"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "My Documents", icon: FileText },
  { href: "/create", label: "Create Document", icon: Plus },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 bg-white border-r border-brand-gray shrink-0 hidden md:block">
      <nav className="p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "text-brand-blue bg-brand-blue/5 border-l-2 border-brand-blue"
                  : "text-gray-600 hover:text-brand-dark hover:bg-gray-50"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}