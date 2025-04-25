"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export default function Home() {
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      // Redirect unauthenticated users to sign-in
      router.push("/sign-in");
    } else {
      // Redirect authenticated users to their dashboard
      const role = user?.publicMetadata.role as string;
      if (role) {
        router.push(`/${role}`);
      } else {
        // Fallback if role isn't set
        router.push("/sign-in");
      }
    }
  }, [isLoaded, isSignedIn, user, router]);

  // Return a loading state or empty div while redirecting
  return <div className="h-screen flex items-center justify-center bg-lamaSkyLight"></div>;
}
