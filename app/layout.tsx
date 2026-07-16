import { CartProvider } from "components/cart/cart-context";
import { Navbar } from "components/layout/navbar";
import { GeistSans } from "geist/font/sans";
import { getCart } from "lib/shopify";
import type { Metadata, Viewport } from "next";
import { ReactNode } from "react";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { baseUrl } from "lib/utils";

const { SITE_NAME } = process.env;

const APPLE_TOUCH_ICON_SIZES = [
  57, 60, 72, 76, 114, 120, 144, 152, 167, 180,
];

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: SITE_NAME!,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Activewear para mujer y hombre en México — leggings, tops, shorts y chamarras de rendimiento real, sin sacrificar estilo.",
  robots: {
    follow: true,
    index: true,
  },
  // Fallback sitewide — cada página con contenido propio (home, producto, etc.)
  // debe sobreescribir openGraph/twitter completos (Next.js reemplaza el objeto
  // entero, no hace merge por llave) en vez de depender de este default.
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "es_MX",
  },
  twitter: {
    card: "summary_large_image",
  },
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      {
        url: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    apple: APPLE_TOUCH_ICON_SIZES.map((size) => ({
      url: `/apple-touch-icon-${size}x${size}.png`,
      sizes: `${size}x${size}`,
      type: "image/png",
    })),
  },
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Don't await the fetch, pass the Promise to the context provider
  const cart = getCart();

  return (
    <html lang="es" className={GeistSans.variable}>
      <body className="flex min-h-screen flex-col bg-white text-black selection:bg-black selection:text-white">
        <CartProvider cartPromise={cart}>
          <Navbar />
          <main className="flex flex-1 flex-col pb-24 md:pb-0">
            {children}
            <Toaster closeButton />
          </main>
        </CartProvider>
        <Analytics />
      </body>
    </html>
  );
}
