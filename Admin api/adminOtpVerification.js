import { app, client } from "../index.js";

export function adminOtpVerification() {
  app.post("/adminSignUp/otpVerification", async function (request, response) {
    const { otp } = await request.body;
    const storedOtp = await client
      .db("BikeServiceApp")
      .collection("Admin OTP")
      .findOne({ otp: +otp });
    if (storedOtp) {
      response.status(200).send({ message: "OTP verified" });
    } else {
      response.status(400).send({ message: "invalid otp" });
    }
  });
}
