import type { Metadata } from 'next';
import './fonts.css';
import './globals.css';
import { StoreProvider } from '@/components/store-provider';
export const metadata: Metadata = {
  title: { default: 'MÂISON — Phong cách là chính bạn', template: '%s | MÂISON' },
  description:
    'Khám phá thời trang nam và nữ MÂISON. Thiết kế tinh tế, chất liệu chọn lọc và những món đồ đồng hành cùng bạn mỗi ngày.',
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      {/* Browser extensions can add attributes to body before React hydrates.
          Limit suppression to this element; children still report mismatches. */}
      <body suppressHydrationWarning>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
