import "./globals.css";
import { Poppins, TASA_Orbiter } from "next/font/google";
import { Toaster } from "sonner";

const font = Poppins({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "600", "700"],
});

const orbiter = TASA_Orbiter({
  subsets: ["latin"],
  variable: "--font-orbiter",
  weight: ["400", "500", "600", "700"],
  adjustFontFallback: false,
  display: "swap",
});

export const metadata = {
  title: "Dev Sandbox",
  description: "made by Adreas Kar",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${font.variable} ${orbiter.variable} `}>
        {children}
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
