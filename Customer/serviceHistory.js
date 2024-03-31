import { userAuth } from "./auth/auth.js";
import { app, client } from "../index.js";

export function serviceHistory() {
  app.get("/serviceHistory/:email",userAuth, async function (request, response) {
    const { email } = request.params;

    const bookingData = await client
      .db("BikeServiceApp")
      .collection("Delivered")
      .find({ email: email })
      .toArray();
   if(bookingData){
    response.status(200).send(bookingData);
   }else{
    response.status(400).send({message:"Data not found"});
   }
  });

  app.get("/customerServiceStatus/:email",userAuth, async function (request, response) {
    const { email } = request.params;
    const getdata = await client
      .db("BikeServiceApp")
      .collection("Shop Floor")
      .find({ email: email }).toArray()
    if (getdata) {
      response.status(200).send(getdata);
    } else {
      response.status(400).send({ message: "no data" });
    }
  });
}
