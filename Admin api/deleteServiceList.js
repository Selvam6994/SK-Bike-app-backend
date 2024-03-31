import { app, client } from "../index.js";
import { adminAuth } from "./AdminAuth/adminAuth.js";

export function deleteServiceList() {
  app.delete("/deleteServiceList",adminAuth, async function (request, response) {
    const { nameOfService } =await request.body;
    const serviceListdata = await client
      .db("BikeServiceApp")
      .collection("Service List")
      .findOne({
        nameOfService: nameOfService,
      });

    if (serviceListdata) {
      const deleteData = await client
        .db("BikeServiceApp")
        .collection("Service List")
        .deleteOne({ nameOfService: nameOfService });
      response.status(200).send({ message: "Deleted successfully" });
    } else {
      response.status(400).send({ message: "No data available" });
    }
  });
}
