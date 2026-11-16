import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Đến nội dung chính
      </a>
      <Header />
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      <Footer year={new Date().getUTCFullYear()} />
    </>
  );
}
