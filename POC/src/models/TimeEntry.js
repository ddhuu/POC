/**
 * TimeEntry model
 * Đại diện cho một bản ghi thời gian làm việc trong hệ thống
 */
class TimeEntry {
  /**
   * Khởi tạo đối tượng TimeEntry
   * @param {number} id - ID của bản ghi
   * @param {string} description - Mô tả công việc
   * @param {Date} startTime - Thời gian bắt đầu
   * @param {Date} endTime - Thời gian kết thúc
   * @param {number} rate - Đơn giá theo giờ
   * @param {string} project - Tên dự án (tùy chọn)
   * @param {string} activity - Tên hoạt động (tùy chọn)
   */
  constructor(id, description, startTime, endTime, rate, project = '', activity = '') {
    this.id = id;
    this.description = description;
    this.startTime = startTime;
    this.endTime = endTime;
    this.rate = rate;
    this.project = project;
    this.activity = activity;
  }

  getId() { return this.id; }
  getDescription() { return this.description; }
  getStartTime() { return this.startTime; }
  getEndTime() { return this.endTime; }
  getRate() { return this.rate; }
  getProject() { return this.project; }
  getActivity() { return this.activity; }

  /**
   * Tính thời gian làm việc (tính bằng giờ)
   * @returns {number} - Số giờ làm việc
   */
  getDuration() {
    const diffMs = this.endTime.getTime() - this.startTime.getTime();
    return diffMs / (1000 * 60 * 60); // Chuyển đổi từ milliseconds sang giờ
  }

  /**
   * Tính tổng chi phí cho bản ghi thời gian
   * @returns {number} - Tổng chi phí
   */
  getAmount() {
    return this.getDuration() * this.rate;
  }

  /**
   * Tạo đối tượng TimeEntry từ dữ liệu JSON
   * @param {Object} data - Dữ liệu JSON
   * @returns {TimeEntry} - Đối tượng TimeEntry mới
   */
  static fromJson(data) {
    return new TimeEntry(
      data.id,
      data.description,
      new Date(data.startTime),
      new Date(data.endTime),
      data.rate,
      data.project,
      data.activity
    );
  }

  /**
   * Chuyển đối tượng TimeEntry thành JSON
   * @returns {Object} - Dữ liệu JSON
   */
  toJson() {
    return {
      id: this.id,
      description: this.description,
      startTime: this.startTime.toISOString(),
      endTime: this.endTime.toISOString(),
      rate: this.rate,
      project: this.project,
      activity: this.activity
    };
  }
}

module.exports = TimeEntry;
