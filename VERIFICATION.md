# Kiểm chứng bàn giao

## Chuyển sang JSON mock — 16/11/2026

- `src/data/db.json` chứa 8 sản phẩm, 3 đơn giả lập và 1 email mẫu; khách hàng tổng hợp từ các đơn này. SQLite và script reset tài khoản cũ đã được loại khỏi mã chạy.
- `npm run build`, `npm run typecheck`, `npm run format:check`, `git diff --check`: đạt.
- Playwright production: **9/9 bài đạt**, gồm 7 bài hiện có và 2 bài kiểm tra JSON mẫu/cookie giả mạo, hết hạn, sai tài khoản. Các luồng CRUD, đặt/tra cứu đơn, tính giá, trừ/hoàn tồn kho, nhận tin, hydration đều đạt.
- Cấu hình test đặt `DATABASE_PATH=/sys/maison-read-only/maison.sqlite`; đường dẫn không ghi được này không còn ảnh hưởng ứng dụng.
- Kiểm tra thêm hai tiến trình production với Node permission model: cho đọc file, worker và native addon (SWC), **không cấp quyền ghi file**. `/`, `/shop`, `/product/linen-shirt`, `/wishlist`, `/api/products` trả HTTP 200; đặt hàng giả lập thành công và không thay đổi JSON nguồn.
- Hai tiến trình không có cấu hình tài khoản riêng vẫn đăng nhập được bằng tài khoản demo; cùng cookie được chấp nhận trên cả hai tiến trình. `VERCEL=1` bật cờ Secure cho cookie.
- Xác nhận thay đổi tồn kho chỉ có ở tiến trình nhận đơn; tiến trình khác vẫn đọc số lượng ban đầu. Đây là giới hạn chủ đích của mock trong bộ nhớ, không phải lưu trữ cho cửa hàng thật.
- Trình duyệt đã chạy ở 390, 768 và 1440px; đã xem ảnh trang chủ và quản trị desktop. Lượt này thay lớp dữ liệu, không sửa CSS/typography; không chạy lại audit 360/1366/1920/2560 hoặc zoom 200%.
- Chromium dùng `LD_LIBRARY_PATH=/tmp/satthep-browser-libs/root/usr/lib/x86_64-linux-gnu` do môi trường thiếu thư viện mặc định.
- Chưa push/deploy; kiểm chứng trên production server tại máy. Các biên bản bên dưới là lịch sử trước khi đổi sang JSON.

## Cập nhật hydration và giao diện — 16/11/2026

- `npm run build`, `npm run typecheck`, `npm run format:check`: đạt.
- `npm run test:e2e`: **7/7 bài đạt**, dùng database tạm riêng.
- Đã mô phỏng tiện ích chèn `data-testim-main-word-scripts-loaded="true"` và `class="vsc-initialized"` vào `body` trước hydration. Không có cảnh báo trong dev, tìm kiếm và lưu yêu thích vẫn hoạt động. Một thuộc tính cố ý chèn vào `h1` vẫn gây cảnh báo, xác nhận suppression chỉ nằm ở `body`.
- Footer nhận năm UTC từ server; client không tự tính năm trong lúc render.
- Đã chụp và xem giao diện Chromium ở viewport CSS **360, 390, 768, 1366, 1920, 2560px**, zoom 100%. Đã đo font thực tế và kiểm tra tràn ngang trên trang chủ, danh mục, chi tiết sản phẩm, giỏ hàng, checkout, tra cứu, giới thiệu, chính sách và yêu thích. Không phát hiện tràn ngang hay lỗi console trong lượt kiểm tra cuối.
- Font đoạn văn/tên sản phẩm: **16.27 → 18 → 20px**; menu/nút: **14.24 → 15.75 → 17.5px**; tiêu đề section: **37.08 → 44 → 52px**, tương ứng 1366 → 1920 → 2560px.
- Đã đặt zoom Chromium thực tế ở **200%** (cửa sổ 1366px, viewport CSS 683px, DPR 2), kiểm tra trang chủ, danh mục, chi tiết và tra cứu; menu và thêm giỏ hoạt động, không tràn ngang.
- Đã kiểm tra tìm kiếm mobile, Escape đóng và trả focus, link trong ba thẻ gợi ý phối đồ dẫn đến đúng danh mục có sản phẩm. Kiểm tra thêm thiết bị cảm ứng 390px: nút khám phá sản phẩm hiện trực tiếp và chạm mở đúng trang chi tiết.
- Kết quả chi tiết: `artifacts/polish/responsive-audit.json`, `artifacts/polish/hydration-check.json`, `artifacts/polish/zoom-200-audit.json`. Ảnh cuối: `artifacts/polish/top-{width}.png`, `artifacts/polish/home-{width}.png`, `artifacts/polish/mobile-menu.png`, `artifacts/polish/zoom-200-purchase.png`.
- Trình duyệt kiểm tra là Chromium. Chưa kiểm tra Safari/Firefox hoặc chính tiện ích đang cài trên máy người dùng.

## Biên bản trước cập nhật

Đã kiểm chứng trực tiếp bằng Chromium/Playwright trên bản production Next.js.

- `npm run build`: đạt, không có cảnh báo build.
- `npm run typecheck`: đạt.
- `npm run format:check`: đạt.
- `npm run test:e2e`: 6/6 bài đạt.
- `npm audit --omit=dev`: 0 lỗ hổng được báo cáo tại thời điểm kiểm tra.
- Script `admin:reset`: đã chạy thử với database riêng và thành công.

## Các luồng được kiểm tra

1. Trang chủ, tải ảnh cục bộ, chuyển danh mục nam/nữ, tìm kiếm, lưu/bỏ yêu thích và tải lại trang.
2. Chọn màu/size, thêm giỏ, lưu giỏ qua reload, áp dụng mã, đặt COD, giảm tồn kho, tra cứu bằng mã và điện thoại, xóa giỏ sau đặt thành công.
3. Chặn API quản trị khi chưa đăng nhập; chặn biến thể sai, số lượng gộp vượt tồn, mã giảm giá sai; tính giá tại máy chủ bất kể giá client; chặn nguồn đăng nhập khác; kiểm tra cookie; chặn chuyển trạng thái không hợp lệ; hủy đơn hoàn kho đúng một lần; logout vô hiệu hóa phiên.
4. Đăng nhập người bán, tạo/sửa/xóa sản phẩm, dữ liệu còn sau reload, xác nhận/giao/hoàn thành đơn, xuất CSV, tổng hợp khách hàng.
5. Không tràn ngang tại 390px và 768px cho các trang chính; menu mobile; dashboard và hộp thoại sản phẩm trên điện thoại.
6. Email nhận tin: kiểm tra định dạng, đăng ký từ giao diện, xử lý đăng ký trùng.

Database kiểm thử nằm trong thư mục tạm, tách khỏi dữ liệu bàn giao. Cửa hàng ban đầu có 8 sản phẩm mẫu, không có đơn hoặc khách hàng giả.

Ảnh giao diện cuối cùng:

- `artifacts/store-desktop.png`
- `artifacts/store-mobile.png`
- `artifacts/admin-desktop.png`
- `artifacts/admin-mobile.png`

Các giới hạn hiện tại: COD; chưa có thanh toán online, tích hợp hãng vận chuyển hoặc email/SMS tự động. Tồn kho tổng theo sản phẩm, chưa tách theo biến thể. Xem README để cấu hình và vận hành.
