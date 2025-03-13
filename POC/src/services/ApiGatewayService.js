/**
 * ApiGatewayService
 * Service đóng vai trò như API Gateway, điều phối các service khác
 */
class ApiGatewayService {
  /**
   * Khởi tạo ApiGatewayService
   * @param {Object} customerService - Customer Service
   * @param {Object} timesheetService - Timesheet Service
   * @param {Object} invoiceService - Invoice Service
   * @param {Object} notificationService - Notification Service
   */
  constructor(customerService, timesheetService, invoiceService, notificationService) {
    this.customerService = customerService;
    this.timesheetService = timesheetService;
    this.invoiceService = invoiceService;
    this.notificationService = notificationService;
    
    console.log('API Gateway Service đã khởi động');
  }

  /**
   * Xử lý yêu cầu tạo hóa đơn
   * @param {number} userId - ID của người dùng
   * @param {number} customerId - ID của khách hàng
   * @param {number} projectId - ID của dự án
   * @param {Date} startDate - Ngày bắt đầu
   * @param {Date} endDate - Ngày kết thúc
   * @param {Object} options - Tùy chọn (định dạng, thuế, v.v.)
   * @returns {Promise<Object>} - Kết quả tạo hóa đơn
   */
  async handleCreateInvoiceRequest(userId, customerId, projectId, startDate, endDate, options = {}) {
    console.log(`API Gateway nhận yêu cầu tạo hóa đơn cho khách hàng ${customerId}`);
    
    try {
      // 1. Lấy thông tin khách hàng
      const customerData = await this.customerService.getCustomerById(customerId);
      
      // 2. Lấy dữ liệu timesheet
      const timesheetData = await this.timesheetService.getTimesheetEntries(projectId, startDate, endDate);
      
      // 3. Tạo và xuất hóa đơn
      const invoiceResult = await this.invoiceService.createAndExportInvoice(customerData, timesheetData, options);
      
      // 4. Gửi thông báo
      await this.notificationService.sendInvoiceNotification(userId, invoiceResult.invoiceId, customerId);
      
      // 5. Trả về kết quả
      return {
        success: true,
        message: `Hóa đơn đã được tạo thành công với số ${invoiceResult.invoiceId}`,
        data: {
          invoiceId: invoiceResult.invoiceId,
          downloadUrl: invoiceResult.downloadUrl
        }
      };
    } catch (error) {
      console.error('Lỗi khi tạo hóa đơn:', error);
      
      return {
        success: false,
        message: `Lỗi khi tạo hóa đơn: ${error.message}`,
        error: error.message
      };
    }
  }

  /**
   * Xử lý yêu cầu lấy danh sách hóa đơn
   * @param {number} customerId - ID của khách hàng (tùy chọn)
   * @returns {Promise<Object>} - Danh sách hóa đơn
   */
  async handleGetInvoicesRequest(customerId = null) {
    console.log('API Gateway nhận yêu cầu lấy danh sách hóa đơn');
    
    try {
      const invoices = await this.invoiceService.getInvoices(customerId);
      
      return {
        success: true,
        data: invoices
      };
    } catch (error) {
      console.error('Lỗi khi lấy danh sách hóa đơn:', error);
      
      return {
        success: false,
        message: `Lỗi khi lấy danh sách hóa đơn: ${error.message}`,
        error: error.message
      };
    }
  }

  /**
   * Xử lý yêu cầu tải xuống hóa đơn
   * @param {string} invoiceNumber - Số hóa đơn
   * @param {string} format - Định dạng (xlsx, pdf, v.v.)
   * @returns {Promise<Object>} - Thông tin file
   */
  async handleDownloadInvoiceRequest(invoiceNumber, format = 'xlsx') {
    console.log(`API Gateway nhận yêu cầu tải xuống hóa đơn ${invoiceNumber}`);
    
    try {
      const downloadResult = await this.invoiceService.downloadInvoice(invoiceNumber, format);
      
      return {
        success: true,
        data: downloadResult
      };
    } catch (error) {
      console.error('Lỗi khi tải xuống hóa đơn:', error);
      
      return {
        success: false,
        message: `Lỗi khi tải xuống hóa đơn: ${error.message}`,
        error: error.message
      };
    }
  }
}

module.exports = ApiGatewayService;
