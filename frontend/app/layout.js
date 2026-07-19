import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Resume Roaster 🔥 — Get Your Resume Roasted",
  description:
    "Upload your resume and get hilariously roasted by an AI with a savage Hinglish sense of humour. Brutal, funny, and actually useful feedback.",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
