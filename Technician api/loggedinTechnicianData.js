import { app, client } from "../index.js";

export function loggedinTechnicianData() {
  app.get("/userTechniData/:email", async function (request, response) {
    const { email } = request.params;
    const findTechni = await client.db("BikeServiceApp").collection("Technicians Data").findOne({ email: email });
    if (findTechni) {
      response.status(200).send(findTechni);
    } else {
      response.status(400).send({ message: "no data" });
    }
  });
}
