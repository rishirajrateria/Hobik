"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Plain sticky header on paper with a hairline rule. */
export function HeaderShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  // Close the mobile menu after navigating.
  useEffect(() => {
    document.querySelectorAll<HTMLDetailsElement>("header details[open]").forEach((d) => (d.open = false));
  }, [path]);

  return (
    <header className="sticky top-0 z-50 border-b border-ink-100 bg-paper/95 backdrop-blur-sm">
      <div className="container-x flex h-[72px] items-center justify-between gap-6">{children}</div>
    </header>
  );
}
