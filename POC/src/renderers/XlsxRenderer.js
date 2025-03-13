const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');
const Calculator = require('../utils/Calculator');

/**
 * XlsxRenderer
 * Lớp chuyên biệt để render hóa đơn sang định dạng XLSX
 */
class XlsxRenderer {
  /**
   * Tạo file XLSX từ mô hình hóa đơn
   * @param {Object} invoiceModel - Mô hình hóa đơn
   * @param {string} outputPath - Đường dẫn lưu file (tùy chọn)
   * @returns {Promise<Buffer>} - Buffer chứa dữ liệu file XLSX
   */
  async render(invoiceModel, outputPath = null) {
    // Tạo workbook mới
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Kimai Invoice System';
    workbook.lastModifiedBy = 'Kimai Invoice System';
    workbook.created = new Date();
    workbook.modified = new Date();

    // Tạo worksheet
    const worksheet = workbook.addWorksheet('Invoice', {
      pageSetup: {
        paperSize: 9, // A4
        orientation: 'portrait',
        fitToPage: true,
        fitToWidth: 1,
        fitToHeight: 0
      }
    });

    // Thiết lập các cột
    worksheet.columns = [
      { header: '', key: 'col1', width: 5 },
      { header: '', key: 'col2', width: 30 },
      { header: '', key: 'col3', width: 15 },
      { header: '', key: 'col4', width: 15 },
      { header: '', key: 'col5', width: 15 }
    ];

    // Thêm thông tin công ty
    const template = invoiceModel.getTemplate();
    let rowIndex = 1;
    
    // Logo (nếu có)
    if (template.getLogo()) {
      try {
        const logoPath = template.getLogo();
        if (fs.existsSync(logoPath)) {
          const logoId = workbook.addImage({
            filename: logoPath,
            extension: path.extname(logoPath).substring(1)
          });
          worksheet.addImage(logoId, {
            tl: { col: 0.5, row: rowIndex },
            ext: { width: 150, height: 75 }
          });
          rowIndex += 5;
        }
      } catch (error) {
        console.error('Error adding logo:', error);
      }
    }

    // Thông tin công ty
    worksheet.mergeCells(`A${rowIndex}:C${rowIndex}`);
    const companyNameCell = worksheet.getCell(`A${rowIndex}`);
    companyNameCell.value = template.getCompany();
    companyNameCell.font = { bold: true, size: 14 };
    rowIndex++;

    worksheet.mergeCells(`A${rowIndex}:C${rowIndex}`);
    worksheet.getCell(`A${rowIndex}`).value = template.getAddress();
    rowIndex++;

    worksheet.mergeCells(`A${rowIndex}:C${rowIndex}`);
    worksheet.getCell(`A${rowIndex}`).value = `Phone: ${template.getPhone()} | Email: ${template.getEmail()}`;
    rowIndex++;

    if (template.getWebsite()) {
      worksheet.mergeCells(`A${rowIndex}:C${rowIndex}`);
      worksheet.getCell(`A${rowIndex}`).value = `Website: ${template.getWebsite()}`;
      rowIndex++;
    }

    if (template.getVatId()) {
      worksheet.mergeCells(`A${rowIndex}:C${rowIndex}`);
      worksheet.getCell(`A${rowIndex}`).value = `VAT ID: ${template.getVatId()}`;
      rowIndex++;
    }

    rowIndex += 2; // Khoảng trống

    // Tiêu đề hóa đơn
    worksheet.mergeCells(`A${rowIndex}:E${rowIndex}`);
    const invoiceTitleCell = worksheet.getCell(`A${rowIndex}`);
    invoiceTitleCell.value = 'INVOICE';
    invoiceTitleCell.font = { bold: true, size: 18 };
    invoiceTitleCell.alignment = { horizontal: 'center' };
    rowIndex += 2;

    // Thông tin hóa đơn
    worksheet.mergeCells(`A${rowIndex}:B${rowIndex}`);
    worksheet.getCell(`A${rowIndex}`).value = 'Invoice Number:';
    worksheet.getCell(`A${rowIndex}`).font = { bold: true };
    
    worksheet.mergeCells(`C${rowIndex}:E${rowIndex}`);
    worksheet.getCell(`C${rowIndex}`).value = invoiceModel.getInvoiceNumber();
    rowIndex++;

    worksheet.mergeCells(`A${rowIndex}:B${rowIndex}`);
    worksheet.getCell(`A${rowIndex}`).value = 'Invoice Date:';
    worksheet.getCell(`A${rowIndex}`).font = { bold: true };
    
    worksheet.mergeCells(`C${rowIndex}:E${rowIndex}`);
    worksheet.getCell(`C${rowIndex}`).value = invoiceModel.getInvoiceDate().toLocaleDateString();
    rowIndex++;

    worksheet.mergeCells(`A${rowIndex}:B${rowIndex}`);
    worksheet.getCell(`A${rowIndex}`).value = 'Due Date:';
    worksheet.getCell(`A${rowIndex}`).font = { bold: true };
    
    worksheet.mergeCells(`C${rowIndex}:E${rowIndex}`);
    worksheet.getCell(`C${rowIndex}`).value = invoiceModel.getDueDate().toLocaleDateString();
    rowIndex += 2;

    // Thông tin khách hàng
    const customer = invoiceModel.getCustomer();
    
    worksheet.mergeCells(`A${rowIndex}:E${rowIndex}`);
    worksheet.getCell(`A${rowIndex}`).value = 'BILL TO:';
    worksheet.getCell(`A${rowIndex}`).font = { bold: true };
    rowIndex++;

    worksheet.mergeCells(`A${rowIndex}:E${rowIndex}`);
    worksheet.getCell(`A${rowIndex}`).value = customer.getName();
    worksheet.getCell(`A${rowIndex}`).font = { bold: true };
    rowIndex++;

    worksheet.mergeCells(`A${rowIndex}:E${rowIndex}`);
    worksheet.getCell(`A${rowIndex}`).value = customer.getAddress();
    rowIndex++;

    worksheet.mergeCells(`A${rowIndex}:E${rowIndex}`);
    worksheet.getCell(`A${rowIndex}`).value = `Email: ${customer.getEmail()}`;
    rowIndex++;

    if (customer.getPhone()) {
      worksheet.mergeCells(`A${rowIndex}:E${rowIndex}`);
      worksheet.getCell(`A${rowIndex}`).value = `Phone: ${customer.getPhone()}`;
      rowIndex++;
    }

    if (customer.getVatId()) {
      worksheet.mergeCells(`A${rowIndex}:E${rowIndex}`);
      worksheet.getCell(`A${rowIndex}`).value = `VAT ID: ${customer.getVatId()}`;
      rowIndex++;
    }

    rowIndex += 2; // Khoảng trống

    // Tiêu đề bảng
    const headerRow = rowIndex;
    worksheet.getCell(`A${rowIndex}`).value = 'No.';
    worksheet.getCell(`B${rowIndex}`).value = 'Description';
    worksheet.getCell(`C${rowIndex}`).value = 'Hours';
    worksheet.getCell(`D${rowIndex}`).value = 'Rate';
    worksheet.getCell(`E${rowIndex}`).value = 'Amount';
    
    // Định dạng tiêu đề
    ['A', 'B', 'C', 'D', 'E'].forEach(col => {
      const cell = worksheet.getCell(`${col}${rowIndex}`);
      cell.font = { bold: true };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' }
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
      cell.alignment = { horizontal: 'center' };
    });
    
    rowIndex++;

    // Thêm các mục trong hóa đơn
    const items = invoiceModel.getItems();
    items.forEach((item, index) => {
      worksheet.getCell(`A${rowIndex}`).value = index + 1;
      worksheet.getCell(`B${rowIndex}`).value = item.getDescription();
      worksheet.getCell(`C${rowIndex}`).value = Calculator.roundToDecimals(item.getDuration(), 2);
      worksheet.getCell(`D${rowIndex}`).value = item.getRate();
      worksheet.getCell(`E${rowIndex}`).value = Calculator.roundToDecimals(item.getAmount(), 2);
      
      // Định dạng các ô
      ['A', 'B', 'C', 'D', 'E'].forEach(col => {
        const cell = worksheet.getCell(`${col}${rowIndex}`);
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
        
        if (col === 'A') {
          cell.alignment = { horizontal: 'center' };
        } else if (col === 'C' || col === 'D' || col === 'E') {
          cell.alignment = { horizontal: 'right' };
          if (col === 'C') {
            cell.numFmt = '0.00';
          } else {
            cell.numFmt = `#,##0.00 ${invoiceModel.getCurrency()}`;
          }
        }
      });
      
      rowIndex++;
    });

    // Tính tổng
    const subtotalRow = rowIndex + 1;
    worksheet.mergeCells(`A${subtotalRow}:D${subtotalRow}`);
    worksheet.getCell(`A${subtotalRow}`).value = 'Subtotal:';
    worksheet.getCell(`A${subtotalRow}`).alignment = { horizontal: 'right' };
    worksheet.getCell(`A${subtotalRow}`).font = { bold: true };
    
    worksheet.getCell(`E${subtotalRow}`).value = Calculator.roundToDecimals(invoiceModel.getSubtotal(), 2);
    worksheet.getCell(`E${subtotalRow}`).numFmt = `#,##0.00 ${invoiceModel.getCurrency()}`;
    worksheet.getCell(`E${subtotalRow}`).alignment = { horizontal: 'right' };
    
    const taxRow = subtotalRow + 1;
    worksheet.mergeCells(`A${taxRow}:D${taxRow}`);
    worksheet.getCell(`A${taxRow}`).value = `Tax (${invoiceModel.getTaxRate()}%):`;
    worksheet.getCell(`A${taxRow}`).alignment = { horizontal: 'right' };
    worksheet.getCell(`A${taxRow}`).font = { bold: true };
    
    worksheet.getCell(`E${taxRow}`).value = Calculator.roundToDecimals(invoiceModel.getTaxAmount(), 2);
    worksheet.getCell(`E${taxRow}`).numFmt = `#,##0.00 ${invoiceModel.getCurrency()}`;
    worksheet.getCell(`E${taxRow}`).alignment = { horizontal: 'right' };
    
    const totalRow = taxRow + 1;
    worksheet.mergeCells(`A${totalRow}:D${totalRow}`);
    worksheet.getCell(`A${totalRow}`).value = 'Total:';
    worksheet.getCell(`A${totalRow}`).alignment = { horizontal: 'right' };
    worksheet.getCell(`A${totalRow}`).font = { bold: true };
    
    worksheet.getCell(`E${totalRow}`).value = Calculator.roundToDecimals(invoiceModel.getTotal(), 2);
    worksheet.getCell(`E${totalRow}`).numFmt = `#,##0.00 ${invoiceModel.getCurrency()}`;
    worksheet.getCell(`E${totalRow}`).alignment = { horizontal: 'right' };
    worksheet.getCell(`E${totalRow}`).font = { bold: true };
    
    // Thêm ghi chú và điều khoản thanh toán
    if (invoiceModel.getNotes() || invoiceModel.getPaymentTerms()) {
      const notesRow = totalRow + 3;
      
      if (invoiceModel.getNotes()) {
        worksheet.mergeCells(`A${notesRow}:E${notesRow}`);
        worksheet.getCell(`A${notesRow}`).value = 'Notes:';
        worksheet.getCell(`A${notesRow}`).font = { bold: true };
        
        worksheet.mergeCells(`A${notesRow + 1}:E${notesRow + 1}`);
        worksheet.getCell(`A${notesRow + 1}`).value = invoiceModel.getNotes();
      }
      
      if (invoiceModel.getPaymentTerms()) {
        const termsRow = invoiceModel.getNotes() ? notesRow + 3 : notesRow;
        worksheet.mergeCells(`A${termsRow}:E${termsRow}`);
        worksheet.getCell(`A${termsRow}`).value = 'Payment Terms:';
        worksheet.getCell(`A${termsRow}`).font = { bold: true };
        
        worksheet.mergeCells(`A${termsRow + 1}:E${termsRow + 1}`);
        worksheet.getCell(`A${termsRow + 1}`).value = invoiceModel.getPaymentTerms();
      }
    }

    // Lưu file nếu có đường dẫn
    if (outputPath) {
      await workbook.xlsx.writeFile(outputPath);
      return outputPath;
    }

    // Trả về buffer nếu không có đường dẫn
    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  }
}

module.exports = XlsxRenderer;
