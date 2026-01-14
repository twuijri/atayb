import { Tajawal } from "next/font/google"; // Tajawal is a nice Arabic font
import "./globals.css";
import { readFileSync } from 'fs';
import path from 'path';

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["400", "500", "700"], // Added 500
  variable: "--font-tajawal",
});

function getMetadata() {
  try {
    const configPath = path.join(process.cwd(), 'data', 'config.json');
    const config = JSON.parse(readFileSync(configPath, 'utf8'));
    return {
      title: config.siteTitle || 'Link Manager',
      description: config.siteDescription || 'منصة إدارة الروابط',
      openGraph: {
        title: config.siteTitle || 'Link Manager',
        description: config.siteDescription || 'منصة إدارة الروابط',
      }
    };
  } catch (error) {
    return {
      title: 'Link Manager',
      description: 'منصة إدارة الروابط',
      openGraph: {
        title: 'Link Manager',
        description: 'منصة إدارة الروابط',
      }
    };
  }
}

export const metadata = getMetadata();

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
