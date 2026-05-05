import type { Metadata, Viewport } from "next";
import "./globals.css";
import Providers from "@/components/common/Providers";
import ToastContainer from "@/components/common/Toast";

export const metadata: Metadata = {
  title: {
    default: "Hypertube",
    template: "%s | Hypertube",
  },
  description: "Search and watch free, legal videos streamed directly in your browser.",
  keywords: ["movies", "streaming", "video", "torrent", "legal"],
  authors: [{ name: "Hypertube Team" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <body suppressHydrationWarning>
        <Providers>
          {children}
          <ToastContainer />
        </Providers>
      </body>
    </html>
  );
}