/**
 * NotificationService
 * Service quản lý thông báo
 */
class NotificationService {
  constructor() {
    // Mô phỏng dữ liệu thông báo (trong thực tế sẽ kết nối với hệ thống thông báo)
    this.notifications = [];
    
    console.log('Notification Service đã khởi động');
  }

  /**
   * Gửi thông báo về hóa đơn
   * @param {number} userId - ID của người dùng
   * @param {string} invoiceNumber - Số hóa đơn
   * @param {number} customerId - ID của khách hàng
   * @returns {Promise<Object>} - Thông tin thông báo
   */
  async sendInvoiceNotification(userId, invoiceNumber, customerId) {
    console.log(`Notification Service: Gửi thông báo về hóa đơn ${invoiceNumber}`);
    
    const notification = {
      id: this.notifications.length + 1,
      userId: userId,
      type: 'invoice_created',
      message: `Hóa đơn ${invoiceNumber} đã được tạo cho khách hàng ${customerId}`,
      timestamp: new Date(),
      read: false
    };
    
    this.notifications.push(notification);
    
    console.log(`Đã gửi thông báo cho người dùng ${userId} về hóa đơn ${invoiceNumber} cho khách hàng ${customerId}`);
    
    return notification;
  }

  /**
   * Lấy danh sách thông báo của người dùng
   * @param {number} userId - ID của người dùng
   * @param {boolean} unreadOnly - Chỉ lấy thông báo chưa đọc
   * @returns {Promise<Array>} - Danh sách thông báo
   */
  async getUserNotifications(userId, unreadOnly = false) {
    console.log(`Notification Service: Lấy thông báo cho người dùng ${userId}`);
    
    let notifications = this.notifications.filter(n => n.userId === userId);
    
    if (unreadOnly) {
      notifications = notifications.filter(n => !n.read);
    }
    
    return notifications;
  }

  /**
   * Đánh dấu thông báo đã đọc
   * @param {number} notificationId - ID của thông báo
   * @returns {Promise<boolean>} - Kết quả cập nhật
   * @throws {Error} - Nếu không tìm thấy thông báo
   */
  async markNotificationAsRead(notificationId) {
    console.log(`Notification Service: Đánh dấu thông báo ${notificationId} đã đọc`);
    
    const notification = this.notifications.find(n => n.id === notificationId);
    
    if (!notification) {
      throw new Error(`Không tìm thấy thông báo với ID ${notificationId}`);
    }
    
    notification.read = true;
    return true;
  }

  /**
   * Xóa thông báo
   * @param {number} notificationId - ID của thông báo
   * @returns {Promise<boolean>} - Kết quả xóa
   * @throws {Error} - Nếu không tìm thấy thông báo
   */
  async deleteNotification(notificationId) {
    console.log(`Notification Service: Xóa thông báo ${notificationId}`);
    
    const index = this.notifications.findIndex(n => n.id === notificationId);
    
    if (index === -1) {
      throw new Error(`Không tìm thấy thông báo với ID ${notificationId}`);
    }
    
    this.notifications.splice(index, 1);
    return true;
  }
}

module.exports = NotificationService;
