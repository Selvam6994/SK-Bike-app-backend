import { app, client } from "../index.js";

export function generalEnquires() {
  app.post("/enquires", async function (request, response) {
    const { name, email, phone, about, message } = await request.body;
    const enquiryData = await client
      .db("BikeServiceApp")
      .collection("Enquiry Collection")
      .insertOne({
        name: name,
        email: email,
        phone: phone,
        about: about,
        message: message,
        status:"new"
      });
    response.status(200).send({ message: "enquiry sent" });
  });
}
