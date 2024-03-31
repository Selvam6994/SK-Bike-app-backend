import { app, client } from "../index.js";
import { adminAuth } from "./AdminAuth/adminAuth.js";

export function postServiceList() {
  app.post("/postServiceList",adminAuth, async function (request, response) {
    const { nameOfService, price, image, isForm } = await request.body;
    const serviceListdata = await client
      .db("BikeServiceApp")
      .collection("Service List")
      .findOne({
        nameOfService: nameOfService,
      });

    if (serviceListdata) {
      response.status(400).send({ message: "Service Already Exists" });
    } else {
      const addService = await client
        .db("BikeServiceApp")
        .collection("Service List")
        .insertOne({
          nameOfService: nameOfService,
          price: price,
          imageLink: `../src/assets/App Images/Service Page Icon/${image}`,
          isForm: isForm,
        });
      response.status(200).send({ message: "added to the list" });
    }
  });
}
