import { app, client } from "../index.js";
import { adminAuth } from "./AdminAuth/adminAuth.js";

export function updateEnquiryToContacted() {
  app.put("/enquiryContacted",adminAuth, async function (request, response) {
    const { name, email, phone, about, message, status } =await request.body;
    const enquiryData = await client
      .db("BikeServiceApp")
      .collection("Enquiry Collection")
      .find({
        name: name,
        email: email,
        phone: phone,
        about: about,
        message: message,
        status: status,
      })
      .toArray();
    if (enquiryData) {
      const { name, email, phone, about, message } = request.body;
      const contactedData = await client
        .db("BikeServiceApp")
        .collection("Enquiry Collection")
        .updateOne(
          {
            name: name,
            email: email,
            phone: phone,
            about: about,
            message: message,
          },
          { $set: { status: "contacted" } }
        );
      response.status(200).send({ message: "added" });
    } else {
      response.status(400).send("not added");
    }
  });
}
