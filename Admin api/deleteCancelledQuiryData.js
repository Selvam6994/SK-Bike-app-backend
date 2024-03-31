import { app, client } from "../index.js";
import { adminAuth } from "./AdminAuth/adminAuth.js";

export function deleteCancelledQuiryData() {
  app.delete("/deleteCancelledEnquiry",adminAuth, async function (request, response) {
    const { name, email, phone, about, message, status } = await request.body;

    const findStatus = await client
      .db("BikeServiceApp")
      .collection("Enquiry Collection")
      .findOne({
        name: name,
        email: email,
        phone: phone,
        about: about,
        message: message,
        status: status,
      });

    if (findStatus) {
      const deleteEnquiry = await client
        .db("BikeServiceApp")
        .collection("Enquiry Collection")
        .deleteOne({
          name: name,
          email: email,
          phone: phone,
          about: about,
          message: message,
          status: status,
        });
      response.status(200).send({ message: "deleted successfully" });
    } else {
      response.status(400).send({ message: "no data found" });
    }
  });
}
