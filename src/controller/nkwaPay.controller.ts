import { Pay } from "@nkwa-pay/sdk";
import { Request, Response, NextFunction } from 'express';

// const pay = new Pay({
//     apiKeyAuth: process.env.API_KEY,
//     serverURL: "https://api.sandbox.pay.mynkwa.com",
// });
// async function collectPayment() {
//     try {
//       const result = await pay.collect.post({
//         requestBody: {
//           amount: 1000, // Amount in XAF
//           phoneNumber: "237600000000",
//           description: "Payment for order #1234"
//         }
//       });
      
//       console.log(result.payment.id); // Use this ID to check payment status later
//     } catch (error) {
//       console.error(error);
//     }
//   }

const options = {
    method: 'POST',
    headers: {'X-API-Key': process.env.API_KEY || "", 'Content-Type': 'application/json'},
    body: '{"amount":1000,"phoneNumber":"237681256076"}'
  };
  
const collectPayment=async(amount:number,phoneNumber:number)=>{
    const options = {
        method: 'POST',
        headers: {'X-API-Key': process.env.API_KEY || "", 'Content-Type': 'application/json'},
        body: `{"amount":${amount},"phoneNumber":${phoneNumber}`
    };
    fetch('https://api.pay.staging.mynkwa.com/collect', options)
    .then(response => response.json())
    .then(response => console.log(response))
    .catch(err => console.error(err));
}

export const disburse=async(req: Request, res: Response, next: NextFunction)=>{
    const {phoneNumber,amount}=req.body
    const options = {
        method: 'POST',
        headers: {'X-API-Key': process.env.API_KEY || "", 'Content-Type': 'application/json'},
        body: `{"amount":${amount},"phoneNumber":${phoneNumber}`
    };
    fetch('https://api.pay.staging.mynkwa.com/disburse', options)
    .then(response => response.json())
    .then(response => {
        console.log(response)
        next()
    })
    .catch(err => console.error(err));
}