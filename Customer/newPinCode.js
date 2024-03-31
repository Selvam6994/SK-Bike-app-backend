import { app, generateHashedPassword, client } from "../index.js";

export function newPinCode() {
  app.post("/signUp/:email", async function (request, response) {
    const { email } = request.params;
    const { name, phone, pin, confirmPin } = await request.body;
    if (pin == confirmPin) {
      const hashedPassword = await generateHashedPassword(pin);
      const userData = await client
        .db("BikeServiceApp")
        .collection("User Data")
        .insertOne({
          name: name,
          email: email,
          phone: phone,
          pin: hashedPassword,
        });
      response.status(200).send({ password: hashedPassword });
    } else {
      response.status(400).send({ message: "password does not match" });
    }
  });
}
