import nodemailer from "nodemailer";
import { app, client } from "../index.js";
import { userAuth } from "./auth/auth.js";

export function serviceBooking() {
  app.post("/serviceBooking",userAuth, async function (request, response) {
    const {
      name, email, phone, service, bikeBrand, model, bikeNumber, kms, date,
    } = await request.body;
    const regEmail = await client
      .db("BikeServiceApp")
      .collection("User Data")
      .findOne({ email: email });
    const duplicateBooking = await client
      .db("BikeServiceApp")
      .collection("Booking Collection")
      .findOne({
        bikeNumber: bikeNumber,
        date: date,
      });
    if (regEmail) {
      if (!duplicateBooking) {
        const bookingData = await client
          .db("BikeServiceApp")
          .collection("Booking Collection")
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
          });
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
          subject: "Sk Bike Care - Booking Done Successfully",
          html: `<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Document</title>
      </head>
      <body>
          <div style="margin:0 auto;max-width:600px;">
          <h1>Thank you for choosing SK BIKE CARE!</h1>
              <p>${service}
         for your ${bikeBrand} ${model} has been booked successfully
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
        response.status(200).send({ message: "Booking done successfully" });
      } else {
        response
          .status(401)
          .send({ message: "The Vehicle is alredy booked for service" });
      }
    } else {
      response
        .status(400)
        .send({ message: "Please provide the registered email address" });
    }
  });
}
