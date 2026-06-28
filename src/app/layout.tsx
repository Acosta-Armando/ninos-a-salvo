import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import { ConnectionStatusBar } from "@/components/offline/ConnectionStatusBar";
import { PendingSyncBar } from "@/components/offline/PendingSyncBar";
import { OfflineNavProvider } from "@/components/offline/OfflineNavProvider";
import { OfflinePrecache } from "@/components/offline/OfflinePrecache";
import { SyncProvider } from "@/components/offline/SyncProvider";
import { ThemeProvider, THEME_COOKIE } from "@/components/layout/ThemeProvider";
import { PwaInstallProvider } from "@/components/pwa/PwaInstallProvider";
import { SiteFooter } from "@/components/layout/SiteFooter";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Niños a Salvo",
  description:
    "Reencuentro familiar de niños, niñas y adolescentes tras emergencia sísmica en Venezuela",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/icons/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Niños a Salvo",
  },
};

export const viewport: Viewport = {
  themeColor: "#d97706",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const themeCookie = cookieStore.get(THEME_COOKIE)?.value;
  const theme = themeCookie === "dark" ? "dark" : "light";

  return (
    <html
      lang="es"
      className={`${inter.variable} h-full antialiased ${theme === "dark" ? "dark" : ""}`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col font-sans">
        <ThemeProvider defaultTheme={theme}>
          <PwaInstallProvider>
            <SyncProvider>
              <OfflineNavProvider>
              <div className="sticky top-0 z-50">
                <ConnectionStatusBar />
                <PendingSyncBar />
              </div>
              <OfflinePrecache />
              <div className="flex min-h-full flex-1 flex-col">{children}</div>
              <SiteFooter />
            </OfflineNavProvider>
            </SyncProvider>
          </PwaInstallProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
