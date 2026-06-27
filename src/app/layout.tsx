import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import { ThemeProvider, THEME_COOKIE } from "@/components/ThemeProvider";
import { PwaInstallProvider } from "@/components/PwaInstallProvider";
import { SiteFooter } from "@/components/SiteFooter";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Niños a Salvo",
  description:
    "Reencuentro familiar de niños tras emergencia sísmica en Venezuela",
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
            <div className="flex min-h-full flex-1 flex-col">{children}</div>
            <SiteFooter />
          </PwaInstallProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
