import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
export const metadata = { title: 'Câu chuyện MÂISON' };
export default function About() {
  return (
    <div className="section information-page">
      <span className="eyebrow">THE MÂISON WAY</span>
      <h1>
        Phong cách bắt đầu
        <br />
        từ việc là chính bạn.
      </h1>
      <p>
        MÂISON được xây dựng từ một ý tưởng giản dị: tủ đồ đẹp nhất là tủ đồ có những món bạn thực
        sự muốn mặc. Không quá phức tạp. Không cần chạy theo mọi xu hướng.
      </p>
      <img
        className="information-image"
        src="/images/women.jpg"
        alt="Cảm hứng thời trang mỗi ngày"
      />
      <section>
        <h2>Ít hơn, nhưng tốt hơn.</h2>
        <p>
          Chúng tôi tuyển chọn những thiết kế nam và nữ với phom dáng dễ mặc, màu sắc dễ phối và các
          chi tiết chỉn chu. Từ chiếc sơ mi linen cho một ngày bận rộn đến chiếc đầm dành cho cuộc
          hẹn cuối tuần, mỗi sản phẩm đều hướng đến cuộc sống thường ngày của bạn.
        </p>
      </section>
      <section>
        <h2>Một tủ đồ, nhiều câu chuyện.</h2>
        <p>
          MÂISON mong những thiết kế của mình sẽ đồng hành cùng bạn qua nhiều mùa. Hãy tìm món đồ
          hợp với nhịp sống, vóc dáng và cá tính của mình — rồi kể câu chuyện theo cách riêng.
        </p>
        <Link className="button dark" href="/shop">
          Khám phá tủ đồ MÂISON <ArrowUpRight size={18} />
        </Link>
      </section>
    </div>
  );
}
