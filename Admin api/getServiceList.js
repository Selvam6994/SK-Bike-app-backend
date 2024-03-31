import { app, client } from "../index.js";

export function getServiceList() {
  app.get("/getServiceList",async function (request, response) {
    const getServiceData = await client
      .db("BikeServiceApp")
      .collection("Service List")
      .find({})
      .toArray();
    if (getServiceData.length >= 1) {
      response.status(200).send(getServiceData);
    } else {
      response.status(400).send({ message: "No data available" });
    }
  });
}
