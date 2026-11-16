'use client';
export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="section empty-state">
      <h1>Có một chút gián đoạn.</h1>
      <p>Không thể tải nội dung lúc này. Vui lòng thử lại.</p>
      <button className="button dark" onClick={reset}>
        Thử lại
      </button>
    </div>
  );
}
