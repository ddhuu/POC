# Kimai Invoice XLSX Export - Proof of Concept

## Giới thiệu
Đây là proof of concept cho tính năng tạo và xuất hóa đơn cho khách hàng (PB013) trong dự án Kimai. Proof of concept này chứng minh khả năng thực hiện tính năng xuất hóa đơn ra định dạng XLSX với kiến trúc microservice.

## Cài đặt

### Yêu cầu
- Node.js (version 14.x hoặc cao hơn)
- npm (đi kèm với Node.js)

### Các bước cài đặt
1. Cài đặt các dependency:
```bash
npm install
```

## Chạy ứng dụng
1. Khởi động server:
```bash
npm start
```
2. Mở trình duyệt và truy cập:
   - Giao diện chính: http://localhost:3000
   - API tạo hóa đơn: http://localhost:3000/api/invoices/create
   - API tải xuống hóa đơn: http://localhost:3000/api/invoices/:customerId/download

## Cấu trúc mã nguồn
```
src/
├── models/                  # Các model dữ liệu
│   ├── Customer.js          # Model khách hàng
│   ├── Template.js          # Model mẫu hóa đơn
│   ├── TimeEntry.js         # Model bản ghi thời gian
│   └── InvoiceModel.js      # Model hóa đơn
├── services/                # Các service xử lý nghiệp vụ
│   ├── ApiGatewayService.js # Service điều phối các service khác
│   ├── CustomerService.js   # Service quản lý khách hàng
│   ├── InvoiceService.js    # Service tạo và xuất hóa đơn
│   ├── NotificationService.js # Service gửi thông báo
│   └── TimesheetService.js  # Service quản lý bản ghi thời gian
├── renderers/               # Các renderer xuất hóa đơn
│   └── XlsxRenderer.js      # Renderer xuất hóa đơn XLSX
├── utils/                   # Các tiện ích
│   ├── Calculator.js        # Tiện ích tính toán
│   └── NumberGenerator.js   # Tiện ích tạo số hóa đơn
└── index.js                 # File chính, khởi tạo server và các service
```

## Kiến trúc
Proof of concept này sử dụng kiến trúc microservice với các thành phần chính:

1. **API Gateway**: Điều phối các service khác, xử lý các request từ client
2. **Customer Service**: Quản lý thông tin khách hàng
3. **Timesheet Service**: Quản lý các bản ghi thời gian
4. **Invoice Service**: Tạo và xuất hóa đơn
5. **Notification Service**: Gửi thông báo khi hóa đơn được tạo

## Luồng xử lý
1. Client gửi yêu cầu tạo hóa đơn đến API Gateway
2. API Gateway lấy thông tin khách hàng từ Customer Service
3. API Gateway lấy dữ liệu timesheet từ Timesheet Service
4. API Gateway yêu cầu Invoice Service tạo và xuất hóa đơn
5. API Gateway gửi thông báo đến người dùng thông qua Notification Service
6. Client nhận được URL để tải xuống hóa đơn

## Chức năng
1. Tổng hợp dữ liệu từ các timesheet (được mô phỏng bằng các TimeEntry)
2. Tính toán chi phí dựa trên thời gian làm việc và các chi phí phát sinh
3. Tạo hóa đơn với định dạng chuyên nghiệp
4. Xuất hóa đơn ra định dạng XLSX để chia sẻ với khách hàng
5. Gửi thông báo khi hóa đơn được tạo

## Tính khả thi
Proof of concept này chứng minh rằng việc phát triển tính năng tạo và xuất hóa đơn cho khách hàng trong định dạng XLSX là hoàn toàn khả thi trong dự án Kimai. Chúng ta có thể:

1. Tạo một renderer mới cho định dạng XLSX
2. Sử dụng dữ liệu từ các timesheet để tạo nội dung hóa đơn
3. Tạo file XLSX với định dạng chuyên nghiệp
4. Cung cấp giao diện người dùng để tạo và xuất hóa đơn
5. Tích hợp với hệ thống thông báo

Khi tích hợp vào dự án Kimai thực tế, chúng ta có thể sử dụng kiến trúc microservice tương tự và điều chỉnh để phù hợp với kiến trúc của Kimai.
