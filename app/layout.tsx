import type { Metadata } from "next";
import "./ui/globals.css";
import Script from "next/script";
import localFont from "next/font/local";

const fontAvenirNext = localFont({
  variable: "--font-avenir-next",
  src: [
    {
      path: "./../public/fonts/AvenirNextLight.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "./../public/fonts/AvenirNextRegular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./../public/fonts/AvenirNextMedium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./../public/fonts/AvenirNextDemi.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "./../public/fonts/AvenirNextBold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
});

export const metadata: Metadata = {
  title: "Honda Future Scenarios",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${fontAvenirNext.variable}`}>{children}</body>
      <Script
        src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTHA_SITE_KEY}`}
      />
    </html>
  );
}
