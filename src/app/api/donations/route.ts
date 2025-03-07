import { NextRequest, NextResponse } from "next/server";
import UserModel from "@/models/user";
import DonationModel from "@/models/donation";
import axios from "axios";
import crypto from "crypto";

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const PAYPAL_WEBHOOK_ID = process.env.PAYPAL_WEBHOOK_ID;
const PAYPAL_API_URL = "https://api-m.sandbox.paypal.com"; // Change for live mode



// ✅ Function to Verify PayPal Webhook Signature
const verifyPayPalWebhook = async (req: NextRequest): Promise<boolean> => {
  const headers = req.headers;
  const transmissionId = headers.get("paypal-transmission-id") || "";
  const transmissionSig = headers.get("paypal-transmission-sig") || "";
  const certUrl = headers.get("paypal-cert-url") || "";
  const authAlgo = headers.get("paypal-auth-algo") || "";
  const webhookId = headers.get("paypal-webhook-id") || "";
  const body = await req.text();

  // Only process if the webhook ID matches
  if (webhookId !== PAYPAL_WEBHOOK_ID) return false;

  // Verify webhook using PayPal API
  const verificationData = {
    auth_algo: authAlgo,
    cert_url: certUrl,
    transmission_id: transmissionId,
    transmission_sig: transmissionSig,
    webhook_id: PAYPAL_WEBHOOK_ID,
    webhook_event: JSON.parse(body),
  };

  const response = await fetch("https://api-m.sandbox.paypal.com/v1/notifications/verify-webhook-signature", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString("base64")}`,
    },
    body: JSON.stringify(verificationData),
  });

  const result = await response.json();
  return result.verification_status === "SUCCESS";
};


export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const action = url.searchParams.get("action");
  
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
          return_url: "http://localhost:3000/donate/success",
          cancel_url: "http://localhost:3000/donate/cancel",
        },
      };

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
      console.log("Received PayPal Webhook");
      if (!(await verifyPayPalWebhook(req))) {
        return NextResponse.json({ error: "Invalid PayPal webhook signature." }, { status: 400 });
      }
    
      const event = await req.json();
      console.log("Received PayPal Webhook:", event);
    
      if (event.event_type === "PAYMENT.CAPTURE.COMPLETED") { // ✅ Correct event type
        const transactionId = event.resource.id;
        const amount = event.resource.amount.value;
        const userId = event.resource.custom_id; // Make sure you send this in the PayPal request
    
        // Ensure transactionId is unique (prevent duplicates)
        const existingTransaction = await DonationModel.findOne({ transactionId });
        if (existingTransaction) {
          return NextResponse.json({ message: "Transaction already recorded." }, { status: 200 });
        }
    
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
    
      return NextResponse.json({ message: "Webhook received but no action taken." });
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
    console.error(error.message);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
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
