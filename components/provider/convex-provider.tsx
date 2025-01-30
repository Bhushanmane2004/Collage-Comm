"use client";

import { ReactNode, useEffect, useState } from "react";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import {
  ClerkProvider,
  useAuth,
  useUser,
  RedirectToSignIn,
} from "@clerk/clerk-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export const ConvexClientProvider = ({ children }: { children: ReactNode }) => {
  const { resolvedTheme, setTheme } = useTheme();
  const [actualTheme, setActualTheme] = useState<string | null>(null);

  useEffect(() => {
    const storedTheme = localStorage.getItem("jotion-theme");
    setActualTheme(storedTheme || "system");
    setTheme(storedTheme || "system");
  }, [setTheme]);

  return (
    <ClerkProvider
      appearance={{}}
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}
    >
      <ConvexProviderWithClerk useAuth={useAuth} client={convex}>
        <AuthCheck>{children}</AuthCheck> {/* Add authentication check */}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
};

const AuthCheck = ({ children }: { children: ReactNode }) => {
  const { isSignedIn, signOut } = useAuth();
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      const email = user.primaryEmailAddress?.emailAddress || "";
      if (!email.endsWith("@viit.ac.in")) {
        alert("Access Denied: Only VIIT students can log in.");
        signOut(); // Force logout
        router.push("/"); // Redirect unauthorized users
      }
    }
  }, [isSignedIn, isLoaded, user, router, signOut]);

  if (!isLoaded) return null; // Prevent rendering before auth loads

  return isSignedIn &&
    user?.primaryEmailAddress?.emailAddress.endsWith("@viit.ac.in") ? (
    children
  ) : (
    <RedirectToSignIn />
  );
};

export default ConvexClientProvider;
