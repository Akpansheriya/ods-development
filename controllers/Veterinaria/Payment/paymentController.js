const { Op } = require("sequelize");
const Database = require("../../../config/connection");
const Payment = Database.payment;
const Admin = Database.user;
const jwt = require("jsonwebtoken")
const ExcelJS = require("exceljs");
const registerPayment = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "hello$%#@!ADMIN___++");
    const unique = decoded.unique;
    const payment = {
      payment_no: req.body.payment_no,
      unique:unique,
      transfer_no:
        req.body.transfer_no === "" || !req.body.transfer_no
          ? null
          : req.body.transfer_no,
      owner: req.body.owner === "" || !req.body.owner ? null : req.body.owner,
      doctor:
        req.body.doctor === "" || !req.body.doctor ? null : req.body.doctor,
      service: req.body.service,
      amount: req.body.amount,
      discount: req.body.discount,
      final_amount:req.body.amount - req.body.amount *  req.body.discount / 100,
      payment_method: req.body.payment_method,
      description:
        req.body.description === "" || !req.body.description
          ? null
          : req.body.description,
    };
    if (payment.payment_no === "" || payment.payment_no === null) {
      res.status(400).send({
        message: "payment no is required",
      });
    } else if (payment.service === "" || payment.service === null) {
      res.status(400).send({
        message: "service no is required",
      });
    } else if (payment.amount === "" || payment.amount === null) {
      res.status(400).send({
        message: "amount no is required",
      });
    } else if (payment.discount === "" || payment.discount === null) {
      res.status(400).send({
        message: "discount no is required",
      });
    } else if (
      payment.payment_method === "" ||
      payment.payment_method === null
    ) {
      res.status(400).send({
        message: "payment_method no is required",
      });
    } else {
      Payment.create(payment).then((result) => {
        res.status(201).send({
          message: "user created",
          result: result,
        });
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Error Registering Payment",
      error: error.message,
    });
  }
};
const getSinglePayment = async (req, res) => {
  const id = req.params.id;
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, "hello$%#@!ADMIN___++");
  const unique = decoded.unique;
  const payment = await Payment.findOne({ where: { id: id , unique} });
  res.status(200).send({
    message: "payment",
    payment,
  });
};
const updatePayment = async (req, res) => {
  try {
    const id = req.params.id;
    const paymentexist = await Payment.findOne({ where: { id: id } });
   
    const payment = {
      payment_no: req.body.payment_no,
      transfer_no: req.body.transfer_no,
      owner: req.body.owner,
      doctor: req.body.doctor,
      service: req.body.service,
      amount: req.body.amount,
      discount: req.body.discount,
      final_amount:req.body.final_amount,
      payment_method: req.body.payment_method,
      description: req.body.description,
    };

    if (paymentexist) {
      if (payment.payment_no === "" || payment.payment_no === null) {
        res.status(400).send({
          message: "payment no is required",
        });
      } else if (payment.service === "" || payment.service === null) {
        res.status(400).send({
          message: "service no is required",
        });
      } else if (payment.amount === "" || payment.amount === null) {
        res.status(400).send({
          message: "amount no is required",
        });
      } else if (payment.discount === "" || payment.discount === null) {
        res.status(400).send({
          message: "discount no is required",
        });
      } else if (
        payment.payment_method === "" ||
        payment.payment_method === null
      ) {
        res.status(400).send({
          message: "payment_method no is required",
        });
      } else {
        await Payment.update(payment, { where: { id: id } });
        res.status(200).send({
          message: "payment record updated successfully",
        });
      }
     
    } else {
      res.status(404).send({
        message: "payment record not found",
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Error updating Payment",
      error: error.message,
    });
  }
};
const deletePaymentRecord = async (req, res) => {
  const id = req.params.id;
 
  const payment_record = await Payment.findOne({ where: { id: id } });
  const { pass, email } = req.body;
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, "hello$%#@!ADMIN___++");
  const user = await Admin.findOne({
    where: { email: email },
  });
  if (pass !== user.password) {
    return res.status(400).send({
      message: "password not match",
      success: false,
    });
  }
  if (decoded.role !== user.role) {
    return res.status(400).send({
     message: "Not authorized",
     success: false,
   });
 }
  if (payment_record?.id === id) {
    await Payment.destroy({ where: { id: id } });
    return  res.status(200).send({
      message: "userProfile deleted successfully",
      success: true,
    });
  } else {
    return  res.status(404).send({
      message: "payment record not found",
      success: false,
    });
  }
};
const paymentExcelFile = async (req, res) => {
  try {
    const paymentData = await Payment.findAll({});
    const plainPaymentData = paymentData.map((payment) => {
      const formattedPayment = payment.get({ plain: true });

      // Rename headers
      formattedPayment.COD = formattedPayment.payment_no;
      formattedPayment.Paciente = formattedPayment.owner;
      formattedPayment["Método de Pago"] = formattedPayment.payment_method;
      formattedPayment.Servicio = formattedPayment.service;
      formattedPayment["Fecha de creación"] = formatDate(formattedPayment.createdAt);
      formattedPayment["Monto Final"] = formattedPayment.final_amount;

      // Remove unwanted fields
      const unwantedFields = [
        "createdAt",
        "updatedAt",
        "id",
        "final_amount",
        "veterinarian",
        "service",
        "payment_no",
        "payment_method",
        "discount",
        "description",
        "transfer_no",
        "doctor",
        "amount",
        "owner",
      ];
      unwantedFields.forEach((field) => delete formattedPayment[field]);

      return formattedPayment;
    });

    // Adding rows with data
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("payments");

    // Add merged cells for title and image
    worksheet.mergeCells("A1:B2");
    const titleCell = worksheet.getCell("A1");
    titleCell.value = "Pagos Registrados";
    titleCell.font = { size: 16, bold: true };
    titleCell.alignment = { vertical: "middle", horizontal: "left" };

    worksheet.mergeCells("C1:D2");
    const imageId = workbook.addImage({
      filename: "./public/ods.png",
      extension: "png",
    });
    worksheet.addImage(imageId, {
      tl: { col: 2, row: 0 },
      br: { col: 4, row: 2 },
    });

    // Set border style for blank space
    worksheet.getCell("B1").border = {
      right: { style: "thin", color: { argb: "FFFFFF" } },
    };
    worksheet.getCell("B2").border = {
      right: { style: "thin", color: { argb: "FFFFFF" } },
    };

    // Write headers to the worksheet
    const headers = Object.keys(plainPaymentData[0]);
    worksheet.addRow(headers);

    // Write data to the worksheet
    plainPaymentData.forEach((payment) => {
      const row = [];
      headers.forEach((header) => {
        row.push(payment[header]);
      });
      worksheet.addRow(row);
    });

    // Format header row
    worksheet.getRow(4).eachCell((cell) => {
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "DDDDDD" } };
      cell.font = { size: 11, bold: true };
      cell.alignment = { vertical: "middle", horizontal: "center" };
    });

    // Format data rows
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 3) {
        row.eachCell((cell) => {
          cell.alignment = { vertical: "middle", horizontal: "center" };
        });
      }
    });

    // Set row height
    worksheet.eachRow((row) => {
      row.height = 21.75;
    });

    // Set column widths
    worksheet.getColumn(1).width = 15.41;
    worksheet.getColumn(2).width = 15.41;
    worksheet.getColumn(3).width = 15.41;
    worksheet.getColumn(4).width = 20;
    worksheet.getColumn(5).width = 20;
    worksheet.getColumn(6).width = 20;

    // Prepare the Excel file for download
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=payment.xlsx");

    // Write the workbook data to the response
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Error exporting Excel file:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}/${month}/${day}`;
}
const getAllPayments = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, "hello$%#@!ADMIN___++");
  const unique = decoded.unique;
  const paymentsList = await Payment.findAll({where:{unique}});
  res.status(200).send({
    message: "paymentsList",
    paymentsList,
  });
};
const paymentFilter = async (req, res) => {
  try {
    const startDate = new Date(req.query.startDate);
    const endDate = new Date(req.query.endDate);
    const payment_method = req.query.payment_method ? req.query.payment_method : "";
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "hello$%#@!ADMIN___++");
    const unique = decoded.unique;
    if (req.query.startDate && req.query.endDate && req.query.payment_method) {
      const filteredRecords = await Payment.findAll({
        where: {
          payment_method,
          unique,
          createdAt: {
            [Op.between]: [startDate, endDate],
          },
        },
      });

      res.status(200).json({
        message: "Filtered records by date and payment method",
        paymentList: filteredRecords,
      });
    }else if (req.query.startDate && req.query.endDate && !req.query.payment_method) {
      const filteredRecords = await Payment.findAll({
        where: {
          unique,
          createdAt: {
            [Op.between]: [startDate, endDate],
          },
        },
      });

      res.status(200).json({
        message: "Filtered records by date and payment method",
        paymentList: filteredRecords,
      });
    } else if (req.query.payment_method && !req.query.startDate && !req.query.endDate) {
      const filteredByPaymentMethod = await Payment.findAll({
        where: {
          unique,
          payment_method,
        },
      });

      res.status(200).json({
        message: "Filtered records by payment method",
        paymentList: filteredByPaymentMethod,
      });
    }  else if (!req.query.payment_method && !req.query.startDate && !req.query.endDate){
      const paymentList = await Payment.findAll({ where:{unique},order: [["createdAt", "DESC"]], });
      res.status(200).send({
        message: "All payment records",
        paymentList,
      });
    }
  } catch (error) {
    console.error("Error filtering records:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  registerPayment,
  updatePayment,
  deletePaymentRecord,
  paymentExcelFile,
  getAllPayments,
  paymentFilter,
  getSinglePayment,
};
