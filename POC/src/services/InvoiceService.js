const InvoiceModel = require('../models/InvoiceModel');
const NumberGenerator = require('../utils/NumberGenerator');
const XlsxRenderer = require('../renderers/XlsxRenderer');
const path = require('path');
const fs = require('fs');

/**
 * InvoiceService
 * Service quản lý hóa đơn
 */
class InvoiceService {
  constructor() {
    // Mô phỏng dữ liệu hóa đơn (trong thực tế sẽ kết nối với database)
    this.invoices = [];
    this.numberGenerator = new NumberGenerator('INV-', 10001);
    this.xlsxRenderer = new XlsxRenderer();
    
    // Tạo thư mục lưu trữ hóa đơn nếu chưa tồn tại
    this.storageDir = path.join(process.cwd(), 'storage', 'invoices');
    if (!fs.existsSync(this.storageDir)) {
      fs.mkdirSync(this.storageDir, { recursive: true });
    }
    
    console.log('Invoice Service đã khởi động');
  }

  /**
   * Tạo và xuất hóa đơn
   * @param {Object} customerData - Thông tin khách hàng
   * @param {Array} timesheetData - Dữ liệu timesheet
   * @param {Object} options - Tùy chọn (định dạng, thuế, v.v.)
   * @returns {Promise<Object>} - Thông tin hóa đơn đã tạo
   */
  async createAndExportInvoice(customerData, timesheetData, options = {}) {
    console.log(`Invoice Service: Tạo hóa đơn cho khách hàng ${customerData.getName()}`);
    
    // Tạo mẫu hóa đơn (template)
    const template = {
      id: 1,
      company: 'Kimai Time Tracking',
      address: '123 Kimai Street, Kimai City, 10001',
      phone: '(123) 456-7890',
      email: 'info@kimai.org',
      website: 'https://www.kimai.org',
      vatId: 'VAT-987654321',
      getLogo: () => null,
      getId: () => 1,
      getCompany: () => 'Kimai Time Tracking',
      getAddress: () => '123 Kimai Street, Kimai City, 10001',
      getPhone: () => '(123) 456-7890',
      getEmail: () => 'info@kimai.org',
      getWebsite: () => 'https://www.kimai.org',
      getVatId: () => 'VAT-987654321'
    };
    
    // Tạo số hóa đơn
    const invoiceNumber = this.numberGenerator.getNextNumber();
    
    // Tạo ngày hóa đơn và ngày đáo hạn
    const invoiceDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30); // Đáo hạn sau 30 ngày
    
    // Tạo mô hình hóa đơn
    const invoiceModel = new InvoiceModel(
      invoiceNumber,
      invoiceDate,
      dueDate,
      template,
      customerData,
      timesheetData,
      options.taxRate || 10,
      options.currency || 'USD',
      options.notes || '',
      options.paymentTerms || 'Thanh toán trong vòng 30 ngày'
    );
    
    // Lưu hóa đơn vào danh sách
    this.invoices.push(invoiceModel);
    
    // Xuất hóa đơn theo định dạng yêu cầu
    const format = options.format || 'xlsx';
    
    if (format === 'xlsx') {
      console.log(`Invoice Service: Xuất hóa đơn ${invoiceNumber} sang định dạng XLSX`);
      console.log('1. Tạo workbook và worksheet mới');
      console.log('2. Thiết lập thông tin công ty và khách hàng');
      console.log('3. Tạo bảng dữ liệu cho các mục trong hóa đơn');
      console.log('4. Áp dụng định dạng (font, màu sắc, đường viền)');
      console.log('5. Tính và hiển thị tổng cộng');
      console.log('6. Lưu file XLSX');
      
      // Tạo tên file
      const fileName = `${invoiceNumber.replace(/[^a-zA-Z0-9]/g, '_')}.xlsx`;
      const filePath = path.join(this.storageDir, fileName);
      
      // Xuất file XLSX
      await this.xlsxRenderer.render(invoiceModel, filePath);
      
      // Trả về thông tin hóa đơn
      return {
        invoiceId: invoiceModel.getInvoiceNumber(),
        customerId: customerData.getId(),
        format: 'xlsx',
        filePath: filePath,
        downloadUrl: `/api/invoices/${customerData.getId()}/download?format=xlsx`
      };
    } else {
      throw new Error(`Định dạng ${format} chưa được hỗ trợ`);
    }
  }

  /**
   * Lấy danh sách hóa đơn
   * @param {number} customerId - ID của khách hàng (tùy chọn)
   * @returns {Promise<Array>} - Danh sách hóa đơn
   */
  async getInvoices(customerId = null) {
    console.log('Invoice Service: Lấy danh sách hóa đơn');
    
    if (customerId) {
      return this.invoices.filter(invoice => invoice.getCustomer().getId() === customerId);
    }
    
    return this.invoices;
  }

  /**
   * Lấy hóa đơn theo số hóa đơn
   * @param {string} invoiceNumber - Số hóa đơn
   * @returns {Promise<Object>} - Thông tin hóa đơn
   * @throws {Error} - Nếu không tìm thấy hóa đơn
   */
  async getInvoiceByNumber(invoiceNumber) {
    console.log(`Invoice Service: Lấy hóa đơn ${invoiceNumber}`);
    
    const invoice = this.invoices.find(inv => inv.getInvoiceNumber() === invoiceNumber);
    
    if (!invoice) {
      throw new Error(`Không tìm thấy hóa đơn với số ${invoiceNumber}`);
    }
    
    return invoice;
  }

  /**
   * Tải xuống hóa đơn theo định dạng
   * @param {string} invoiceNumber - Số hóa đơn
   * @param {string} format - Định dạng (xlsx, pdf, v.v.)
   * @returns {Promise<Object>} - Thông tin file
   * @throws {Error} - Nếu không tìm thấy hóa đơn hoặc định dạng không được hỗ trợ
   */
  async downloadInvoice(invoiceNumber, format = 'xlsx') {
    console.log(`Invoice Service: Tải xuống hóa đơn ${invoiceNumber} dạng ${format}`);
    
    const invoice = await this.getInvoiceByNumber(invoiceNumber);
    
    if (format === 'xlsx') {
      const fileName = `${invoiceNumber.replace(/[^a-zA-Z0-9]/g, '_')}.xlsx`;
      const filePath = path.join(this.storageDir, fileName);
      
      // Kiểm tra xem file đã tồn tại chưa
      if (!fs.existsSync(filePath)) {
        // Nếu chưa tồn tại, tạo file mới
        await this.xlsxRenderer.render(invoice, filePath);
      }
      
      return {
        filePath: filePath,
        fileName: fileName,
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      };
    } else {
      throw new Error(`Định dạng ${format} chưa được hỗ trợ`);
    }
  }

  /**
   * Xóa hóa đơn
   * @param {string} invoiceNumber - Số hóa đơn
   * @returns {Promise<boolean>} - Kết quả xóa
   * @throws {Error} - Nếu không tìm thấy hóa đơn
   */
  async deleteInvoice(invoiceNumber) {
    console.log(`Invoice Service: Xóa hóa đơn ${invoiceNumber}`);
    
    const index = this.invoices.findIndex(inv => inv.getInvoiceNumber() === invoiceNumber);
    
    if (index === -1) {
      throw new Error(`Không tìm thấy hóa đơn với số ${invoiceNumber}`);
    }
    
    // Xóa file nếu tồn tại
    const fileName = `${invoiceNumber.replace(/[^a-zA-Z0-9]/g, '_')}.xlsx`;
    const filePath = path.join(this.storageDir, fileName);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    // Xóa khỏi danh sách
    this.invoices.splice(index, 1);
    return true;
  }
}

module.exports = InvoiceService;
