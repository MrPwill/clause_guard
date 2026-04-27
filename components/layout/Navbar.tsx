"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield } from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthPage = pathname?.startsWith("/login") || pathname?.startsWith("/signup");

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setUserEmail(user?.email ?? null);
      setIsLoading(false);
    }
    getUser();
  }, [supabase]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  if (isAuthPage) return null;

  return (
    <nav className="sticky top-0 z-50 h-16 bg-white border-b border-brand-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-brand-blue to-brand-green flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-brand-dark">ClauseGuard</span>
          <span className="text-xs font-medium text-brand-teal ml-1 tracking-wider">AFRICA</span>
        </Link>

        <div className="flex items-center gap-4">
          {isLoading ? (
            <div className="w-20 h-8 bg-gray-100 animate-pulse rounded" />
          ) : userEmail ? (
            <>
              <Link href="/dashboard" className="text-sm font-medium text-brand-dark hover:text-brand-blue transition-colors">
                Dashboard
              </Link>
              <span className="text-sm text-gray-500 hidden sm:inline">{userEmail}</span>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Log out
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" className="bg-brand-blue hover:bg-brand-blue/90">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}