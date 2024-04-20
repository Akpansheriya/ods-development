const { Op } = require("sequelize");
const Database = require("../../../config/connection");
const Pet = Database.pet;
const Vaccination = Database.vaccination;
const ExcelJS = require("exceljs");
const Appointment = Database.appointment;
const Admin = Database.user;
const jwt = require("jsonwebtoken")
const QRCode = require("qrcode");
const fs = require("fs");
const path = require("path");
const moment = require("moment");
const petInfo = Database.petInfo;
const PDFDocument = require("pdfkit-table");

const createPet = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "hello$%#@!ADMIN___++");
    const unique = decoded.unique;
    const pet = {
      name: req.body.name,
      owner: req.body.owner,
      unique:unique,
      ownerId: req.body.ownerId,
      sex: req.body.sex,
      dob: req.body.dob ?  new Date(req.body.dob) : null,
      Species:
        req.body.Species === "" || !req.body.Species ? null : req.body.Species,
      breed: req.body.breed === "" || !req.body.breed ? null : req.body.breed,
    
      color: req.body.color === "" || !req.body.color ? null : req.body.color,
    };
    if (pet.dob !== "" && pet.dob !== null) {
      const dobDate = pet.dob ? new Date(pet.dob) : null;
      const currentDate = new Date();

      const ageInMilliseconds = currentDate - dobDate;
      const ageInYears = ageInMilliseconds / (1000 * 60 * 60 * 24 * 365.25);

      const age = Math.floor(ageInYears);
      console.log("age", age);
      pet.age = age;
    }else{
      pet.age = null
    }

    if (pet.name === "" || pet.name === null) {
      res.status(400).send({
        message: "name is required",
      });
    } else if (pet.owner === "" || pet.owner === null) {
      res.status(400).send({
        message: "owner is required",
      });
    } else if (pet.sex === "" || pet.sex === null) {
      res.status(400).send({
        message: "sex is required",
      });
    } else {
      Pet.create(pet).then((result) => {
        res.status(201).send({
          message: "pet created",
          result: result,
        });
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Error Registering pet",
      error: error.message,
    });
  }
};

const updatePet = async (req, res) => {
  try {
    const id = req.params.id;
    const petExist = await Pet.findOne({ where: { id: id } });

    const pet = {
      name: req.body.name,
      owner: req.body.owner,
      ownerId: req.body.ownerId,
      sex: req.body.sex,
      dob: new Date(req.body.dob),
      Species: req.body.Species,
      breed: req.body.breed,
     
      color: req.body.color,
    };
    if (petExist.dob !== "" && petExist.dob !== null || req.body.dob !== "" && req.body.dob === null) {
      const dobDate = petExist.dob ? new Date(petExist.dob) : null;
      const currentDate = new Date();

      const ageInMilliseconds = currentDate - dobDate;
      const ageInYears = ageInMilliseconds / (1000 * 60 * 60 * 24 * 365.25);

      const age = Math.floor(ageInYears);
      console.log("age", age);
      pet.age = age;
    }else{
      pet.age = null
    }
    if (petExist) {
      if (pet.name === "" || pet.name === null) {
        res.status(400).send({
          message: "name is required",
        });
      } else if (pet.owner === "" || pet.owner === null) {
        res.status(400).send({
          message: "owner is required",
        });
      } else if (pet.sex === "" || pet.sex === null) {
        res.status(400).send({
          message: "sex is required",
        });
      }else {
        await Pet.update(pet, { where: { id: id } });
        res.status(200).send({
          message: "pet record updated successfully",
        });
      }
     
    } else {
      res.status(404).send({
        message: "pet record not found",
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Error updating pet",
      error: error.message,
    });
  }
};
const deletePetRecord = async (req, res) => {
  const id = req.params.id;
  const pet_record = await Pet.findOne({ where: { id: id } });
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
  if (pet_record?.id === id) {
    await Pet.destroy({ where: { id: id } });
    await Appointment.destroy({where:{petId :id}})
    await Vaccination.destroy({where:{petId :id}})
    return res.status(200).send({
      message: "pet deleted successfully",
      success: true,
    });
  } else {
    return res.status(404).send({
      message: "pet record not found",
      success: false,
    });
  }
};
const petExcelFile = async (req, res) => {
  try {
    const petData = await Pet.findAll({
      include: [
        {
          model: Appointment,
          as: "petAppointmentData",
        },
      ],
    });
    
    const plainPetData = petData.map((pet) => {
      const formattedPet = pet.get({ plain: true });

      // Rename headers
      formattedPet.COD = formattedPet.id;
      formattedPet.Mascota = formattedPet.name;
      formattedPet.Propietario = formattedPet.owner;
      formattedPet.Especie = formattedPet.Species;
      formattedPet.Sexo = formattedPet.sex;
      formattedPet.Edad = formattedPet.age;

      // Calculate average rating
      const ratings = formattedPet.petAppointmentData.map(appointment => appointment.rating);
      const averageRating = ratings.reduce((acc, rating) => acc + rating, 0) / ratings.length;
      formattedPet.Calificación = isNaN(averageRating) ? '' : averageRating.toFixed(2);

      

      // Remove unwanted fields
      const unwantedFields = [
        "createdAt",
        "updatedAt",
        "id",
        "ownerId",
        "name",
        "owner",
        "sex",
        "dob",
        "age",
        "Species",
        "breed",
        "color",
        "hair",
        "status",
        "exploration",
        "petAppointmentData"
      ];
      unwantedFields.forEach((field) => delete formattedPet[field]);

      return formattedPet;
    });

    // Create workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("pets");

    // Add merged cells for title and image
    worksheet.mergeCells("A1:B2");
    const titleCell = worksheet.getCell("A1");
    titleCell.value = "Lista De Mascotas";
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
    const headers = Object.keys(plainPetData[0]);
    worksheet.addRow(headers);

    // Write data to the worksheet
    plainPetData.forEach((pet) => {
      const row = [];
      headers.forEach((header) => {
        row.push(pet[header]);
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
    worksheet.getColumn(7).width = 28;
    worksheet.getColumn(8).width = 20;


    // Prepare the Excel file for download
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=pet.xlsx");

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
const getAllPets = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "hello$%#@!ADMIN___++");
    const unique = decoded.unique;
    const petsList = await Pet.findAll({ where:{unique},
      attributes: ['id', 'name', 'owner', 'age', 'dob', 'sex', 'age', 'Species', 'breed', 'color', 'exploration', 'status'],
      include: [
        {
          model: Appointment,
          as: 'petAppointmentData',
          attributes: ['rating'],
        },
      ],
    });

    const PetsList = petsList.map((pet) => {
      const pets = {
        id: pet.id,
        name: pet.name,
        owner: pet.owner,
        sex: pet.sex,
        dob: pet.dob,
        age: pet.age,
        species: pet.Species,
        breed: pet.breed,
        
        color: pet.color,
        status: pet.status,
        exploration: pet.exploration
      };
    
      const ratings = pet.petAppointmentData.map((appointment) => appointment.rating);
      const sumOfRatings = ratings.reduce((total, rating) => total + rating, 0);
      const averageRating = sumOfRatings / ratings.length;
      
    
      return { ...pets, rating: averageRating.toFixed(1) };
    });
    
    res.status(200).send({
      message: 'petsList',
      PetsList,
    });
  } catch (error) {
    console.error("Error fetching pets:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const getSinglePet = async (req, res) => {
  try {
    const id = req.params.id;
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "hello$%#@!ADMIN___++");
    const unique = decoded.unique;
    const pets = await Pet.findByPk(id, {
      where:{unique},
      include: [
        {
          model: Appointment,
          as: "petAppointmentData",
        },
      ],
    });

    if (!pets) {
      return res.status(404).send({ message: "pets not found" });
    }

    // Calculate total appointment count
    const totalAppointments = pets.petAppointmentData.length;

    // Calculate pending appointment count
    const completeAppointments = pets.petAppointmentData.filter(
      (appointment) => appointment.status === "complete"
    ).length;

    // Find the last appointment date and time
    let lastAppointment = null;
    if (pets.petAppointmentData.length > 0) {
      pets.petAppointmentData.sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
      });
      lastAppointment = {
        date: pets.petAppointmentData[0].date,
      };
    }
    const pet = {
      id: pets.id,
      name: pets.name,
      ownerId: pets.ownerId,
      owner: pets.owner,
      sex: pets.sex,
      dob: pets.dob,
      age: pets.age,
      hair:pets.hair,
      Species: pets.Species,
      breed: pets.breed,
      color: pets.color,
      status: pets.status,
      exploration: pets.exploration,
      createdAt: pets.createdAt,
      rating: pets?.petAppointmentData[0]?.rating,
    };
    res.status(200).send({
      message: "pets",
      pet,
      lastAppointment,
      totalAppointments,
      completeAppointments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};
const petFilter = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "hello$%#@!ADMIN___++");
    const unique = decoded.unique;
    const startDate = new Date(req.query.startDate);
    const endDate = new Date(req.query.endDate);
    console.log("startDate", startDate, "endDate", endDate);
    if (req.query.startDate && req.query.endDate) {
      const filteredRecords = await Pet.findAll({where:{unique},
        attributes: ['id', 'name', 'owner','age','dob','sex','age','Species','breed','color','exploration','status'],
        include: [
          {
            model: Appointment,
            as: 'petAppointmentData',
            attributes: ['rating'],
          },
        ],
      
        where: {
          [Op.or]: [
            {
              createdAt: {
                [Op.gte]: startDate,
                [Op.lte]: endDate,
              },
            },
            {
              createdAt: startDate,
            },
            {
              createdAt: endDate,
            },
          ],
        },
      });
      const PetsList = filteredRecords.map((pet) => {
        const pets = {
          id: pet.id,
          name: pet.name,
          owner: pet.owner,
          sex: pet.sex,
          dob: pet.dob,
          age: pet.age,
          species: pet.Species,
          breed: pet.breed,
         
          color: pet.color,
          status: pet.status,
          exploration: pet.exploration
        };
      
        const ratings = pet.petAppointmentData.map((appointment) => appointment.rating);
        const sumOfRatings = ratings.reduce((total, rating) => total + rating, 0);
        const averageRating = sumOfRatings / ratings.length;
        
      
        return { ...pets, rating: averageRating.toFixed(1) };
      });
      
      res.status(200).json({
        message: "Filtered records",
        petsList: PetsList,
      });
    } else {
      const petList = await Pet.findAll({where:{unique}, attributes: ['id', 'name', 'owner','age','dob','sex','age','Species','breed','color','exploration','status'],
      include: [
        {
          model: Appointment,
          as: 'petAppointmentData',
          attributes: ['rating'],
        },
      ], order: [["createdAt", "DESC"]], });
      const petsList = petList.map((pet) => {
        const pets = {
          id: pet.id,
          name: pet.name,
          owner: pet.owner,
          sex: pet.sex,
          dob: pet.dob,
          age: pet.age,
          species: pet.Species,
          breed: pet.breed,
        
          color: pet.color,
          status: pet.status,
          exploration: pet.exploration
        };
      
        const ratings = pet.petAppointmentData.map((appointment) => appointment.rating);
        const sumOfRatings = ratings.reduce((total, rating) => total + rating, 0);
        const averageRating = sumOfRatings / ratings.length;
        
      
        return { ...pets, rating:averageRating ? averageRating.toFixed(1) : null };
      });
      res.status(200).send({
        message: "petList",
        petsList,
      });
    }
  } catch (error) {
    console.error("Error filtering records:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const appointmentDataOfPet = async (req, res) => {
  const id = req.params.id;
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, "hello$%#@!ADMIN___++");
  const unique = decoded.unique;
  const startDate = new Date(req.query.startDate);
    const endDate = new Date(req.query.endDate);
    const status = req.query.status;
    if (req.query.startDate && req.query.endDate && req.query.status){
      const pets = await Pet.findOne({
        where:{unique},
        include: [
          {
            model: Appointment,
            as: "petAppointmentData",
            where: {
              [Op.and]: [
                {
                  createdAt: {
                    [Op.gte]: startDate, 
                    [Op.lte]: endDate,   
                  },
                },
                { status }, 
              ],
            },
          },
        ],
        where: { id: id }, 
      });
      const pet = pets?.name;
      const appointments = pets?.petAppointmentData ?  pets?.petAppointmentData : [];
      res.status(200).send({
        message: "appointmentList",
    
        pet: pet,
        appointments: appointments,
      });
      
    }else if (req.query.startDate && req.query.endDate && !req.query.status) {
      const pets = await Pet.findOne({
       
        include: [
          {
            model: Appointment,
            as: "petAppointmentData",
            where: {
              [Op.and]: [
                {
                  createdAt: {
                    [Op.gte]: startDate, 
                    [Op.lte]: endDate,   
                  },
                }
                
              ],
            },
          },
        ],
        where: { id: id ,unique}, 
      });
      const pet = pets?.name;
      const appointments = pets?.petAppointmentData ?  pets?.petAppointmentData : [];
      res.status(200).send({
        message: "appointmentList",
    
        pet: pet,
        appointments: appointments,
      });
    }else if (req.query.status && !req.query.endDate && !req.query.startDate) {
      const pets = await Pet.findOne({
        include: [
          {
            model: Appointment,
            as: "petAppointmentData",
            where: {
             status
            },
          },
        ],
        where: { id: id ,unique}, 
      });
      const pet = pets?.name;
      const appointments = pets?.petAppointmentData ?  pets?.petAppointmentData : [];
      res.status(200).send({
        message: "appointmentList",
    
        pet: pet,
        appointments: appointments,
      });
    }else if (!req.query.status && !req.query.endDate && !req.query.startDate){
      const pets = await Pet.findOne({
        include: [
          {
            model: Appointment,
            as: "petAppointmentData",
          },
        ],
        where: { id: id ,unique},
      });
      const pet = pets?.name;
      const appointments = pets?.petAppointmentData ?  pets?.petAppointmentData : [];
      res.status(200).send({
        message: "appointmentList",
    
        pet: pet,
        appointments: appointments,
      });
    }
 
};



const generatePdfAndQrCode = async (pet, vaccinations, petInfos, req) => {
  const qrCodeData = req.protocol + "://" + req.get("host") + `/profile/pets/pdfs/pet_summary_${pet.id}.pdf`;
  const qrCodeBuffer = await QRCode.toBuffer(qrCodeData);
  const qrCodeImagePath = path.join(
    __dirname,"../../../public/pets/images",`qr_code_${pet.id}.png`);
  await fs.promises.writeFile(qrCodeImagePath, qrCodeBuffer);


  let doc = new PDFDocument({ margin: 30, size: "A4" });

  const petTable = {
    title: "Pet Information",
    padding: 5,
    width: 450,
    headers: ["", ""],
    rows: [
      ["Owner", pet.owner],
      ["Sex", pet.sex],
      ["Dob", moment(pet.dob).format("LL")],
      ["Age", pet.age],
      ["Species", pet.Species],
      ["Breed", pet.breed],
      ["Hair", pet.hair],
      ["Color", pet.color],
      ["Status", pet.status ? pet.status : "-"],
      ["Exploration", pet.exploration ? pet.exploration : "-"],
    ],
  };
  
  const formattedVaccinationData = vaccinations.map((vaccine) => [
    vaccine.owner || '-',
    vaccine.pet || '-',
    vaccine.vaccine || '-',
    vaccine.exploration || '-',
    vaccine.F_vaccination ? moment(vaccine.F_vaccination).format('LL') : '-',
    vaccine.validity ? moment(vaccine.validity).format('LL') : '-',
    vaccine.status || '-'
  ]);

  const vaccinationTable = {
    title: "Vaccination Information",
    padding: 5,
    headers: [
      "Owner",
      "Pet",
      "Vaccine",
      "Exploration",
      "F_vaccination",
      "Validity",
      "Status",
    ],
    rows: formattedVaccinationData
  };

  const pageWidth = doc.page.width;
  const tableWidth = 450; 
  const tableX = (pageWidth - tableWidth) / 2;

  doc.fontSize(22)
    .text(petTable.title, { align: "center" })
    .moveDown(1);
  doc.lineWidth(0);
  doc.table(
    {
      headers: petTable.headers,
      rows: petTable.rows,
      prepareHeader: () => doc.font("Helvetica-Bold").fontSize(17),
      prepareRow: () => doc.font("Helvetica").fontSize(18),
      divider: { horizontal: { width: 0.1, opacity: 0 }, vertical: { width: 0, opacity: 0 } },
    },
    {
      width: tableWidth,
      x: tableX,
      y: 100, 
    }
  );

  doc.addPage();
  doc.fontSize(22)
    .text(vaccinationTable.title, { align: "center" })
    .moveDown(1);
  doc.table(
    {
      headers: vaccinationTable.headers,
      rows: vaccinationTable.rows,
      prepareHeader: () => doc.font("Helvetica-Bold").fontSize(22),
      prepareRow: (row, i) => doc.font("Helvetica").fontSize(22),
    },
    {
      drawHeaderRow: () => true,
    }
  );

  const pdfPath = path.join( __dirname,"../../../public/pets/pdfs",`pet_summary_${pet.id}.pdf`);
  const imagePath = path.join(__dirname,"../../../public/pets/images",`pet_summary_${pet.id}.png`);

  const fileStream = fs.createWriteStream(pdfPath);
  doc.pipe(fileStream);
  doc.end();

  if (petInfos?.petId === pet.id) {
    await petInfo.update(
      {
        qrImage: req.protocol + "://" + req.get("host") + `/qr_code_${pet.id}.png`,
        pdf: req.protocol + "://" + req.get("host") + `/pet_summary_${pet.id}.pdf`,
      },
      { where: { petId: pet.id } }
    );
  } else {
    await petInfo.create({
      petId: pet.id,
      qrImage: req.protocol + "://" + req.get("host") + `/qr_code_${pet.id}.png`,
      pdf: req.protocol + "://" + req.get("host") + `/pet_summary_${pet.id}.pdf`,
    });
  }
};

const petSummaryPdf = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "hello$%#@!ADMIN___++");
    const unique = decoded.unique;
    const petId = req.params.id;
    const pet = await Pet.findOne({ where: { id: petId , unique} });
    const vaccinations = await Vaccination.findAll({ where: { petId: petId } });

    if (!pet || !vaccinations) {
      return res.status(404).send("Pet or vaccinations not found");
    }

    const petInfos = await petInfo.findOne({ where: { petId } });

    if (petInfos) {
      const pdfName = path.basename(petInfos.pdf);
      const qrCodeName = path.basename(petInfos.qrImage);

      const oldPdfPath = path.join(__dirname,"../../../public/pets/pdfs",pdfName);
      const oldImagePath = path.join( __dirname,"../../../public/pets/images",qrCodeName);

      if (fs.existsSync(oldPdfPath)) {
        await fs.promises.unlink(oldPdfPath);
      }
      if (fs.existsSync(oldImagePath)) {
        await fs.promises.unlink(oldImagePath);
      }
    }

    await generatePdfAndQrCode(pet, vaccinations, petInfos, req);

    res.status(200).send(`QR code and PDF regenerated successfully`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};






module.exports = {
  createPet,
  updatePet,
  deletePetRecord,
  petExcelFile,
  getAllPets,
  petFilter,
  appointmentDataOfPet,
  petSummaryPdf,
  getSinglePet,
};
