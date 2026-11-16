import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
export default function NotFound() {
  return (
    <main className="section empty-state" style={{ minHeight: '100vh' }}>
      <Link className="wordmark" href="/">
        MÂISON
      </Link>
      <span className="eyebrow" style={{ margin: '40px 0 15px' }}>
        404 / A LITTLE OFF THE RUNWAY
      </span>
      <h1>Trang này đã đi đâu mất rồi.</h1>
      <p>Có thể sản phẩm không còn hoặc đường dẫn đã thay đổi.</p>
      <Link href="/" className="button dark">
        <ArrowLeft size={17} /> Trở về cửa hàng
      </Link>
    </main>
  );
}
