/**
 * Template model
 * Đại diện cho thông tin công ty/mẫu hóa đơn trong hệ thống
 */
class Template {
  /**
   * Khởi tạo đối tượng Template
   * @param {number} id - ID của template
   * @param {string} company - Tên công ty
   * @param {string} address - Địa chỉ công ty
   * @param {string} phone - Số điện thoại công ty
   * @param {string} email - Email công ty
   * @param {string} website - Website công ty (tùy chọn)
   * @param {string} vatId - Mã số thuế (tùy chọn)
   * @param {string} logo - URL logo công ty (tùy chọn)
   */
  constructor(id, company, address, phone, email, website = '', vatId = '', logo = '') {
    this.id = id;
    this.company = company;
    this.address = address;
    this.phone = phone;
    this.email = email;
    this.website = website;
    this.vatId = vatId;
    this.logo = logo;
  }

  getId() { return this.id; }
  getCompany() { return this.company; }
  getAddress() { return this.address; }
  getPhone() { return this.phone; }
  getEmail() { return this.email; }
  getWebsite() { return this.website; }
  getVatId() { return this.vatId; }
  getLogo() { return this.logo; }

  /**
   * Tạo đối tượng Template từ dữ liệu JSON
   * @param {Object} data - Dữ liệu JSON
   * @returns {Template} - Đối tượng Template mới
   */
  static fromJson(data) {
    return new Template(
      data.id,
      data.company,
      data.address,
      data.phone,
      data.email,
      data.website,
      data.vatId,
      data.logo
    );
  }

  /**
   * Chuyển đối tượng Template thành JSON
   * @returns {Object} - Dữ liệu JSON
   */
  toJson() {
    return {
      id: this.id,
      company: this.company,
      address: this.address,
      phone: this.phone,
      email: this.email,
      website: this.website,
      vatId: this.vatId,
      logo: this.logo
    };
  }
}

module.exports = Template;
