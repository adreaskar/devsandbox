import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export const Navbar = () => {
  return (
    <nav className="border-b border-border/50">
      <div className="container flex h-16 items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-xl"
        >
          <Image
            src="/img/logomuted.png"
            alt="DevSandbox Logo"
            width={49}
            height={49}
          />
          <span className="text-3xl">DevSandbox</span>
        </Link>

        <Link href="/login">
          <Button variant="default">Sign In</Button>
        </Link>
      </div>
    </nav>
  );
};
