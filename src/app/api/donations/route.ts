import { NextRequest, NextResponse } from "next/server";
import UserModel from "@/models/user";
import DonationModel from "@/models/donation";
import axios from "axios";
import crypto from "crypto";
import { connectDB } from "@/lib/connectToDb";


// develpment
const PAYPAL_CLIENT_ID = process.env.NODE_ENV === 'production' ? process.env.PAYPAL_API_KEY : process.env.PAYPAL_CLIENT_ID_DEV;
const PAYPAL_SECRET = process.env.NODE_ENV === 'production' ? process.env.PAYPAL_SECRET : process.env.PAYPAL_CLIENT_SECRET_DEV;
const PAYPAL_WEBHOOK_ID =  process.env.NODE_ENV === 'production' ? process.env.PAYPAL_WEBHOOK_ID: process.env.PAYPAL_WEBHOOK_ID_DEV;
const PAYPAL_API_URL = process.env.NODE_ENV === "production"
? "https://api-m.paypal.com"
: "https://api-m.sandbox.paypal.com";







// ✅ Function to Verify PayPal Webhook Signature
const verifyPayPalWebhook = async (req: NextRequest, body:any): Promise<boolean> => {

  const headers = req.headers;
  const transmissionId = headers.get("paypal-transmission-id") || "";
  const transmissionSig = headers.get("paypal-transmission-sig") || "";
  const certUrl = headers.get("paypal-cert-url") || "";
  const authAlgo = headers.get("paypal-auth-algo") || "";
  
 
  // Verify webhook using PayPal API
  const verificationData = {
    auth_algo: authAlgo,
    cert_url: certUrl,
    transmission_id: transmissionId,
    transmission_sig: transmissionSig,
    webhook_id: PAYPAL_WEBHOOK_ID,
    webhook_event: body,
    transmission_time: headers.get("paypal-transmission-time"),

  };

  try {
    const response = await fetch("https://api-m.sandbox.paypal.com/v1/notifications/verify-webhook-signature", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString("base64")}`,
      },
      body: JSON.stringify(verificationData),
    });
    


    if (!response.ok) {
    
      throw new Error(`PayPal verification failed: ${response.statusText}`);
    }
  
    const result = await response.json();
    return result.verification_status === "SUCCESS";
  } catch (error) {
    console.error("Webhook verification error:", error);
    return false;
  }
  
};


export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const action = url.searchParams.get("action");
  await connectDB()
  try {
    if (action === "create-payment") {
      const { userId, amount } = await req.json();
      console.log(userId, amount)
      if (!userId || !amount) {
        return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
      }

      const user = await (UserModel.findOne({email:userId}) as any)

     const id = user._id
    
      const order = {
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: amount,
            },
            custom_id: id,
          },
        ],
        application_context: {
          return_url: `${process.env.URL}/donate/success`,
          cancel_url: `${process.env.URL}/donate/cancel`,
        },
      };
      console.log(PAYPAL_CLIENT_ID, PAYPAL_SECRET)
      if(!PAYPAL_CLIENT_ID || !PAYPAL_SECRET) {
        throw new Error('No authentication required')
      }
      const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString("base64");
      const response = await axios.post(
        `${PAYPAL_API_URL}/v2/checkout/orders`,
        order,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${auth}`,
          },
        }
      );

      return NextResponse.json({ link: response.data.links.find((link: any) => link.rel === "approve").href });
    }

    if (action === "donate") {
      const { userId, amount } = await req.json();
      
      if (!userId || !amount) {
        return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
      }
    
      return NextResponse.json({ message: "Payment request initiated. Awaiting confirmation." }, { status: 200 });
    }
    
    if (action === "paypal-webhook") {
      const clonedReq = req
      const event = await req.json();
      console.log("Received PayPal Webhook");
    
    
      // Verify PayPal webhook signature ✅
      if (!(await verifyPayPalWebhook(clonedReq, event))) {
        console.log('invalidwebhook')
        return NextResponse.json({ error: "Invalid PayPal webhook signature." }, { status: 400 });
      }
    
      
      
    
      const eventType = event.event_type;
      const transactionId = event.resource.id;
      const amount = event.resource.purchase_units[0].amount.value; // Use optional chaining to avoid crashes
      const userId = event.resource.purchase_units[0].custom_id; // Ensure this is sent from PayPal


    
    
      // Ensure transactionId is unique to prevent duplicate entries
      const existingTransaction = await DonationModel.findOne({ transactionId });
      if (existingTransaction) {
        return NextResponse.json({ message: "Transaction already recorded." }, { status: 200 });
      }
    
      // Handle different PayPal webhook event types
      switch (eventType) {
        case "PAYMENT.CAPTURE.COMPLETED": // ✅ Donation was successfully processed
          {
            const donation = new DonationModel({
              user: userId,
              amount,
              currency: "USD",
              transactionId,
              status: "completed",
            });
    
            await donation.save();
            await UserModel.findByIdAndUpdate(userId, { $push: { donations: donation } });
    
            return NextResponse.json({ message: "Donation recorded successfully." }, { status: 201 });
          }
        case "CHECKOUT.ORDER.APPROVED": // ✅ Donation was successfully processed
          {
            const donation = new DonationModel({
              user: userId,
              amount,
              currency: "USD",
              transactionId,
              status: "completed",
            });
    
            await donation.save();
            await UserModel.findByIdAndUpdate(userId, { $push: { donations: donation } });
    
            return NextResponse.json({ message: "Donation recorded successfully." }, { status: 201 });
          }
    
        case "PAYMENT.CAPTURE.DENIED": // ❌ Payment failed
          {
            
    
            const failedDonation = new DonationModel({
              user: userId,
              amount,
              currency: "USD",
              transactionId,
              status: "failed",
            });
    
            await failedDonation.save();
            return NextResponse.json({ message: "Payment was denied." }, { status: 400 });
          }
    
        case "PAYMENT.CAPTURE.REFUNDED": // 🔄 Refund issued
          {
            console.warn(`Payment refunded for transaction ${transactionId}`);
    
            await DonationModel.findOneAndUpdate(
              { transactionId },
              { status: "refunded" },
              { new: true }
            );
    
            return NextResponse.json({ message: "Donation refunded." }, { status: 200 });
          }
    
        default:
          return NextResponse.json({ message: `Unhandled event: ${eventType}` }, { status: 200 });
      }

      
    }
    
    

    if (action === "purchase-premium") {
      const { userId, transactionId } = await req.json();
      if (!userId || !transactionId) {
        return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
      }

      const user = await UserModel.findById(userId);
      if (!user) {
        return NextResponse.json({ error: "User not found." }, { status: 404 });
      }

      user.premium = true;
      await user.save();

      return NextResponse.json({ message: "User upgraded to premium." });
    }

    return NextResponse.json({ error: "Invalid action." }, { status: 400 });
  } catch (error:any) {
    console.error(error.message, 'create paayment');
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  await connectDB()
  const url = new URL(req.url);
  const action = url.searchParams.get("action");

  try {
    if (action === "donations") {
      const userId = url.searchParams.get("userId");
      if (!userId) {
        return NextResponse.json({ error: "User ID is required." }, { status: 400 });
      }

      const donations = await DonationModel.find({ user: userId }).sort({ createdAt: -1 });
      return NextResponse.json({ donations });
    }

    return NextResponse.json({ error: "Invalid action." }, { status: 400 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
