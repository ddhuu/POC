/**
 * InvoiceModel
 * Đại diện cho một hóa đơn hoàn chỉnh trong hệ thống
 */
class InvoiceModel {
  /**
   * Khởi tạo đối tượng InvoiceModel
   * @param {string} invoiceNumber - Số hóa đơn
   * @param {Date} invoiceDate - Ngày tạo hóa đơn
   * @param {Date} dueDate - Ngày đáo hạn
   * @param {Object} template - Thông tin công ty/template
   * @param {Object} customer - Thông tin khách hàng
   * @param {Array} items - Danh sách các mục trong hóa đơn
   * @param {number} taxRate - Tỷ lệ thuế (%)
   * @param {string} currency - Đơn vị tiền tệ
   * @param {string} notes - Ghi chú (tùy chọn)
   * @param {string} paymentTerms - Điều khoản thanh toán (tùy chọn)
   */
  constructor(invoiceNumber, invoiceDate, dueDate, template, customer, items, taxRate, currency, notes = '', paymentTerms = '') {
    this.invoiceNumber = invoiceNumber;
    this.invoiceDate = invoiceDate;
    this.dueDate = dueDate;
    this.template = template;
    this.customer = customer;
    this.items = items;
    this.taxRate = taxRate;
    this.currency = currency;
    this.notes = notes;
    this.paymentTerms = paymentTerms;
  }

  getInvoiceNumber() { return this.invoiceNumber; }
  getInvoiceDate() { return this.invoiceDate; }
  getDueDate() { return this.dueDate; }
  getTemplate() { return this.template; }
  getCustomer() { return this.customer; }
  getItems() { return this.items; }
  getTaxRate() { return this.taxRate; }
  getCurrency() { return this.currency; }
  getNotes() { return this.notes; }
  getPaymentTerms() { return this.paymentTerms; }

  /**
   * Tính tổng tiền trước thuế
   * @returns {number} - Tổng tiền trước thuế
   */
  getSubtotal() {
    return this.items.reduce((sum, item) => sum + item.getAmount(), 0);
  }

  /**
   * Tính tiền thuế
   * @returns {number} - Tiền thuế
   */
  getTaxAmount() {
    return this.getSubtotal() * (this.taxRate / 100);
  }

  /**
   * Tính tổng tiền sau thuế
   * @returns {number} - Tổng tiền sau thuế
   */
  getTotal() {
    return this.getSubtotal() + this.getTaxAmount();
  }

  /**
   * Tạo đối tượng InvoiceModel từ dữ liệu JSON
   * @param {Object} data - Dữ liệu JSON
   * @param {Function} itemFromJson - Hàm chuyển đổi item từ JSON
   * @returns {InvoiceModel} - Đối tượng InvoiceModel mới
   */
  static fromJson(data, itemFromJson) {
    return new InvoiceModel(
      data.invoiceNumber,
      new Date(data.invoiceDate),
      new Date(data.dueDate),
      data.template,
      data.customer,
      data.items.map(item => itemFromJson(item)),
      data.taxRate,
      data.currency,
      data.notes,
      data.paymentTerms
    );
  }

  /**
   * Chuyển đối tượng InvoiceModel thành JSON
   * @returns {Object} - Dữ liệu JSON
   */
  toJson() {
    return {
      invoiceNumber: this.invoiceNumber,
      invoiceDate: this.invoiceDate.toISOString(),
      dueDate: this.dueDate.toISOString(),
      template: this.template,
      customer: this.customer,
      items: this.items.map(item => item.toJson()),
      taxRate: this.taxRate,
      currency: this.currency,
      notes: this.notes,
      paymentTerms: this.paymentTerms
    };
  }
}

module.exports = InvoiceModel;
