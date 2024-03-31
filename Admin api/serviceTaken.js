import { app, client } from "../index.js";
import { adminAuth } from "./AdminAuth/adminAuth.js";

export function serviceTaken() {
  app.get("/serviceTaken",adminAuth, async function (request, response) {
    const statusNew = await client
      .db("BikeServiceApp")
      .collection("Booking Collection")
      .find({ status: "taken" })
      .toArray();
    if (statusNew != 0) {
      response.status(200).send(statusNew);
    } else {
      response.status(400).send({ message: "no data" });
    } ``;
  });
}
