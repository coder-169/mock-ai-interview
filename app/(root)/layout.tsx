import { Button } from "@/components/ui/button";
import { isAuthenticated } from "@/lib/actions/auth.action";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const isUserAuthenticated = await isAuthenticated();
  if (!isUserAuthenticated) redirect("/sign-in");
  console.log(isUserAuthenticated)  
  return (
    <div className="root-layout">
      <nav className="flex items-center justify-between p-4 ">
        <Link href={"/"} className="flex items-center gap-2">
          <Image width={38} height={32} src={"/logo.svg"} alt="Logo" />
          <h2 className="text-primary-100">Mock Ai Interview</h2>
        </Link>
        {isUserAuthenticated ? (
          <Button asChild className="btn-primary">
            Sign Out
          </Button>
        ) : (
          <Button asChild className="btn-primary">
            <Link href={"/sign-in"}>Sign In</Link>
          </Button>
        )}
      </nav>
      {children}
    </div>
  );
};

export default RootLayout;
