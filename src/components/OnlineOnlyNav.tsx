"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { requiresConnection } from "@/lib/offlineRoutes";
import { cn } from "@/lib/utils";
import { useOfflineNav } from "@/components/OfflineNavProvider";

type OnlineOnlyButtonProps = ComponentProps<typeof Button> & {
  href: string;
};

/** Botón de navegación: deshabilitado offline si la ruta requiere conexión. */
export function OnlineOnlyButton({
  href,
  children,
  className,
  onClick,
  ...props
}: OnlineOnlyButtonProps) {
  const online = useOnlineStatus();
  const { showOfflinePrompt } = useOfflineNav();
  const needsConnection = requiresConnection(href);
  const blocked = needsConnection && !online;

  if (!blocked) {
    return (
      <Button asChild className={className} {...props}>
        <Link href={href}>{children}</Link>
      </Button>
    );
  }

  return (
    <Button
      type="button"
      aria-disabled
      className={cn(className, "cursor-not-allowed opacity-50")}
      onClick={(e) => {
        onClick?.(e);
        showOfflinePrompt();
      }}
      {...props}
    >
      {children}
    </Button>
  );
}

type OnlineOnlyLinkProps = ComponentProps<typeof Link>;

function hrefToString(href: OnlineOnlyLinkProps["href"]): string {
  if (typeof href === "string") return href;
  if (href.pathname) return href.pathname;
  return "/";
}

/** Enlace de texto: deshabilitado offline si la ruta requiere conexión. */
export function OnlineOnlyLink({
  href,
  children,
  className,
  onClick,
  ...props
}: OnlineOnlyLinkProps) {
  const online = useOnlineStatus();
  const { showOfflinePrompt } = useOfflineNav();
  const hrefStr = hrefToString(href);
  const needsConnection = requiresConnection(hrefStr);
  const blocked = needsConnection && !online;

  if (!blocked) {
    return (
      <Link href={href} className={className} onClick={onClick} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={cn(
        className,
        "cursor-not-allowed opacity-50 hover:no-underline",
      )}
      onClick={() => {
        showOfflinePrompt();
      }}
    >
      {children}
    </button>
  );
}
