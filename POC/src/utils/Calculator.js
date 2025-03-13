/**
 * Calculator
 * Lớp tiện ích để thực hiện các phép tính liên quan đến hóa đơn
 */
class Calculator {
  /**
   * Tính tổng thời gian làm việc từ danh sách các bản ghi thời gian
   * @param {Array} timeEntries - Danh sách các bản ghi thời gian
   * @returns {number} - Tổng thời gian làm việc (giờ)
   */
  static calculateTotalDuration(timeEntries) {
    return timeEntries.reduce((total, entry) => total + entry.getDuration(), 0);
  }

  /**
   * Tính tổng tiền từ danh sách các bản ghi thời gian
   * @param {Array} timeEntries - Danh sách các bản ghi thời gian
   * @returns {number} - Tổng tiền
   */
  static calculateTotalAmount(timeEntries) {
    return timeEntries.reduce((total, entry) => total + entry.getAmount(), 0);
  }

  /**
   * Tính tiền thuế dựa trên tổng tiền và tỷ lệ thuế
   * @param {number} amount - Tổng tiền
   * @param {number} taxRate - Tỷ lệ thuế (%)
   * @returns {number} - Tiền thuế
   */
  static calculateTax(amount, taxRate) {
    return amount * (taxRate / 100);
  }

  /**
   * Tính tổng tiền sau thuế
   * @param {number} amount - Tổng tiền trước thuế
   * @param {number} taxAmount - Tiền thuế
   * @returns {number} - Tổng tiền sau thuế
   */
  static calculateTotal(amount, taxAmount) {
    return amount + taxAmount;
  }

  /**
   * Định dạng số tiền theo định dạng tiền tệ
   * @param {number} amount - Số tiền
   * @param {string} currency - Đơn vị tiền tệ (mặc định: 'USD')
   * @param {string} locale - Ngôn ngữ định dạng (mặc định: 'en-US')
   * @returns {string} - Chuỗi số tiền đã định dạng
   */
  static formatCurrency(amount, currency = 'USD', locale = 'en-US') {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency
    }).format(amount);
  }

  /**
   * Làm tròn số đến số chữ số thập phân nhất định
   * @param {number} value - Giá trị cần làm tròn
   * @param {number} decimals - Số chữ số thập phân (mặc định: 2)
   * @returns {number} - Giá trị đã làm tròn
   */
  static roundToDecimals(value, decimals = 2) {
    const factor = Math.pow(10, decimals);
    return Math.round(value * factor) / factor;
  }
}

module.exports = Calculator;
