import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { app, client, secretKey } from "../index.js";

export function adminLogin() {
  app.post("/adminLogIn", async function (request, response) {
    const { email, pin } = await request.body;
    const existingUser = await client
      .db("BikeServiceApp")
      .collection("Admin Data")
      .findOne({ email: email });
    if (existingUser) {
      let storedPassword = existingUser.pin;
      const inputPin = pin.toString();
      const passwordCheck = await bcrypt.compare(inputPin, storedPassword);
      if (passwordCheck == true) {
        let token = jwt.sign({ email: existingUser.email }, secretKey);
        response
          .status(200)
          .send({ message: "Logged in successfully", token: token });
      } else {
        response.status(400).send({ message: "invalid credential" });
      }
    } else {
      response.status(400).send({ message: "invalid credential" });
    }
  });
}
