/**
 * NumberGenerator
 * Lớp tiện ích để tạo số hóa đơn theo định dạng
 */
class NumberGenerator {
  /**
   * Khởi tạo đối tượng NumberGenerator
   * @param {string} prefix - Tiền tố cho số hóa đơn (mặc định: 'INV-')
   * @param {number} startNumber - Số bắt đầu (mặc định: 10001)
   * @param {number} padLength - Độ dài của phần số (mặc định: 5)
   */
  constructor(prefix = 'INV-', startNumber = 10001, padLength = 5) {
    this.prefix = prefix;
    this.currentNumber = startNumber;
    this.padLength = padLength;
  }

  /**
   * Tạo số hóa đơn tiếp theo
   * @returns {string} - Số hóa đơn mới
   */
  getNextNumber() {
    const paddedNumber = String(this.currentNumber).padStart(this.padLength, '0');
    const invoiceNumber = `${this.prefix}${paddedNumber}`;
    this.currentNumber++;
    return invoiceNumber;
  }

  /**
   * Đặt lại số hiện tại
   * @param {number} newNumber - Số mới để bắt đầu
   */
  resetNumber(newNumber) {
    this.currentNumber = newNumber;
  }

  /**
   * Lấy số hiện tại mà không tăng bộ đếm
   * @returns {string} - Số hóa đơn hiện tại
   */
  getCurrentNumber() {
    const paddedNumber = String(this.currentNumber).padStart(this.padLength, '0');
    return `${this.prefix}${paddedNumber}`;
  }
}

module.exports = NumberGenerator;
