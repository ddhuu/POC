/**
 * Customer model
 * Đại diện cho thông tin khách hàng trong hệ thống
 */
class Customer {
  /**
   * Khởi tạo đối tượng Customer
   * @param {number} id - ID của khách hàng
   * @param {string} name - Tên khách hàng
   * @param {string} address - Địa chỉ khách hàng
   * @param {string} email - Email khách hàng
   * @param {string} phone - Số điện thoại khách hàng (tùy chọn)
   * @param {string} vatId - Mã số thuế (tùy chọn)
   */
  constructor(id, name, address, email, phone = '', vatId = '') {
    this.id = id;
    this.name = name;
    this.address = address;
    this.email = email;
    this.phone = phone;
    this.vatId = vatId;
  }

  getId() { return this.id; }
  getName() { return this.name; }
  getAddress() { return this.address; }
  getEmail() { return this.email; }
  getPhone() { return this.phone; }
  getVatId() { return this.vatId; }

  /**
   * Tạo đối tượng Customer từ dữ liệu JSON
   * @param {Object} data - Dữ liệu JSON
   * @returns {Customer} - Đối tượng Customer mới
   */
  static fromJson(data) {
    return new Customer(
      data.id,
      data.name,
      data.address,
      data.email,
      data.phone,
      data.vatId
    );
  }

  /**
   * Chuyển đối tượng Customer thành JSON
   * @returns {Object} - Dữ liệu JSON
   */
  toJson() {
    return {
      id: this.id,
      name: this.name,
      address: this.address,
      email: this.email,
      phone: this.phone,
      vatId: this.vatId
    };
  }
}

module.exports = Customer;
