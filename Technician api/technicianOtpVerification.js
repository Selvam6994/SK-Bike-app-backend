import { app, client } from "../index.js";

export function technicianOtpVerification() {
  app.post("/techniSignUp/otpVerification", async function (request, response) {
    const { otp } = await request.body;
    const storedOtp = await client
      .db("BikeServiceApp")
      .collection("Technicians OTP")
      .findOne({ otp: +otp });
    if (storedOtp) {
      response.status(200).send({ message: "OTP verified" });
    } else {
      response.status(400).send({ message: "invalid otp" });
    }
  });
}
