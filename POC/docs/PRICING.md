# Cách Tính Phí Trong Hệ Thống Xuất Hóa Đơn XLSX

## Tổng Quan

Hệ thống tính phí trong Proof of Concept xuất hóa đơn XLSX được thiết kế để tính toán chính xác các khoản phí dựa trên thời gian làm việc, đơn giá và thuế. Việc tính phí được thực hiện thông qua lớp `Calculator` trong thư mục `src/utils`.

## Các Thành Phần Tính Phí

### 1. Đơn Vị Thời Gian

- **Đơn vị cơ bản**: Giây (seconds)
- **Hiển thị**: Giờ (hours) - Thời gian được chuyển đổi từ giây sang giờ khi hiển thị trên hóa đơn
- **Công thức chuyển đổi**: `hours = seconds / 3600`

### 2. Đơn Giá

- **Đơn vị**: Tiền tệ/giờ (mặc định: USD/hour)
- **Cấu hình**: Đơn giá được cấu hình cho từng loại công việc hoặc từng dự án
- **Lưu trữ**: Trong đối tượng `TimeEntry` (thuộc tính `rate`)

### 3. Cách Tính Phí Cho Mỗi Mục

Mỗi mục trong hóa đơn (một `TimeEntry`) được tính phí như sau:

```javascript
amount = (duration / 3600) * rate
```

Trong đó:
- `duration`: Thời lượng làm việc (tính bằng giây)
- `rate`: Đơn giá (tính bằng tiền tệ/giờ)
- `amount`: Thành tiền cho mục đó

### 4. Thuế Giá Trị Gia Tăng (VAT)

- **Cấu hình**: Tỷ lệ thuế VAT được cấu hình khi tạo đối tượng `Calculator`
- **Mặc định**: 10%
- **Công thức tính thuế**: `tax = subtotal * (vatRate / 100)`

### 5. Tổng Cộng

- **Tổng phụ (Subtotal)**: Tổng của tất cả các mục trước thuế
- **Thuế (Tax)**: Thuế VAT tính trên tổng phụ
- **Tổng cộng (Total)**: Tổng phụ + Thuế

## Ví Dụ Tính Toán

Giả sử chúng ta có các mục sau trong hóa đơn:

1. **Mục 1**:
   - Mô tả: "Website Development - Homepage"
   - Thời lượng: 8 giờ (28,800 giây)
   - Đơn giá: $75/giờ
   - Thành tiền: (28,800 / 3600) * 75 = 8 * 75 = $600

2. **Mục 2**:
   - Mô tả: "Website Development - Contact Form"
   - Thời lượng: 4 giờ (14,400 giây)
   - Đơn giá: $75/giờ
   - Thành tiền: (14,400 / 3600) * 75 = 4 * 75 = $300

3. **Mục 3**:
   - Mô tả: "Database Integration"
   - Thời lượng: 6 giờ (21,600 giây)
   - Đơn giá: $85/giờ
   - Thành tiền: (21,600 / 3600) * 85 = 6 * 85 = $510

4. **Mục 4**:
   - Mô tả: "Testing and Bug Fixes"
   - Thời lượng: 5 giờ (18,000 giây)
   - Đơn giá: $65/giờ
   - Thành tiền: (18,000 / 3600) * 65 = 5 * 65 = $325

**Tính toán tổng cộng**:
- Tổng phụ (Subtotal): $600 + $300 + $510 + $325 = $1,735
- Thuế VAT (10%): $1,735 * 0.1 = $173.50
- Tổng cộng (Total): $1,735 + $173.50 = $1,908.50

## Mã Nguồn Tính Toán

Dưới đây là cách lớp `Calculator` thực hiện tính toán:

```javascript
class Calculator {
  constructor(entries, vat = 10) {
    this.entries = entries;
    this.vat = vat;
  }

  getEntries() {
    return this.entries;
  }

  getVat() {
    return this.vat;
  }

  getSubtotal() {
    return this.entries.reduce((total, entry) => total + entry.getAmount(), 0);
  }

  getTax() {
    return this.getSubtotal() * (this.vat / 100);
  }

  getTotal() {
    return this.getSubtotal() + this.getTax();
  }
}
```

## Các Tùy Chọn Tính Phí Bổ Sung

### 1. Giảm Giá

Hệ thống hỗ trợ áp dụng giảm giá theo các hình thức:

- **Giảm giá theo phần trăm**: Giảm một tỷ lệ phần trăm trên tổng phụ
- **Giảm giá cố định**: Giảm một số tiền cố định trên tổng phụ

Công thức tính tổng cộng khi có giảm giá:
```
total = (subtotal - discount) + tax
```

Trong đó:
- `tax = (subtotal - discount) * (vatRate / 100)` (thuế được tính sau khi đã trừ giảm giá)

### 2. Phí Bổ Sung

Hệ thống cũng hỗ trợ thêm các khoản phí bổ sung như:

- **Phí vận chuyển**: Phí cố định hoặc tính theo khoảng cách
- **Phí dịch vụ**: Phí cố định hoặc tính theo tỷ lệ phần trăm trên tổng phụ

Công thức tính tổng cộng khi có phí bổ sung:
```
total = subtotal + additionalFees + tax
```

Trong đó:
- `tax = (subtotal + additionalFees) * (vatRate / 100)` (thuế được tính sau khi đã thêm phí bổ sung)

## Làm Tròn Số

Hệ thống áp dụng quy tắc làm tròn số như sau:

- **Thời lượng**: Làm tròn đến 2 chữ số thập phân khi hiển thị (giờ)
- **Tiền tệ**: Làm tròn đến 2 chữ số thập phân
- **Thuế suất**: Được sử dụng chính xác như cấu hình (không làm tròn)

## Tùy Chỉnh Tính Phí

Người dùng có thể tùy chỉnh cách tính phí thông qua các tham số khi tạo hóa đơn:

- **Thuế suất**: Có thể thay đổi tỷ lệ thuế VAT (mặc định: 10%)
- **Đơn vị tiền tệ**: Có thể thay đổi đơn vị tiền tệ (mặc định: USD)
- **Giảm giá**: Có thể áp dụng giảm giá theo phần trăm hoặc số tiền cố định
- **Phí bổ sung**: Có thể thêm các khoản phí bổ sung

## Kết Luận

Hệ thống tính phí trong Proof of Concept xuất hóa đơn XLSX được thiết kế để linh hoạt và chính xác. Người dùng có thể dễ dàng tùy chỉnh các tham số tính phí để phù hợp với nhu cầu cụ thể của họ.

Các tính toán được thực hiện tự động thông qua lớp `Calculator`, đảm bảo tính nhất quán và chính xác trong toàn bộ hệ thống.
