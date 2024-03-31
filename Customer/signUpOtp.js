import { app, client } from "../index.js";

export function signUpOtp() {
  app.post("/signUp/otpVerification", async function (request, response) {
    const { email, otp } = await request.body;
    const storedOtp = await client
      .db("BikeServiceApp")
      .collection("OTP")
      .findOne({ otp: otp });
    if (storedOtp) {
      response.status(200).send({ message: "OTP verified" });
    } else {
      response.status(400).send({ message: "invalid otp" });
    }
  });
}
