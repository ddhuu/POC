/**
 * Main file for Kimai Invoice XLSX Export Proof of Concept
 * Tối ưu hóa với kiến trúc microservice
 */
const fs = require('fs');
const path = require('path');
const express = require('express');
const moment = require('moment');

// Import services
const CustomerService = require('./services/CustomerService');
const TimesheetService = require('./services/TimesheetService');
const InvoiceService = require('./services/InvoiceService');
const NotificationService = require('./services/NotificationService');
const ApiGatewayService = require('./services/ApiGatewayService');

// Import models
const Customer = require('./models/Customer');
const Template = require('./models/Template');
const TimeEntry = require('./models/TimeEntry');
const InvoiceModel = require('./models/InvoiceModel');

// Import utils
const Calculator = require('./utils/Calculator');
const NumberGenerator = require('./utils/NumberGenerator');

// Create Express app
const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Khởi tạo các service
const customerService = new CustomerService();
const timesheetService = new TimesheetService();
const invoiceService = new InvoiceService();
const notificationService = new NotificationService();
const apiGatewayService = new ApiGatewayService(
  customerService,
  timesheetService,
  invoiceService,
  notificationService
);

// Route để tạo và tải xuống hóa đơn XLSX
app.get('/api/invoices/create', async (req, res) => {
  try {
    const userId = parseInt(req.query.userId) || 1;
    const customerId = parseInt(req.query.customerId) || 1;
    const projectId = parseInt(req.query.projectId) || 1;
    const startDate = new Date(req.query.startDate || '2025-02-01');
    const endDate = new Date(req.query.endDate || '2025-02-28');
    const format = req.query.format || 'xlsx';
    
    const options = {
      format: format,
      taxRate: parseFloat(req.query.taxRate) || 10,
      currency: req.query.currency || 'USD',
      notes: req.query.notes || '',
      paymentTerms: req.query.paymentTerms || 'Thanh toán trong vòng 30 ngày'
    };
    
    const result = await apiGatewayService.handleCreateInvoiceRequest(
      userId,
      customerId,
      projectId,
      startDate,
      endDate,
      options
    );
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error creating invoice:', error);
    res.status(500).json({
      success: false,
      message: `Error creating invoice: ${error.message}`,
      error: error.message
    });
  }
});

// Route để tải xuống hóa đơn
app.get('/api/invoices/:customerId/download', async (req, res) => {
  try {
    const invoiceNumber = req.query.invoiceNumber || 'INV-10001';
    const format = req.query.format || 'xlsx';
    
    const result = await apiGatewayService.handleDownloadInvoiceRequest(invoiceNumber, format);
    
    if (result.success) {
      const { filePath, fileName, mimeType } = result.data;
      
      res.setHeader('Content-Type', mimeType);
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error downloading invoice:', error);
    res.status(500).json({
      success: false,
      message: `Error downloading invoice: ${error.message}`,
      error: error.message
    });
  }
});

// Route để hiển thị trang chủ
app.get('/', (req, res) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Kimai Invoice XLSX Export</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
        .container { max-width: 800px; margin: 0 auto; padding: 20px; }
        h1 { color: #2c3e50; }
        h2 { color: #3498db; margin-top: 30px; }
        .card { border: 1px solid #ddd; border-radius: 8px; padding: 20px; margin-bottom: 20px; }
        .form-group { margin-bottom: 15px; }
        label { display: block; margin-bottom: 5px; font-weight: bold; }
        input, select { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
        button { 
          background-color: #3498db; 
          color: white; 
          border: none; 
          padding: 10px 15px; 
          border-radius: 4px; 
          cursor: pointer;
          font-size: 16px;
        }
        button:hover { background-color: #2980b9; }
        .result { margin-top: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 4px; }
        .success { color: #28a745; }
        .error { color: #dc3545; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Kimai Invoice XLSX Export</h1>
        <p>Proof of Concept cho chức năng xuất hóa đơn XLSX với kiến trúc microservice</p>
        
        <div class="card">
          <h2>Tạo Hóa Đơn Mới</h2>
          <div class="form-group">
            <label for="customerId">Khách hàng:</label>
            <select id="customerId">
              <option value="1">ACME Corporation</option>
              <option value="2">TechSolutions Inc.</option>
              <option value="3">Global Enterprises</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="projectId">Dự án:</label>
            <select id="projectId">
              <option value="1">Website Redesign</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="startDate">Ngày bắt đầu:</label>
            <input type="date" id="startDate" value="2025-02-01">
          </div>
          
          <div class="form-group">
            <label for="endDate">Ngày kết thúc:</label>
            <input type="date" id="endDate" value="2025-02-28">
          </div>
          
          <div class="form-group">
            <label for="format">Định dạng:</label>
            <select id="format">
              <option value="xlsx">XLSX</option>
            </select>
          </div>
          
          <button id="createInvoiceBtn">Tạo Hóa Đơn</button>
          
          <div id="result" class="result" style="display: none;"></div>
        </div>
      </div>
      
      <script>
        document.getElementById('createInvoiceBtn').addEventListener('click', async () => {
          const customerId = document.getElementById('customerId').value;
          const projectId = document.getElementById('projectId').value;
          const startDate = document.getElementById('startDate').value;
          const endDate = document.getElementById('endDate').value;
          const format = document.getElementById('format').value;
          
          const resultDiv = document.getElementById('result');
          resultDiv.innerHTML = 'Đang tạo hóa đơn...';
          resultDiv.style.display = 'block';
          
          try {
            const response = await fetch(\`/api/invoices/create?userId=1&customerId=\${customerId}&projectId=\${projectId}&startDate=\${startDate}&endDate=\${endDate}&format=\${format}\`);
            const data = await response.json();
            
            if (data.success) {
              resultDiv.innerHTML = \`
                <p class="success">\${data.message}</p>
                <p>Bạn có thể tải xuống hóa đơn tại <a href="\${data.data.downloadUrl}" target="_blank">đây</a></p>
              \`;
            } else {
              resultDiv.innerHTML = \`<p class="error">\${data.message}</p>\`;
            }
          } catch (error) {
            resultDiv.innerHTML = \`<p class="error">Lỗi: \${error.message}</p>\`;
          }
        });
      </script>
    </body>
    </html>
  `;
  
  res.send(html);
});

// Mô phỏng luồng xử lý xuất hóa đơn XLSX
async function simulateInvoiceExport() {
  console.log('\n\n===== BẮT ĐẦU MÔ PHỎNG LUỒNG XỬ LÝ XUẤT HÓA ĐƠN XLSX =====');
  
  const userId = 1;
  const customerId = 1;
  const projectId = 1;
  const startDate = new Date('2025-02-01');
  const endDate = new Date('2025-02-28');
  const options = {
    format: 'xlsx',
    taxRate: 10,
    currency: 'USD'
  };
  
  console.log('\n\n===== YÊU CẦU TẠO HÓA ĐƠN =====');
  console.log(`Người dùng: ${userId}`);
  console.log(`Khách hàng: ${customerId}`);
  console.log(`Dự án: ${projectId}`);
  console.log(`Khoảng thời gian: ${startDate.toISOString().split('T')[0]} đến ${endDate.toISOString().split('T')[0]}`);
  console.log(`Định dạng: ${options.format}`);
  
  const result = await apiGatewayService.handleCreateInvoiceRequest(
    userId,
    customerId,
    projectId,
    startDate,
    endDate,
    options
  );
  
  console.log('\n\n===== KẾT QUẢ =====');
  if (result.success) {
    console.log(`Hóa đơn đã được tạo thành công với số ${result.data.invoiceId}`);
    console.log(`URL tải xuống: ${result.data.downloadUrl}`);
  } else {
    console.log(`Lỗi: ${result.message}`);
  }
  
  console.log('\n\n===== KẾT THÚC MÔ PHỎNG =====');
}

// Khởi động server
app.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`);
  
  // Chạy mô phỏng sau khi server khởi động
  setTimeout(() => {
    simulateInvoiceExport();
  }, 1000);
});
