import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Terminal } from "lucide-react";

export const Navbar = () => {
  return (
    <nav className="border-b border-border/50 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold text-xl">
          <div className="p-2 rounded-md border-border border bg-primary">
            <Terminal className="w-4 h-4" />
          </div>
          <span className="text-2xl">DevSandbox</span>
        </Link>

        <Link href="/overview">
          <Button variant="default">Sign In</Button>
        </Link>

      </div>
    </nav>
  );
};
