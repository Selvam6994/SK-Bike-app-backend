import express from "express";
import CROS from "cors";
import { MongoClient } from "mongodb";
import bcrypt from "bcrypt";
import * as dotenv from "dotenv";
import { serviceHistory } from "./Customer/serviceHistory.js";
import { generalEnquires } from "./Customer/generalEnquires.js";
import { serviceBooking } from "./Customer/serviceBooking.js";
import { customerLogIn } from "./Customer/customerLogIn.js";
import { newPinCode } from "./Customer/newPinCode.js";
import { signUpOtp } from "./Customer/signUpOtp.js";
import { customerSignup } from "./Customer/customerSignup.js";
import { convertedEnquries } from "./Admin api/convertedEnquries.js";
import { cancelledEnquries } from "./Admin api/cancelledEnquries.js";
import { contactedEnquries } from "./Admin api/contactedEnquries.js";
import { newEnquries } from "./Admin api/newEnquries.js";
import { totalEnquries } from "./Admin api/totalEnquries.js";
import { serviceTaken } from "./Admin api/serviceTaken.js";
import { newServiceRequests } from "./Admin api/newServiceRequests.js";
import { updateEnquiryToCancelled } from "./Admin api/updateEnquiryToCancelled.js";
import { updateEnquiryToConverted } from "./Admin api/updateEnquiryToConverted.js";
import { updateEnquiryToContacted } from "./Admin api/updateEnquiryToContacted.js";
import { deleteServiceList } from "./Admin api/deleteServiceList.js";
import { getServiceList } from "./Admin api/getServiceList.js";
import { postServiceList } from "./Admin api/postServiceList.js";
import { getUserData } from "./Admin api/getUserData.js";
import { getFeedbackList } from "./Admin api/getFeedbackList.js";
import { deleteCancelledQuiryData } from "./Admin api/deleteCancelledQuiryData.js";
import { loggedinAdminData } from "./Admin api/loggedinAdminData.js";
import { adminPasscode } from "./Admin api/adminPasscode.js";
import { adminOtpVerification } from "./Admin api/adminOtpVerification.js";
import { adminSignup } from "./Admin api/adminSignup.js";
import { adminLogin } from "./Admin api/adminLogin.js";
import { loggedinTechnicianData } from "./Technician api/loggedinTechnicianData.js";
import { technicianNewPasscode } from "./Technician api/technicianNewPasscode.js";
import { technicianOtpVerification } from "./Technician api/technicianOtpVerification.js";
import { technicianSignup } from "./Technician api/technicianSignup.js";
import { technicianLogin } from "./Technician api/technicianLogin.js";
import { adminAuth } from "./Admin api/AdminAuth/adminAuth.js";
// import easyinvoice from "easyinvoice";
import fs from "fs";
import nodemailer from "nodemailer";
dotenv.config();
export const app = express();
app.use(express.json());
app.use(CROS());
app.use(express.static("Invoice"));

export const PORT = process.env.PORT;

const MongoURL = process.env.MONGO_URL;
export const client = new MongoClient(MongoURL);
export let secretKey = process.env.SECRET_KEY;
await client.connect();

export async function generateHashedPassword(pin) {
  const NO_OF_ROUNDS = 10;
  const salt = await bcrypt.genSalt(NO_OF_ROUNDS);
  let newPin = pin.toString();
  const hashedPassword = await bcrypt.hash(newPin, salt);

  return hashedPassword;
}

// New Customer Sign Up
customerSignup();

// Email id Verification
signUpOtp();

// Set New Password
newPinCode();

// Login
customerLogIn();

// Service booking

serviceBooking();

generalEnquires();

serviceHistory();

// admin user apis
// service status
// get new service bookings
newServiceRequests();

// get bike data taken for service
serviceTaken();

// total service api
// delivered vehicles

// get total enquiry data
totalEnquries();

// get new enquiry data
newEnquries();

// get contacted enquiry data
contactedEnquries();

// get cancelled enquiry data
cancelledEnquries();

// get converted enquiry data
convertedEnquries();

// update enquiry status to contacted
updateEnquiryToContacted();

// update enquiry status to converted
updateEnquiryToConverted();

// update enquiry status to cancelled
updateEnquiryToCancelled();

// Post the service lists from admin
postServiceList();

// get data for service list
getServiceList();

// delete service list data
deleteServiceList();

// get reqistered user data
getUserData();

// get feedback from user
getFeedbackList();

// Delete the cancelled enquiry
deleteCancelledQuiryData();

// admin login
adminLogin();

// admin sign up
adminSignup();

// admin otp verification
adminOtpVerification();

// admin set new pin
adminPasscode();

// get logged in admin data on dashboard
loggedinAdminData();

// ------------------ apis for technicians portal---------------------//
// technicians login
technicianLogin();

// technicians sign up
technicianSignup();

// technicians otp verification
technicianOtpVerification();

// technicians set new pin
technicianNewPasscode();

// get logged in technicians data on dashboard
loggedinTechnicianData();

// update service Status "new" to "estimating cost"
app.put("/costEstimation", async function (request, response) {
  const {
    name,
    email,
    phone,
    service,
    bikeBrand,
    model,
    bikeNumber,
    kms,
    date,
    status,
  } = await request.body;
  const newRequest = await client
    .db("BikeServiceApp")
    .collection("Booking Collection")
    .find({
      name: name,
      email: email,
      phone: phone,
      service: service,
      bikeBrand: bikeBrand,
      model: model,
      bikeNumber: bikeNumber,
      kms: kms,
      date: date,
      status: status,
    })
    .toArray();

  if (newRequest) {
    const {
      name,
      email,
      phone,
      service,
      bikeBrand,
      model,
      bikeNumber,
      kms,
      date,
    } = await request.body;
    const contactedData = await client
      .db("BikeServiceApp")
      .collection("Booking Collection")
      .updateOne(
        {
          name: name,
          email: email,
          phone: phone,
          service: service,
          bikeBrand: bikeBrand,
          model: model,
          bikeNumber: bikeNumber,
          kms: kms,
          date: date,
        },
        { $set: { status: "estimating cost" } }
      );
    response.status(200).send(contactedData);
  } else {
    response.status(400).send("not added");
  }
});

// get request waiting for cost validation/estimation
app.get("/costEstimationList", async function (request, response) {
  const getCostValidationList = await client
    .db("BikeServiceApp")
    .collection("Booking Collection")
    .find({ status: "estimating cost" })
    .toArray();
  response.status(200).send(getCostValidationList);
});

// update data and add cost for service
app.put("/addCost", async function (request, response) {
  const {
    name,
    email,
    phone,
    service,
    bikeBrand,
    model,
    bikeNumber,
    kms,
    date,
    status,
  } = await request.body;

  const findData = await client
    .db("BikeServiceApp")
    .collection("Booking Collection")
    .findOne({
      name: name,
      email: email,
      phone: phone,
      service: service,
      bikeBrand: bikeBrand,
      model: model,
      bikeNumber: bikeNumber,
      kms: kms,
      date: date,
      status: status,
    });
  if (findData) {
    const {
      name,
      email,
      phone,
      service,
      bikeBrand,
      model,
      bikeNumber,
      kms,
      date,
      status,
      cost,
    } = await request.body;
    const addCost = await client
      .db("BikeServiceApp")
      .collection("Booking Collection")
      .updateOne(
        {
          name: name,
          email: email,
          phone: phone,
          service: service,
          bikeBrand: bikeBrand,
          model: model,
          bikeNumber: bikeNumber,
          kms: kms,
          date: date,
        },
        { $set: { status: "customer approval", cost: cost } }
      );
    response.status(200).send({ message: "cost updated" });
  } else {
    response.status(400).send({ message: "error" });
  }
});

// customer validation list
app.get("/customerApproval", async function (request, response) {
  const getdata = await client
    .db("BikeServiceApp")
    .collection("Booking Collection")
    .find({ status: "customer approval" })
    .toArray();
  if (getdata) {
    response.status(200).send(getdata);
  } else {
    response.status(400).send({ message: "no data" });
  }
});

// customer approval list
app.post("/approvedRequest", async function (request, response) {
  const {
    name,
    email,
    phone,
    service,
    bikeBrand,
    model,
    bikeNumber,
    kms,
    date,
    status,
    cost,
  } = await request.body;
  const findData = await client
    .db("BikeServiceApp")
    .collection("Booking Collection")
    .findOne({
      name: name,
      email: email,
      phone: phone,
      service: service,
      bikeBrand: bikeBrand,
      model: model,
      bikeNumber: bikeNumber,
      kms: kms,
      date: date,
      status: status,
      cost: cost,
    });
  if (findData) {
    const approvedRequest = await client
      .db("BikeServiceApp")
      .collection("Shop Floor")
      .insertOne({
        name: name,
        email: email,
        phone: phone,
        service: service,
        bikeBrand: bikeBrand,
        model: model,
        bikeNumber: bikeNumber,
        kms: kms,
        date: date,
        status: "new",
        cost: cost,
      });
    if (approvedRequest) {
      const removeData = await client
        .db("BikeServiceApp")
        .collection("Booking Collection")
        .deleteOne(findData);
      response.status(200).send({ message: "moved to shop floor" });
    } else {
      response.status(400).send({ message: "error" });
    }
  } else {
    response.status(400).send({ message: "no data" });
  }
});

// pending status
app.put("/pendingStatus", async function (request, response) {
  const {
    name,
    email,
    phone,
    service,
    bikeBrand,
    model,
    bikeNumber,
    kms,
    date,
    status,
    cost,
  } = await request.body;
  const newRequest = await client
    .db("BikeServiceApp")
    .collection("Booking Collection")
    .find({
      name: name,
      email: email,
      phone: phone,
      service: service,
      bikeBrand: bikeBrand,
      model: model,
      bikeNumber: bikeNumber,
      kms: kms,
      date: date,
      status: status,
      cost: cost,
    })
    .toArray();

  if (newRequest) {
    const {
      name,
      email,
      phone,
      service,
      bikeBrand,
      model,
      bikeNumber,
      kms,
      date,
      cost,
    } = await request.body;
    const contactedData = await client
      .db("BikeServiceApp")
      .collection("Booking Collection")
      .updateOne(
        {
          name: name,
          email: email,
          phone: phone,
          service: service,
          bikeBrand: bikeBrand,
          model: model,
          bikeNumber: bikeNumber,
          kms: kms,
          date: date,
        },
        { $set: { status: "pending" } }
      );
    response.status(200).send(contactedData);
  } else {
    response.status(400).send("not added");
  }
});

// get pending data
app.get("/getPendingList", async function (request, response) {
  const getdata = await client
    .db("BikeServiceApp")
    .collection("Booking Collection")
    .find({ status: "pending" })
    .toArray();
  if (getdata) {
    response.status(200).send(getdata);
  } else {
    response.status(400).send({ message: "no data" });
  }
});

// delete pendingData
app.delete("/deletePendingData", async function (request, response) {
  const {
    name,
    email,
    phone,
    service,
    bikeBrand,
    model,
    bikeNumber,
    kms,
    date,
    status,
    cost,
  } = await request.body;
  const findData = await client
    .db("BikeServiceApp")
    .collection("Booking Collection")
    .findOne({
      name: name,
      email: email,
      phone: phone,
      service: service,
      bikeBrand: bikeBrand,
      model: model,
      bikeNumber: bikeNumber,
      kms: kms,
      date: date,
      status: status,
      cost: cost,
    });
  if (findData) {
    const deleteData = await client
      .db("BikeServiceApp")
      .collection("Booking Collection")
      .deleteOne({
        name: name,
        email: email,
        phone: phone,
        service: service,
        bikeBrand: bikeBrand,
        model: model,
        bikeNumber: bikeNumber,
        kms: kms,
        date: date,
        status: status,
        cost: cost,
      });
    response.status(200).send(deleteData);
  } else {
    response.status(400).send({ message: "no data available" });
  }
});

// Shop floor apis
// get shop floor service queue
app.get("/getServiceQueue", async function (request, response) {
  const getdata = await client
    .db("BikeServiceApp")
    .collection("Shop Floor")
    .find({ status: "new" })
    .toArray();
  if (getdata) {
    response.status(200).send(getdata);
  } else {
    response.status(400).send({ message: "no data" });
  }
});

// move to service from shop floor
app.put("/moveToService", async function (request, response) {
  const { service, bikeBrand, model, bikeNumber, kms, date, status } =
    await request.body;
  const newRequest = await client
    .db("BikeServiceApp")
    .collection("Shop Floor")
    .find({
      service: service,
      bikeBrand: bikeBrand,
      model: model,
      bikeNumber: bikeNumber,
      kms: kms,
      date: date,
      status: status,
    })
    .toArray();

  if (newRequest) {
    const { service, bikeBrand, model, bikeNumber, kms, date } =
      await request.body;
    const contactedData = await client
      .db("BikeServiceApp")
      .collection("Shop Floor")
      .updateOne(
        {
          service: service,
          bikeBrand: bikeBrand,
          model: model,
          bikeNumber: bikeNumber,
          kms: kms,
          date: date,
        },
        { $set: { status: "Service in process" } }
      );
    response.status(200).send(contactedData);
  } else {
    response.status(400).send("not added");
  }
});

// get service process data
app.get("/getServiceProcess", async function (request, response) {
  const getdata = await client
    .db("BikeServiceApp")
    .collection("Shop Floor")
    .find({ status: "Service in process" })
    .toArray();
  if (getdata) {
    response.status(200).send(getdata);
  } else {
    response.status(400).send({ message: "no data" });
  }
});

// move to Q/C process
app.put("/moveToQc", async function (request, response) {
  const { service, bikeBrand, model, bikeNumber, kms, date, status } =
    await request.body;
  const newRequest = await client
    .db("BikeServiceApp")
    .collection("Shop Floor")
    .find({
      service: service,
      bikeBrand: bikeBrand,
      model: model,
      bikeNumber: bikeNumber,
      kms: kms,
      date: date,
      status: status,
    })
    .toArray();

  if (newRequest) {
    const { service, bikeBrand, model, bikeNumber, kms, date } =
      await request.body;
    const contactedData = await client
      .db("BikeServiceApp")
      .collection("Shop Floor")
      .updateOne(
        {
          service: service,
          bikeBrand: bikeBrand,
          model: model,
          bikeNumber: bikeNumber,
          kms: kms,
          date: date,
        },
        { $set: { status: "Q/C in process" } }
      );
    response.status(200).send(contactedData);
  } else {
    response.status(400).send("not added");
  }
});

// get Q/C process data
app.get("/getQcProcess", async function (request, response) {
  const getdata = await client
    .db("BikeServiceApp")
    .collection("Shop Floor")
    .find({ status: "Q/C in process" })
    .toArray();
  if (getdata) {
    response.status(200).send(getdata);
  } else {
    response.status(400).send({ message: "no data" });
  }
});

// move to water wash
app.put("/moveToWash", async function (request, response) {
  const { service, bikeBrand, model, bikeNumber, kms, date, status } =
    await request.body;
  const newRequest = await client
    .db("BikeServiceApp")
    .collection("Shop Floor")
    .find({
      service: service,
      bikeBrand: bikeBrand,
      model: model,
      bikeNumber: bikeNumber,
      kms: kms,
      date: date,
      status: status,
    })
    .toArray();

  if (newRequest) {
    const { service, bikeBrand, model, bikeNumber, kms, date } =
      await request.body;
    const contactedData = await client
      .db("BikeServiceApp")
      .collection("Shop Floor")
      .updateOne(
        {
          service: service,
          bikeBrand: bikeBrand,
          model: model,
          bikeNumber: bikeNumber,
          kms: kms,
          date: date,
        },
        { $set: { status: "Vehicle Cleaning" } }
      );
    response.status(200).send(contactedData);
  } else {
    response.status(400).send("not added");
  }
});

// get water wash process data
app.get("/getWashingProcess", async function (request, response) {
  const getdata = await client
    .db("BikeServiceApp")
    .collection("Shop Floor")
    .find({ status: "Vehicle Cleaning" })
    .toArray();
  if (getdata) {
    response.status(200).send(getdata);
  } else {
    response.status(400).send({ message: "no data" });
  }
});

// move for billing section
app.post("/billing", async function (request, response) {
  const {
    name,
    email,
    phone,
    service,
    bikeBrand,
    model,
    bikeNumber,
    kms,
    date,
    status,
    cost,
  } = await request.body;
  const findData = await client
    .db("BikeServiceApp")
    .collection("Shop Floor")
    .findOne({
      name: name,
      email: email,
      phone: phone,
      service: service,
      bikeBrand: bikeBrand,
      model: model,
      bikeNumber: bikeNumber,
      kms: kms,
      date: date,
      status: status,
      cost: cost,
    });
  if (findData) {
    const approvedRequest = await client
      .db("BikeServiceApp")
      .collection("Billing")
      .insertOne({
        name: name,
        email: email,
        phone: phone,
        service: service,
        bikeBrand: bikeBrand,
        model: model,
        bikeNumber: bikeNumber,
        kms: kms,
        date: date,
        status: "Ready for delivery",
        cost: cost,
      });
    if (approvedRequest) {
      const removeData = await client
        .db("BikeServiceApp")
        .collection("Shop Floor")
        .deleteOne(findData);
      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "selvamdev6994@gmail.com",
          pass: "bjll mjgs find hnnj",
        },
      });

      let info = {
        from: "selvamdev6994@gmail.com",
        to: email,
        subject: "Welcome to SK Bike Care",
        html: `<!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Document</title>
          </head>
          <body>
              <div style="margin:0 auto;max-width:600px;">
              <h1>Your vehicle is ready for delivery</h1>
                  <p>${service}
             for your ${bikeBrand} ${model} has been Done successfully</p>
             <p>The bill amount is Rs.${cost}/-</p>
              </div>
              <p>Thanks<br>
             SK BIKE CARE<br>
             +91 8111033297<br>
             contact@skcare.com</p>
            
          </body>
          </html>`,
      };
      transporter.sendMail(info, (err) => {
        if (err) {
          console.log("error", err);
        } else {
          console.log("email sent successfully");
          response.status(201).send({ message: "email sent successfully" });
        }
      });

      response.status(200).send({ message: "moved to Billing section" });
    } else {
      response.status(400).send({ message: "error" });
    }
  } else {
    response.status(400).send({ message: "no data" });
  }
});

// get billing process data
app.get("/getBillingData", async function (request, response) {
  const getdata = await client
    .db("BikeServiceApp")
    .collection("Billing")
    .find({ status: "Ready for delivery" })
    .toArray();
  if (getdata) {
    response.status(200).send(getdata);
  } else {
    response.status(400).send({ message: "no data" });
  }
});

// update delivery
app.post("/delivery", async function (request, response) {
  const {
    name,
    email,
    phone,
    service,
    bikeBrand,
    model,
    bikeNumber,
    kms,
    date,
    status,
    cost,
  } = await request.body;
  const findData = await client
    .db("BikeServiceApp")
    .collection("Billing")
    .findOne({
      name: name,
      email: email,
      phone: phone,
      service: service,
      bikeBrand: bikeBrand,
      model: model,
      bikeNumber: bikeNumber,
      kms: kms,
      date: date,
      status: status,
      cost: cost,
    });
  if (findData) {
    const approvedRequest = await client
      .db("BikeServiceApp")
      .collection("Delivered")
      .insertOne({
        name: name,
        email: email,
        phone: phone,
        service: service,
        bikeBrand: bikeBrand,
        model: model,
        bikeNumber: bikeNumber,
        kms: kms,
        date: date,
        status: "delivered",
        cost: cost,
        deliveryDate: `${getDate()}`,
        invoice: `http://localhost:4000/${bikeNumber}.pdf`,
      });
    if (approvedRequest) {
      const removeData = await client
        .db("BikeServiceApp")
        .collection("Billing")
        .deleteOne(findData);
      response.status(200).send({ message: "delivered" });
    } else {
      response.status(400).send({ message: "error" });
    }

    function getDate() {
      const today = new Date();
      const month = today.getMonth() + 1;
      const year = today.getFullYear();
      const date = today.getDate();
      return `${date}/${month}/${year}`;
    }
    var data = {
      images: {
        logo: "https://i.postimg.cc/28H0MRmh/614d27ff743440968eac05db29b4fd71.png",
      },

      sender: {
        company: "SK bike Care",
        address: "Sample Street 123",
        zip: "1234 AB",
        city: "Coimbatore",
        country: "India",
      },

      client: {
        company: `${name}`,
        address: `${email}`,
        zip: `${phone}`,
        country: "India",
      },
      information: {
        number: "2023.0001",
        date: `${getDate()}`,
      },
      products: [
        {
          quantity: 1,
          description: `${service}`,
          "tax-rate": 6,
          price: `${cost}`,
        },
      ],
      settings: {
        currency: "INR",
      },
    };

    //Create your invoice! Easy!
    // easyinvoice.createInvoice(data, function (result) {
    //   fs.writeFileSync(`Invoice/${bikeNumber}.pdf`, result.pdf, "base64");
    // });
  } else {
    response.status(400).send({ message: "no data" });
  }
});

// get delivered vehicles data
app.get("/getDeliveredData", async function (request, response) {
  const getdata = await client
    .db("BikeServiceApp")
    .collection("Delivered")
    .find({ status: "delivered" })
    .toArray();
  if (getdata) {
    response.status(200).send(getdata);
  } else {
    response.status(400).send({ message: "no data" });
  }
});

// get service status

app.listen(PORT, () => console.log(`The server started in: ${PORT} ✨✨`));
