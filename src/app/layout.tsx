import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { StoreProvider } from '@/context/StoreContext';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'CYBERFORGE PC — Интернет-магазин комплектующих, Конструктор ПК и Калькулятор FPS',
  description:
    'Сборка ПК своими руками с живой визуализацией, проверкой совместимости деталей, расчетом FPS в 20 тяжелых играх и оплатой через Telegram в сумах (UZS). Доставка по Ташкенту и Узбекистану.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ru"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-black text-neutral-100">
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
