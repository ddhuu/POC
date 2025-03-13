const TimeEntry = require('../models/TimeEntry');

/**
 * TimesheetService
 * Service quản lý dữ liệu timesheet
 */
class TimesheetService {
  constructor() {
    // Mô phỏng dữ liệu timesheet (trong thực tế sẽ kết nối với database)
    this.timeEntries = [
      new TimeEntry(
        1,
        'Phát triển tính năng đăng nhập',
        new Date('2025-02-01T09:00:00'),
        new Date('2025-02-01T12:00:00'),
        50,
        'Website Redesign',
        'Development'
      ),
      new TimeEntry(
        2,
        'Thiết kế giao diện người dùng',
        new Date('2025-02-02T13:00:00'),
        new Date('2025-02-02T17:00:00'),
        60,
        'Website Redesign',
        'Design'
      ),
      new TimeEntry(
        3,
        'Kiểm thử tính năng đăng nhập',
        new Date('2025-02-03T10:00:00'),
        new Date('2025-02-03T11:30:00'),
        45,
        'Website Redesign',
        'Testing'
      ),
      new TimeEntry(
        4,
        'Tối ưu hóa hiệu suất',
        new Date('2025-02-04T14:00:00'),
        new Date('2025-02-04T18:00:00'),
        55,
        'Website Redesign',
        'Development'
      ),
      new TimeEntry(
        5,
        'Họp với khách hàng',
        new Date('2025-02-05T10:00:00'),
        new Date('2025-02-05T11:00:00'),
        70,
        'Website Redesign',
        'Meeting'
      )
    ];
    
    console.log('Timesheet Service đã khởi động');
  }

  /**
   * Lấy danh sách bản ghi timesheet theo dự án và khoảng thời gian
   * @param {number} projectId - ID của dự án
   * @param {Date} startDate - Ngày bắt đầu
   * @param {Date} endDate - Ngày kết thúc
   * @returns {Promise<Array<TimeEntry>>} - Danh sách bản ghi timesheet
   */
  async getTimesheetEntries(projectId, startDate, endDate) {
    console.log(`Timesheet Service: Lấy timesheet cho dự án ${projectId} từ ${startDate.toISOString().split('T')[0]} đến ${endDate.toISOString().split('T')[0]}`);
    
    // Trong thực tế, chúng ta sẽ lọc theo projectId
    // Ở đây chỉ lọc theo khoảng thời gian để đơn giản hóa
    return this.timeEntries.filter(entry => {
      const entryDate = new Date(entry.getStartTime());
      return entryDate >= startDate && entryDate <= endDate;
    });
  }

  /**
   * Lấy bản ghi timesheet theo ID
   * @param {number} entryId - ID của bản ghi
   * @returns {Promise<TimeEntry>} - Bản ghi timesheet
   * @throws {Error} - Nếu không tìm thấy bản ghi
   */
  async getTimesheetEntryById(entryId) {
    console.log(`Timesheet Service: Lấy timesheet với ID ${entryId}`);
    
    const entry = this.timeEntries.find(e => e.getId() === entryId);
    
    if (!entry) {
      throw new Error(`Không tìm thấy bản ghi timesheet với ID ${entryId}`);
    }
    
    return entry;
  }

  /**
   * Tạo bản ghi timesheet mới
   * @param {Object} entryData - Dữ liệu bản ghi
   * @returns {Promise<TimeEntry>} - Bản ghi đã tạo
   */
  async createTimesheetEntry(entryData) {
    console.log('Timesheet Service: Tạo bản ghi timesheet mới');
    
    const newId = Math.max(...this.timeEntries.map(e => e.getId())) + 1;
    const entry = new TimeEntry(
      newId,
      entryData.description,
      new Date(entryData.startTime),
      new Date(entryData.endTime),
      entryData.rate,
      entryData.project,
      entryData.activity
    );
    
    this.timeEntries.push(entry);
    return entry;
  }

  /**
   * Cập nhật bản ghi timesheet
   * @param {number} entryId - ID của bản ghi
   * @param {Object} entryData - Dữ liệu bản ghi cần cập nhật
   * @returns {Promise<TimeEntry>} - Bản ghi đã cập nhật
   * @throws {Error} - Nếu không tìm thấy bản ghi
   */
  async updateTimesheetEntry(entryId, entryData) {
    console.log(`Timesheet Service: Cập nhật bản ghi timesheet ${entryId}`);
    
    const index = this.timeEntries.findIndex(e => e.getId() === entryId);
    
    if (index === -1) {
      throw new Error(`Không tìm thấy bản ghi timesheet với ID ${entryId}`);
    }
    
    const entry = this.timeEntries[index];
    
    // Cập nhật thông tin
    const updatedEntry = new TimeEntry(
      entry.getId(),
      entryData.description || entry.getDescription(),
      entryData.startTime ? new Date(entryData.startTime) : entry.getStartTime(),
      entryData.endTime ? new Date(entryData.endTime) : entry.getEndTime(),
      entryData.rate || entry.getRate(),
      entryData.project || entry.getProject(),
      entryData.activity || entry.getActivity()
    );
    
    this.timeEntries[index] = updatedEntry;
    return updatedEntry;
  }

  /**
   * Xóa bản ghi timesheet
   * @param {number} entryId - ID của bản ghi
   * @returns {Promise<boolean>} - Kết quả xóa
   * @throws {Error} - Nếu không tìm thấy bản ghi
   */
  async deleteTimesheetEntry(entryId) {
    console.log(`Timesheet Service: Xóa bản ghi timesheet ${entryId}`);
    
    const index = this.timeEntries.findIndex(e => e.getId() === entryId);
    
    if (index === -1) {
      throw new Error(`Không tìm thấy bản ghi timesheet với ID ${entryId}`);
    }
    
    this.timeEntries.splice(index, 1);
    return true;
  }
}

module.exports = TimesheetService;
