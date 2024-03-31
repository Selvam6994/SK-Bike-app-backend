import { app, client } from "../index.js";
import { adminAuth } from "./AdminAuth/adminAuth.js";

export function getFeedbackList() {
  app.get("/getFeedback",adminAuth, async function (request, response) {
    const getFeedback = await client
      .db("BikeServiceApp")
      .collection("Enquiry Collection")
      .find({ about: "Feedback" })
      .toArray();

    if (getFeedback) {
      response.status(200).send(getFeedback);
    } else {
      response.status(400).send({ message: "no data" });
    }
  });
}
