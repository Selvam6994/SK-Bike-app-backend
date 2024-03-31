import { app, client } from "../index.js";
import { adminAuth } from "./AdminAuth/adminAuth.js";

export function contactedEnquries() {
  app.get("/contactedEnquiry",adminAuth, async function (request, response) {
    const statusNew = await client
      .db("BikeServiceApp")
      .collection("Enquiry Collection")
      .find({ status: "contacted" })
      .toArray();
    if (statusNew != 0) {
      response.status(200).send(statusNew);
    } else {
      response.status(400).send({ message: "no data" });
    }
  });
}
