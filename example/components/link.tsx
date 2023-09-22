import clsx from "clsx";
import type { PropsWithChildren } from "react";
import { useLocation } from "wouter";

export function Underline({ active }: { active?: boolean }) {
  return (
    <span
      className={clsx(
        "block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-teal-500",
        active && "max-w-full"
      )}
    />
  );
}

export function Link({ href, children }: PropsWithChildren<{ href: string }>) {
  const [location] = useLocation();

  return (
    <a href={href} className="font-semibold group transition duration-300">
      <span className="block max-w-0 h-0.5" />
      {children}
      <Underline active={href === location} />
    </a>
  );
}
