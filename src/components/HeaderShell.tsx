"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Floating liquid-glass header bar. */
export function HeaderShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  // Close the mobile menu after navigating.
  useEffect(() => {
    document.querySelectorAll<HTMLDetailsElement>("header details[open]").forEach((d) => (d.open = false));
  }, [path]);

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-5">
      <div className="lg mx-auto flex h-[68px] max-w-[1488px] items-center justify-between gap-6 !rounded-full pr-2.5 pl-5 sm:pl-6">{children}</div>
    </header>
  );
}
