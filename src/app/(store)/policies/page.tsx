export const metadata = { title: 'Hướng dẫn & chính sách mua hàng' };
export default function Policies() {
  return (
    <div className="section information-page">
      <span className="eyebrow">HERE TO HELP</span>
      <h1>Để bạn an tâm lựa chọn.</h1>
      <p>
        Thông tin mua hàng và hướng dẫn tại cửa hàng mẫu MÂISON. Chủ cửa hàng cần cập nhật chính
        sách và kênh liên hệ thực tế trước khi kinh doanh.
      </p>
      <section id="shipping">
        <h2>Giao hàng & đổi trả</h2>
        <p>
          Phí giao hàng tiêu chuẩn là 30.000đ. Miễn phí cho đơn có tổng tiền sản phẩm từ 699.000đ,
          tính trước ưu đãi. Thời gian giao dự kiến 2–5 ngày làm việc sau khi xác nhận, tùy khu vực.
        </p>
        <p>
          Hỗ trợ yêu cầu đổi trả trong vòng 30 ngày kể từ khi nhận hàng đối với sản phẩm còn nguyên
          tem, chưa sử dụng và có mã đơn. Chi phí vận chuyển khi đổi theo nhu cầu do khách hàng
          thanh toán; cửa hàng chịu phí nếu giao sai hoặc sản phẩm có lỗi. Chủ cửa hàng sẽ xác nhận
          phương án xử lý trực tiếp với bạn.
        </p>
        <p>
          Đơn được thanh toán bằng tiền mặt khi nhận hàng (COD). Mã WELCOME10 giảm 10% tổng tiền sản
          phẩm, tối đa 100.000đ mỗi đơn, không áp dụng cho phí vận chuyển.
        </p>
      </section>
      <section id="sizes">
        <h2>Hướng dẫn chọn size</h2>
        <p>
          Bảng dưới đây mang tính tham khảo cho áo. Số đo cơ thể tính bằng cm; phom thực tế thay đổi
          tùy thiết kế. Nếu giữa hai kích cỡ, chọn size lớn hơn để mặc thoải mái.
        </p>
        <table>
          <thead>
            <tr>
              <th>Kích cỡ</th>
              <th>Ngực nữ</th>
              <th>Ngực nam</th>
              <th>Eo nữ</th>
              <th>Eo nam</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>S</td>
              <td>80–84</td>
              <td>88–92</td>
              <td>62–66</td>
              <td>72–76</td>
            </tr>
            <tr>
              <td>M</td>
              <td>85–89</td>
              <td>93–97</td>
              <td>67–71</td>
              <td>77–81</td>
            </tr>
            <tr>
              <td>L</td>
              <td>90–94</td>
              <td>98–102</td>
              <td>72–76</td>
              <td>82–86</td>
            </tr>
            <tr>
              <td>XL</td>
              <td>95–99</td>
              <td>103–107</td>
              <td>77–81</td>
              <td>87–91</td>
            </tr>
          </tbody>
        </table>
      </section>
      <section id="privacy">
        <h2>Thông tin & bảo mật</h2>
        <p>
          Khi đặt hàng, cửa hàng lưu họ tên, số điện thoại, địa chỉ, email nếu bạn cung cấp và nội
          dung đơn để xác nhận, giao hàng và hỗ trợ sau mua. Không thu thập thông tin thẻ thanh
          toán.
        </p>
        <p>
          Giỏ hàng và danh sách yêu thích được lưu trên trình duyệt của bạn. Trang quản trị sử dụng
          cookie phiên đăng nhập. Email đăng ký nhận tin được lưu riêng; tính năng gửi email tự động
          chưa được kết nối.
        </p>
        <p>
          Bạn có thể yêu cầu chủ cửa hàng kiểm tra, chỉnh sửa hoặc xóa thông tin theo chính sách áp
          dụng. Phiên bản hiện tại là cửa hàng mẫu; chỉ sử dụng thông tin giả khi trải nghiệm.
        </p>
      </section>
      <section id="contact">
        <h2>Kết nối với cửa hàng</h2>
        <p>
          Đối với đơn hàng, hãy dùng mục “Tra cứu đơn hàng” và lưu lại mã đơn để đối chiếu. Chủ cửa
          hàng sẽ liên hệ qua số điện thoại bạn đã cung cấp để xác nhận.
        </p>
        <p>
          Cửa hàng mẫu chưa cấu hình hotline, địa chỉ thực tế hoặc tài khoản mạng xã hội chính thức.
          Các thông tin này cần được chủ cửa hàng cập nhật trước khi mở bán.
        </p>
      </section>
    </div>
  );
}
