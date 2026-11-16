# MÂISON — Cửa hàng thời trang nam & nữ

Ứng dụng **Next.js 16 App Router, React 19, TypeScript**, hiện chạy bằng **JSON mock data** để xem và thử website trên Vercel trước khi nối database thật. Không cần SQLite, dịch vụ database hay biến môi trường để mở cửa hàng.

## Chạy tại máy

Yêu cầu **Node.js 24**.

```bash
npm install
npm run dev
```

- Cửa hàng: `http://localhost:3000`
- Quản trị: `http://localhost:3000/admin`
- Tài khoản demo mặc định: `admin@maison.vn` / `Maison@2026`.
- Có thể sao chép `.env.example` thành `.env.local` và đổi `ADMIN_EMAIL`, `ADMIN_PASSWORD`. Biến môi trường được ưu tiên hơn tài khoản demo.

```bash
npm run build
npm run start
```

## Dữ liệu JSON

Chỉnh **`src/data/db.json`** để thay đổi dữ liệu khởi đầu:

- `products`: 8 sản phẩm mẫu, gồm ảnh, mô tả, giá, size, màu, tồn kho và nhãn.
- `orders`: 3 đơn giả lập ở các trạng thái khác nhau để xem quản trị, khách hàng và tra cứu.
- `subscribers`: email mẫu đăng ký nhận tin.

Ví dụ tra cứu dữ liệu mẫu: mã `MS-DEMO0001`, số điện thoại `0900000001`. Toàn bộ tên, địa chỉ, số điện thoại và email trong JSON là dữ liệu giả lập.

JSON được import trực tiếp vào server bundle. Khi chạy, ứng dụng sao chép dữ liệu sang bộ nhớ; **không tạo thư mục, không ghi file JSON/SQLite và không dùng `/tmp` để lưu dữ liệu**. `DATABASE_PATH` cũ không còn được sử dụng. File SQLite cũ không bị xóa hoặc tự chuyển đổi.

Thêm/sửa/xóa sản phẩm, đặt/hủy đơn, thay đổi tồn kho và đăng ký nhận tin chỉ mô phỏng trong bộ nhớ của từng instance. Những thay đổi này **không ghi lại vào JSON**, mất khi tiến trình khởi động lại hoặc deploy, và **không đồng bộ giữa các instance Vercel**. Vì vậy một đơn vừa tạo có thể không tra cứu được nếu yêu cầu sau tới instance khác. Đây là bản demo, chưa dùng để nhận đơn thật. Muốn thay đổi dữ liệu mặc định trên mọi instance, sửa JSON rồi build/deploy lại.

Giỏ hàng và yêu thích vẫn lưu trong localStorage của trình duyệt. Khách hàng trên trang quản trị được tổng hợp từ đơn hàng.

## Chạy trên Vercel

Dự án dùng cấu hình Next.js mặc định, build bằng `npm run build`, chọn Node.js 24.x. Không cần cấu hình database. Bản demo dùng tài khoản mặc định khi không khai báo biến môi trường.

Có thể đặt `ADMIN_EMAIL`, `ADMIN_PASSWORD` và `SESSION_SECRET` trong môi trường Vercel để dùng thông tin riêng. Phiên đăng nhập là cookie ký HMAC, HttpOnly, SameSite=Lax, hết hạn sau 24 giờ và tự bật Secure trên Vercel; không cần file hay bảng sessions. Nếu đặt `SESSION_SECRET`, dùng cùng giá trị cho mọi instance. Nếu bỏ trống, khóa ký được suy ra từ thông tin quản trị demo.

Đăng xuất xóa cookie trên trình duyệt hiện tại; chế độ demo chưa có danh sách thu hồi token phía server. Đổi `SESSION_SECRET` (hoặc mật khẩu nếu không đặt secret riêng), rồi khởi động/deploy lại để vô hiệu hóa các phiên cũ. Giới hạn tần suất cũng chỉ nằm trong bộ nhớ từng instance.

Không có thao tác publish/deploy/push tự động trong dự án.

## Chức năng demo

- Cửa hàng: bộ sưu tập nam/nữ/unisex, tìm kiếm, lọc, sắp xếp giá, chi tiết sản phẩm, size/màu, giỏ hàng và yêu thích.
- Đặt COD giả lập: máy chủ tính giá, kiểm tra biến thể và tổng tồn kho; cập nhật tồn kho cùng đơn hàng trong một thao tác đồng bộ, hoàn tác nếu thất bại.
- `WELCOME10`: giảm 10%, tối đa 100.000đ. Vận chuyển 30.000đ, miễn phí từ 699.000đ trước giảm giá.
- Tra cứu bằng mã đơn và số điện thoại; API danh sách đơn chỉ dành cho quản trị.
- Quản trị: tổng quan, CRUD sản phẩm, xử lý đơn, xuất CSV và danh sách khách hàng.
- Chờ xác nhận → Đã xác nhận → Đang giao → Hoàn thành. Chỉ hủy khi chờ/đã xác nhận, hoàn tồn kho một lần.
- Đăng ký nhận tin giả lập; chưa kết nối gửi email, thanh toán hoặc vận chuyển.

## Cấu trúc và thay database sau này

```text
src/data/db.json       Dữ liệu mẫu đóng gói cùng ứng dụng
src/lib/db.ts          Lớp truy cập dữ liệu mock, CRUD, transaction, rate limit
src/lib/auth.ts        Tài khoản demo/biến môi trường và cookie phiên đã ký
src/lib/types.ts       Kiểu dữ liệu sản phẩm, đơn hàng
src/lib/validation.ts  Xác thực sản phẩm ở máy chủ
src/app/(store)/       Các trang dành cho người mua
src/app/admin/         Giao diện quản trị
src/app/api/           API sản phẩm, đơn hàng, đăng nhập và nhận tin
public/images/        Ảnh cục bộ
public/fonts/         Font cục bộ
```

Các trang và API gọi các hàm như `getProducts`, `getOrder`, `saveProduct`, `saveOrder`, `transaction` trong `src/lib/db.ts`, không chứa SQL. Khi nối database thật, thay lớp này bằng adapter lưu trữ bền vững, chuyển các bên gọi sang `async/await` nếu cần, và dùng giao dịch database cho đơn hàng/tồn kho. Đồng thời thay tài khoản demo và rate limit bằng cơ chế production phù hợp.

## Kiểm chứng

```bash
npm run typecheck
npm run build
npx playwright install --with-deps chromium
npm run test:e2e
```

Playwright chạy bản production ở cổng **3187**. Mỗi tiến trình bắt đầu từ JSON gốc; test không ghi vào dữ liệu mẫu hay SQLite cũ. Cấu hình test cố ý đặt `DATABASE_PATH` vào thư mục không ghi được để kiểm tra ứng dụng không còn phụ thuộc đường dẫn đó.

Các kiểm tra bao gồm cửa hàng, đặt/tra cứu đơn, giá/tồn kho, hủy hoàn kho, quyền quản trị, CRUD, xuất CSV, nhận tin và hydration. Ảnh kiểm chứng nằm trong `artifacts/`.

Nếu môi trường thiếu thư viện Chromium nhưng có bộ thư viện đã chuẩn bị:

```bash
LD_LIBRARY_PATH=/tmp/satthep-browser-libs/root/usr/lib/x86_64-linux-gnu npm run test:e2e
```

## Nguồn tài nguyên

Ảnh mẫu từ [Unsplash](https://unsplash.com/license), ID ghi trong `ASSETS.md`. Font [DM Sans](https://github.com/google/fonts/tree/main/ofl/dmsans) và [Playfair Display](https://github.com/google/fonts/tree/main/ofl/playfairdisplay) theo SIL Open Font License. Icon dùng Lucide (ISC). Ảnh và font được phục vụ cục bộ.
