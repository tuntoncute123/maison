# MÂISON — Cửa hàng thời trang nam & nữ

Ứng dụng full-stack bằng **Next.js 16 App Router, React 19, TypeScript**. Frontend và API dùng chung một dự án; dữ liệu sản phẩm, tài khoản quản trị, phiên đăng nhập, email đăng ký và đơn hàng lưu trong **SQLite** trên máy chủ. Giao diện tiếng Việt, responsive cho điện thoại, tablet và desktop.

## Chạy tại máy

Yêu cầu **Node.js 24 LTS** (sử dụng module tích hợp `node:sqlite`).

```bash
npm install
cp .env.example .env.local
npm run dev
```

- Cửa hàng: `http://localhost:3000`
- Quản trị: `http://localhost:3000/admin`
- Tài khoản được khởi tạo lần đầu từ `.env.local`: `admin@maison.vn` / `Maison@2026`.

Tài khoản trên dùng để trải nghiệm tại máy. Cấu hình thông tin quản trị riêng trước khi mở bán. Mật khẩu được băm bằng scrypt; cookie đăng nhập HttpOnly, SameSite=Lax, hết hạn sau 24 giờ. Khi phục vụ qua HTTPS, đặt `COOKIE_SECURE=true`.

```bash
npm run build
npm run start
```

Không có dịch vụ nào được publish hoặc deploy tự động.

## Chức năng

**Người mua**

- Trang chủ, bộ sưu tập nam/nữ/unisex, tìm kiếm, lọc danh mục, ưu đãi, hàng mới, sắp xếp giá.
- Chi tiết sản phẩm, màu sắc, kích cỡ, hướng dẫn chọn size, danh sách yêu thích.
- Giỏ hàng lưu trong localStorage; chỉnh số lượng, xóa sản phẩm, tính phí vận chuyển.
- Đặt hàng **COD**. Máy chủ tự tính giá, xác thực biến thể, kiểm tra và trừ tồn kho trong cùng giao dịch SQLite.
- `WELCOME10`: giảm 10%, tối đa 100.000đ. Vận chuyển 30.000đ, miễn phí khi tạm tính từ 699.000đ trước giảm giá.
- Tra cứu bằng mã đơn + số điện thoại; không công khai danh sách đơn hoặc thông tin khách hàng.
- Lưu email đăng ký nhận tin, chưa kết nối dịch vụ gửi email.

**Người bán**

- Đăng nhập, đăng xuất, bảo vệ cả trang và API quản trị.
- Tổng quan doanh thu từ đơn **hoàn thành**, biểu đồ và trạng thái đơn trong 7/30/90 ngày.
- Thêm, sửa, xóa sản phẩm; quản lý danh mục, giá, ảnh (URL hoặc đường dẫn), size, màu, nhãn và tổng tồn kho.
- Xem chi tiết đơn, tìm kiếm, lọc trạng thái, xuất CSV (có xử lý công thức CSV).
- Chuyển trạng thái: Chờ xác nhận → Đã xác nhận → Đang giao → Hoàn thành.
- Hủy khi chờ xác nhận hoặc đã xác nhận; hoàn tồn kho một lần. Đơn đang giao/hoàn thành/đã hủy không được hủy lại.
- Danh sách khách hàng được tổng hợp theo số điện thoại và chi tiêu từ đơn hoàn thành.

## Cấu trúc chính

```text
src/app/(store)/       Các trang dành cho người mua
src/app/admin/         Giao diện đăng nhập và quản trị
src/app/api/           Route Handlers cho sản phẩm, đơn, phiên đăng nhập, nhận tin
src/components/       Thành phần giao diện mua sắm
src/components/admin/ Thành phần quản trị, biểu mẫu và hộp thoại
src/lib/db.ts         SQLite schema, truy vấn và khởi tạo dữ liệu
src/lib/auth.ts       Phiên đăng nhập và kiểm tra nguồn yêu cầu
src/lib/validation.ts Xác thực sản phẩm ở máy chủ
src/lib/seed.ts       8 sản phẩm mẫu
public/images/        Ảnh được lưu cục bộ
public/fonts/         DM Sans và Playfair Display lưu cục bộ
artifacts/            Ảnh kiểm chứng giao diện
```

## Dữ liệu & vận hành

- File mặc định: `data/maison.sqlite`. Đổi bằng `DATABASE_PATH`.
- Lần chạy đầu khởi tạo sản phẩm và tài khoản từ biến môi trường. Các lần sau giữ nguyên dữ liệu.
- Đổi biến `ADMIN_PASSWORD` không thay đổi tài khoản đã tồn tại. Có thể dùng `npm run admin:reset` để cập nhật tài khoản từ `.env.local`, đồng thời vô hiệu hóa các phiên đăng nhập cũ.
- SQLite dùng WAL. Sao lưu nhất quán bằng SQLite backup API hoặc dừng tiến trình trước khi sao chép; không chỉ sao chép `.sqlite` khi còn giao dịch trong WAL.
- Tồn kho hiện quản lý tổng theo sản phẩm, chưa tách theo từng cặp màu/size.
- Tệp SQLite yêu cầu ổ đĩa bền vững, chạy một instance Node.js. Nếu mở rộng nhiều instance/serverless cần chuyển lớp dữ liệu sang PostgreSQL hoặc dịch vụ tương đương.
- Giá, sản phẩm và ảnh là dữ liệu mẫu; cần thay bằng danh mục và hình ảnh bán hàng thực tế. Tên cửa hàng, chính sách, kênh liên hệ nằm trong các component/trang tương ứng.
- Chưa tích hợp cổng thanh toán online, hãng vận chuyển, gửi email/SMS hoặc tài khoản đăng nhập người mua. Quy trình hiện tại là đặt COD và cửa hàng tự xác nhận/giao hàng.

## Kiểm chứng

```bash
npm run typecheck
npm run build
npx playwright install --with-deps chromium
npm run test:e2e
```

Playwright khởi chạy bản production ở cổng **3187**, tạo một SQLite riêng trong thư mục tạm, không dùng dữ liệu cửa hàng. Kiểm tra thực tế: luồng mua/tra cứu đơn, localStorage, quyền quản trị, giá máy chủ, biến thể, tồn kho, hủy hoàn kho, CRUD sản phẩm, xuất CSV, đăng ký nhận tin và bố cục responsive. Ảnh chụp được ghi vào `artifacts/`.

Trong môi trường thực hiện dự án này, Chromium cần đường dẫn thư viện có sẵn:

```bash
LD_LIBRARY_PATH=/tmp/kimngan-schedule-browser-libs/extracted/usr/lib/x86_64-linux-gnu npm run test:e2e
```

Trên máy có đủ thư viện Chromium, chỉ cần `npm run test:e2e`.

## Nguồn tài nguyên

Ảnh mẫu từ [Unsplash](https://unsplash.com/license); ID ảnh được ghi trong `ASSETS.md`. Font [DM Sans](https://github.com/google/fonts/tree/main/ofl/dmsans) và [Playfair Display](https://github.com/google/fonts/tree/main/ofl/playfairdisplay) theo SIL Open Font License. Icon dùng Lucide (ISC). Mọi tài nguyên hiển thị chính được phục vụ cục bộ, không cần gọi Google Fonts hoặc Unsplash khi người dùng mở trang.
