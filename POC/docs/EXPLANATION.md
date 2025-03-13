# Giải thích chi tiết về Kimai Invoice XLSX Export POC

## Tổng quan kiến trúc

Proof of Concept (POC) này được xây dựng theo kiến trúc microservice, tách biệt các thành phần chức năng thành các service riêng biệt. Kiến trúc này giúp cải thiện tính mô-đun, khả năng bảo trì và mở rộng của hệ thống.

### Các thành phần chính

1. **Models**: Đại diện cho các đối tượng dữ liệu trong hệ thống
2. **Services**: Xử lý logic nghiệp vụ và tương tác với dữ liệu
3. **Renderers**: Chuyển đổi dữ liệu thành các định dạng xuất (XLSX)
4. **Utils**: Các tiện ích hỗ trợ

## Luồng dữ liệu chi tiết

### 1. Yêu cầu tạo hóa đơn

```
Client → API Gateway → Customer Service → Timesheet Service → Invoice Service → Notification Service → Client
```

#### Chi tiết:
1. **Client** gửi yêu cầu tạo hóa đơn với thông tin:
   - ID khách hàng
   - ID dự án
   - Khoảng thời gian (ngày bắt đầu, ngày kết thúc)
   - Các tùy chọn (định dạng, thuế suất, v.v.)

2. **API Gateway** nhận yêu cầu và điều phối các service khác:
   - Gọi **Customer Service** để lấy thông tin khách hàng
   - Gọi **Timesheet Service** để lấy dữ liệu timesheet
   - Gọi **Invoice Service** để tạo và xuất hóa đơn
   - Gọi **Notification Service** để gửi thông báo

3. **Customer Service** trả về thông tin khách hàng:
   - Tên khách hàng
   - Địa chỉ
   - Email
   - Thông tin liên hệ

4. **Timesheet Service** trả về dữ liệu timesheet:
   - Danh sách các bản ghi thời gian
   - Thông tin về hoạt động, thời gian làm việc, và chi phí

5. **Invoice Service** tạo hóa đơn dựa trên dữ liệu nhận được:
   - Tạo **InvoiceModel** với thông tin khách hàng và timesheet
   - Sử dụng **Calculator** để tính toán tổng tiền, thuế
   - Sử dụng **NumberGenerator** để tạo số hóa đơn
   - Sử dụng **XlsxRenderer** để xuất hóa đơn ra định dạng XLSX
   - Lưu file XLSX và trả về URL tải xuống

6. **Notification Service** gửi thông báo về hóa đơn đã tạo:
   - Thông báo cho người dùng về hóa đơn đã tạo
   - Cung cấp thông tin về hóa đơn và URL tải xuống

7. **API Gateway** tổng hợp kết quả và trả về cho **Client**:
   - Thông tin hóa đơn đã tạo
   - URL tải xuống hóa đơn

### 2. Yêu cầu tải xuống hóa đơn

```
Client → API Gateway → Invoice Service → Client
```

#### Chi tiết:
1. **Client** gửi yêu cầu tải xuống hóa đơn với thông tin:
   - Số hóa đơn
   - Định dạng (mặc định là XLSX)

2. **API Gateway** điều hướng yêu cầu đến **Invoice Service**

3. **Invoice Service** xử lý yêu cầu:
   - Tìm kiếm hóa đơn theo số hóa đơn
   - Trả về file hóa đơn trong định dạng yêu cầu

4. **Client** nhận được file hóa đơn

## Mô tả chi tiết các thành phần

### Models

1. **Customer**: Đại diện cho thông tin khách hàng
   - ID
   - Tên
   - Địa chỉ
   - Email

2. **Template**: Đại diện cho mẫu hóa đơn/thông tin công ty
   - ID
   - Tên công ty
   - Địa chỉ
   - Số điện thoại
   - Email

3. **TimeEntry**: Đại diện cho một bản ghi thời gian
   - ID
   - Mô tả
   - Thời gian bắt đầu
   - Thời lượng (giây)
   - Đơn giá

4. **InvoiceModel**: Đại diện cho một hóa đơn hoàn chỉnh
   - ID
   - Khách hàng
   - Mẫu hóa đơn
   - Ngày hóa đơn
   - Ngày đáo hạn
   - Calculator (để tính toán)
   - NumberGenerator (để tạo số hóa đơn)

### Services

1. **ApiGatewayService**: Điều phối các service khác
   - Xử lý yêu cầu tạo hóa đơn
   - Xử lý yêu cầu tải xuống hóa đơn
   - Xử lý yêu cầu lấy danh sách hóa đơn

2. **CustomerService**: Quản lý thông tin khách hàng
   - Lấy thông tin khách hàng theo ID
   - Lấy danh sách khách hàng
   - Thêm/sửa/xóa khách hàng

3. **TimesheetService**: Quản lý dữ liệu timesheet
   - Lấy dữ liệu timesheet theo dự án và khoảng thời gian
   - Lấy danh sách các bản ghi thời gian
   - Thêm/sửa/xóa bản ghi thời gian

4. **InvoiceService**: Quản lý hóa đơn
   - Tạo và xuất hóa đơn
   - Lấy thông tin hóa đơn
   - Tải xuống hóa đơn

5. **NotificationService**: Quản lý thông báo
   - Gửi thông báo về hóa đơn
   - Lấy danh sách thông báo
   - Đánh dấu thông báo đã đọc

### Renderers

1. **XlsxRenderer**: Chuyển đổi InvoiceModel thành file XLSX
   - Tạo workbook và worksheet
   - Thêm thông tin khách hàng và công ty
   - Thêm thông tin hóa đơn
   - Thêm danh sách các mục
   - Thêm tổng tiền, thuế
   - Định dạng các ô và cột
   - Xuất ra buffer hoặc file

### Utils

1. **Calculator**: Tính toán các giá trị liên quan đến hóa đơn
   - Tính tổng tiền
   - Tính thuế
   - Tính tổng cộng

2. **NumberGenerator**: Tạo số hóa đơn
   - Tạo số hóa đơn theo định dạng cấu hình
   - Tăng số hóa đơn tự động

## Ưu điểm của kiến trúc này

1. **Tính mô-đun cao**: Mỗi thành phần có trách nhiệm rõ ràng và có thể được phát triển, kiểm thử và triển khai độc lập.

2. **Khả năng mở rộng**: Dễ dàng thêm các service mới hoặc mở rộng các service hiện có mà không ảnh hưởng đến toàn bộ hệ thống.

3. **Khả năng bảo trì**: Mã nguồn được tổ chức rõ ràng, dễ dàng tìm kiếm và sửa đổi.

4. **Khả năng tái sử dụng**: Các thành phần có thể được tái sử dụng trong các phần khác của hệ thống hoặc trong các dự án khác.

5. **Khả năng kiểm thử**: Mỗi thành phần có thể được kiểm thử độc lập, giúp tăng độ tin cậy của hệ thống.

## Kết luận

Kiến trúc microservice được sử dụng trong POC này cung cấp một nền tảng vững chắc cho việc phát triển tính năng xuất hóa đơn XLSX trong dự án Kimai. Kiến trúc này không chỉ đáp ứng các yêu cầu hiện tại mà còn cho phép mở rộng và tích hợp với các tính năng khác trong tương lai.
