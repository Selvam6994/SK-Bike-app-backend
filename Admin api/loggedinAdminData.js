import {app,client} from "../index.js"
import { adminAuth } from "./AdminAuth/adminAuth.js";

export function loggedinAdminData() {
  app.get("/userAdminData/:email", adminAuth, async function (request, response) {
    const { email } = request.params;
    const findAdmin = await client.db("BikeServiceApp").collection("Admin Data").findOne({ email: email });
    if (findAdmin) {
      response.status(200).send(findAdmin);
    } else {
      response.status(400).send({ message: "no data" });
    }
  });
}
