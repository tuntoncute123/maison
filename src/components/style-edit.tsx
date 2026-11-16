import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

const edits = [
  {
    number: '01',
    mood: 'THỨ HAI, THẬT NHẸ NHÀNG',
    title: 'Thanh lịch đến văn phòng.',
    description: 'Sơ mi mềm mại, đường cắt gọn gàng. Sẵn sàng cho một ngày đầy cảm hứng.',
    image: '/images/blouse.jpg',
    href: '/shop?category=Áo%20sơ%20mi',
    link: 'Khám phá áo sơ mi',
  },
  {
    number: '02',
    mood: 'CUỐI TUẦN, THEO Ý BẠN',
    title: 'Một chút tự do.',
    description: 'Áo thun dễ mặc, phom dáng thoải mái. Cho những cuộc hẹn không cần lên kế hoạch.',
    image: '/images/tshirt.jpg',
    href: '/shop?category=Áo%20thun',
    link: 'Khám phá áo thun',
  },
  {
    number: '03',
    mood: 'NHỮNG KHOẢNH KHẮC RIÊNG',
    title: 'Dịu dàng, đầy dấu ấn.',
    description: 'Một chiếc đầm yêu thích là đủ. Để mỗi bước chân đều mang nét riêng của bạn.',
    image: '/images/dress.jpg',
    href: '/shop?category=Đầm%20%26%20Chân%20váy',
    link: 'Khám phá đầm & chân váy',
  },
];

export function StyleEdit() {
  return (
    <section className="style-edit" aria-labelledby="style-edit-title">
      <div className="section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">THE STYLE NOTES / MÂISON STUDIO</span>
            <h2 id="style-edit-title">
              Cảm hứng cho <em>mỗi ngày.</em>
            </h2>
          </div>
          <p>
            Ba nhịp sống. Ba cách thể hiện.
            <br />
            Luôn là chính bạn.
          </p>
        </div>
        <div className="style-grid">
          {edits.map((edit) => (
            <Link href={edit.href} className="style-card" key={edit.number}>
              <div className="style-image">
                <img src={edit.image} alt={edit.title} loading="lazy" />
                <span className="style-index">{edit.number} / THE EVERYDAY EDIT</span>
                <span className="style-arrow" aria-hidden="true">
                  <ArrowUpRight />
                </span>
              </div>
              <span className="eyebrow">{edit.mood}</span>
              <h3>{edit.title}</h3>
              <p>{edit.description}</p>
              <span className="style-link">
                {edit.link} <ArrowUpRight size={18} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
