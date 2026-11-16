import Link from 'next/link';
import {
  ArrowUpRight,
  ArrowRight,
  Truck,
  RefreshCcw,
  ShieldCheck,
  Headphones,
  MoveUpRight,
  Sparkles,
} from 'lucide-react';
import { getProducts } from '@/lib/db';
import { HomeProducts } from '@/components/home-products';
import { StyleEdit } from '@/components/style-edit';
export const dynamic = 'force-dynamic';
export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="small-line" /> THE NEW EVERYDAY — COLLECTION 2026
          </div>
          <h1>
            Mặc điều
            <br />
            bạn <em>yêu.</em>
            <span className="hero-asterisk">✳</span>
          </h1>
          <p>
            Không cần quá nhiều để trở nên khác biệt. <br />
            Chỉ cần những thiết kế khiến bạn là chính mình.
          </p>
          <Link className="button dark" href="/shop">
            Khám phá bộ sưu tập <ArrowUpRight size={19} />
          </Link>
          <div className="hero-bottom">
            <span>
              THIẾT KẾ TINH TẾ.
              <br />
              PHONG CÁCH VƯỢT THỜI GIAN.
            </span>
            <span className="hero-number">
              01 <i>/ 26</i>
            </span>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-main-image">
            <img
              src="/images/hero.jpg"
              alt="Phong cách thanh lịch với áo khoác xanh và phụ kiện tinh tế"
              fetchPriority="high"
            />
            <div className="image-label">
              <span>
                THE ART OF
                <br />
                <strong>being you.</strong>
              </span>
              <Link href="/shop?gender=women" aria-label="Khám phá thời trang nữ">
                <ArrowUpRight size={27} />
              </Link>
            </div>
          </div>
          <div className="hero-side">
            <div className="vertical-caption">LESS, BUT BETTER. — MÂISON STUDIO</div>
            <img
              src="/images/men.jpg"
              alt="Thời trang nam thành thị hiện đại"
              fetchPriority="high"
            />
            <Link href="/shop?gender=men">
              <span>
                FOR HIM
                <br />
                <strong>Tự tin. Theo cách riêng.</strong>
              </span>
              <ArrowUpRight size={22} />
            </Link>
          </div>
          <span className="hero-edition">
            A NEW SEASON.
            <br />A NEW PERSPECTIVE.
          </span>
        </div>
      </section>
      <div className="benefits">
        <div>
          <Truck />
          <span>
            <strong>Giao hàng miễn phí</strong>
            <small>Với đơn hàng từ 699.000đ</small>
          </span>
        </div>
        <div>
          <RefreshCcw />
          <span>
            <strong>Đổi trả dễ dàng</strong>
            <small>Trong vòng 30 ngày</small>
          </span>
        </div>
        <div>
          <ShieldCheck />
          <span>
            <strong>Chất lượng chọn lọc</strong>
            <small>Chỉn chu trong từng chi tiết</small>
          </span>
        </div>
        <div>
          <Headphones />
          <span>
            <strong>Luôn ở đây vì bạn</strong>
            <small>Hỗ trợ tận tâm mỗi ngày</small>
          </span>
        </div>
      </div>
      <section className="section categories-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">YOUR STYLE, YOUR STORY</span>
            <h2>
              Thế giới của <em>bạn.</em>
            </h2>
          </div>
          <p>
            Mỗi phong cách, một câu chuyện.
            <br />
            Tìm cảm hứng cho chương tiếp theo của bạn.
          </p>
        </div>
        <div className="category-grid">
          <Link href="/shop?gender=women" className="category-tile women-tile">
            <img src="/images/women.jpg" alt="Khám phá phong cách thời trang nữ" loading="lazy" />
            <div>
              <span>EFFORTLESSLY YOU</span>
              <h3>Dành cho Nữ</h3>
              <p>Thanh lịch trong từng khoảnh khắc</p>
            </div>
            <span className="circle-arrow">
              <ArrowUpRight />
            </span>
          </Link>
          <Link href="/shop?gender=men" className="category-tile men-tile">
            <img src="/images/men.jpg" alt="Khám phá phong cách thời trang nam" loading="lazy" />
            <div>
              <span>CONFIDENCE IN EVERY DETAIL</span>
              <h3>Dành cho Nam</h3>
              <p>Tối giản. Tinh tế. Đầy bản lĩnh.</p>
            </div>
            <span className="circle-arrow">
              <ArrowUpRight />
            </span>
          </Link>
          <Link href="/shop?category=Phụ%20kiện" className="accessory-tile">
            <div className="accessory-top">
              <span className="eyebrow">THE FINISHING TOUCH</span>
              <Sparkles size={23} />
            </div>
            <h3>
              Chi tiết nhỏ.
              <br />
              <em>Dấu ấn lớn.</em>
            </h3>
            <img src="/images/bag.jpg" alt="Phụ kiện balo City Explorer" loading="lazy" />
            <span className="accessory-bottom">
              Khám phá phụ kiện <ArrowUpRight size={22} />
            </span>
          </Link>
        </div>
      </section>
      <HomeProducts products={getProducts()} />
      <StyleEdit />
      <section className="editorial-banner">
        <div className="editorial-photo">
          <img
            src="/images/blouse.jpg"
            alt="Cảm hứng phối đồ hằng ngày cùng MÂISON"
            loading="lazy"
          />
          <span>MÂISON / THE EVERYDAY EDIT</span>
        </div>
        <div className="editorial-copy">
          <span className="eyebrow">LESS IS MORE. YOU ARE ENOUGH.</span>
          <h2>
            Ít hơn một chút.
            <br />
            <em>Là bạn nhiều hơn.</em>
          </h2>
          <p>
            Chúng tôi tin rằng phong cách không nằm ở số lượng, mà ở những lựa chọn. Những món đồ dễ
            mặc, dễ yêu và ở lại thật lâu trong tủ đồ của bạn.
          </p>
          <Link className="button dark" href="/about">
            Câu chuyện MÂISON <ArrowUpRight size={18} />
          </Link>
          <div className="editorial-sign">
            Thoughtfully made. Truly yours. <MoveUpRight size={30} />
          </div>
        </div>
      </section>
      <div className="brand-ribbon">
        <span>DESIGNED FOR REAL LIFE</span>
        <span>✳</span>
        <span>MADE TO BE YOURS</span>
        <span>✳</span>
        <span>EVERYDAY, ELEVATED</span>
        <span>✳</span>
        <span>THE MÂISON WAY</span>
        <ArrowRight size={25} />
      </div>
    </>
  );
}
