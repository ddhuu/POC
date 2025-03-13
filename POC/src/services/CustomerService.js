const Customer = require('../models/Customer');

/**
 * CustomerService
 * Service quản lý thông tin khách hàng
 */
class CustomerService {
  constructor() {
    // Mô phỏng dữ liệu khách hàng (trong thực tế sẽ kết nối với database)
    this.customers = [
      new Customer(
        1,
        'ACME Corporation',
        '123 Business Street, Business City, 10001',
        'contact@acme.com',
        '(123) 456-7890',
        'VAT-12345678'
      ),
      new Customer(
        2,
        'TechSolutions Inc.',
        '456 Tech Avenue, Tech City, 20002',
        'info@techsolutions.com',
        '(234) 567-8901',
        'VAT-23456789'
      ),
      new Customer(
        3,
        'Global Enterprises',
        '789 Global Road, Global City, 30003',
        'contact@globalenterprises.com',
        '(345) 678-9012',
        'VAT-34567890'
      )
    ];
    
    console.log('Customer Service đã khởi động');
  }

  /**
   * Lấy thông tin khách hàng theo ID
   * @param {number} customerId - ID của khách hàng
   * @returns {Promise<Customer>} - Thông tin khách hàng
   * @throws {Error} - Nếu không tìm thấy khách hàng
   */
  async getCustomerById(customerId) {
    console.log(`Customer Service: Lấy thông tin khách hàng ${customerId}`);
    
    const customer = this.customers.find(c => c.getId() === customerId);
    
    if (!customer) {
      throw new Error(`Không tìm thấy khách hàng với ID ${customerId}`);
    }
    
    return customer;
  }

  /**
   * Lấy danh sách tất cả khách hàng
   * @returns {Promise<Array<Customer>>} - Danh sách khách hàng
   */
  async getAllCustomers() {
    console.log('Customer Service: Lấy danh sách tất cả khách hàng');
    return this.customers;
  }

  /**
   * Tạo khách hàng mới
   * @param {Object} customerData - Dữ liệu khách hàng
   * @returns {Promise<Customer>} - Khách hàng đã tạo
   */
  async createCustomer(customerData) {
    console.log('Customer Service: Tạo khách hàng mới');
    
    const newId = Math.max(...this.customers.map(c => c.getId())) + 1;
    const customer = new Customer(
      newId,
      customerData.name,
      customerData.address,
      customerData.email,
      customerData.phone,
      customerData.vatId
    );
    
    this.customers.push(customer);
    return customer;
  }

  /**
   * Cập nhật thông tin khách hàng
   * @param {number} customerId - ID của khách hàng
   * @param {Object} customerData - Dữ liệu khách hàng cần cập nhật
   * @returns {Promise<Customer>} - Khách hàng đã cập nhật
   * @throws {Error} - Nếu không tìm thấy khách hàng
   */
  async updateCustomer(customerId, customerData) {
    console.log(`Customer Service: Cập nhật khách hàng ${customerId}`);
    
    const index = this.customers.findIndex(c => c.getId() === customerId);
    
    if (index === -1) {
      throw new Error(`Không tìm thấy khách hàng với ID ${customerId}`);
    }
    
    const customer = this.customers[index];
    
    // Cập nhật thông tin (trong thực tế sẽ có cách tốt hơn để cập nhật)
    const updatedCustomer = new Customer(
      customer.getId(),
      customerData.name || customer.getName(),
      customerData.address || customer.getAddress(),
      customerData.email || customer.getEmail(),
      customerData.phone || customer.getPhone(),
      customerData.vatId || customer.getVatId()
    );
    
    this.customers[index] = updatedCustomer;
    return updatedCustomer;
  }

  /**
   * Xóa khách hàng
   * @param {number} customerId - ID của khách hàng
   * @returns {Promise<boolean>} - Kết quả xóa
   * @throws {Error} - Nếu không tìm thấy khách hàng
   */
  async deleteCustomer(customerId) {
    console.log(`Customer Service: Xóa khách hàng ${customerId}`);
    
    const index = this.customers.findIndex(c => c.getId() === customerId);
    
    if (index === -1) {
      throw new Error(`Không tìm thấy khách hàng với ID ${customerId}`);
    }
    
    this.customers.splice(index, 1);
    return true;
  }
}

module.exports = CustomerService;
