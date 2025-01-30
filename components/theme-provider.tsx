"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{children}</>; // Prevent hydration mismatch by skipping rendering until mounted
  }

  return (
    <NextThemesProvider defaultTheme="dark" attribute="class" {...props}>
      {children}
    </NextThemesProvider>
  );
}
