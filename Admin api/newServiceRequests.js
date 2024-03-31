import { app, client } from "../index.js";
import { adminAuth } from "./AdminAuth/adminAuth.js";

export function newServiceRequests() {
  app.get("/serviceRequests",adminAuth,async function (request, response) {
    const statusNew = await client
      .db("BikeServiceApp")
      .collection("Booking Collection")
      .find({ status: "new" })
      .toArray();
    if (statusNew != 0) {
      response.status(200).send(statusNew);
    } else {
      response.status(400).send({ message: "no data" });
    }
  });
}
