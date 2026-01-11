import { Tajawal } from "next/font/google"; // Tajawal is a nice Arabic font
import "./globals.css";

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["400", "500", "700"], // Added 500
  variable: "--font-tajawal",
});

export const metadata = {
  title: "Link Manager",
  description: "وصرنا بين أهلنا في قطر - لطلب الكميات التواصل على الرقم 71777515",
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body className={tajawal.className}>
        <div className="container">
          {children}
        </div>
      </body>
    </html>
  );
}
