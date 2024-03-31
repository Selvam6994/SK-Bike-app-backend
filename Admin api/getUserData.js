import { app, client } from "../index.js";
import { adminAuth } from "./AdminAuth/adminAuth.js";

export function getUserData() {
  app.get("/getUserData",adminAuth, async function (request, response) {
    const getData = await client
      .db("BikeServiceApp")
      .collection("User Data")
      .find({})
      .toArray();
    if (getData) {
      response.status(200).send(getData);
    } else {
      response.status(400).send({ message: "no data" });
    }
  });
}
