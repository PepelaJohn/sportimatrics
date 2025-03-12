import { connectDB } from "@/lib/connectToDb";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { Resend } from "resend";
import axios from "axios";

const resend = new Resend("re_dtqjCP5E_E7T49c9S1SEkQGpKhWeDCZ9p");

export const POST = async (request: NextRequest) => {
  try {
    await connectDB();
    const body = await request.json();

    if (!body.email || !body.refresh_token) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const userAgent = request.headers.get("user-agent") || "Unknown Device";
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      request.ip ||
      "Unknown IP";

    let locationInfo = "Unknown Location";
    try {
      const geoResponse = await axios.get(`https://ipapi.co/${ip}/json/`);
      const { city, region, country_name } = geoResponse.data;
      locationInfo = [city, region, country_name].filter(Boolean).join(", ") || "Unknown Location";
    } catch (error) {
      console.error("Failed to fetch location data:", error);
    }

    let user:any = await User.findOne({ email: body.email });
    const isNewUser = !user;

    user = await User.findOneAndUpdate(
      { email: body.email },
      {
        refresh_token: body.refresh_token,
        display_name: body.display_name,
        uri: body.uri,
        premium: body.product === "premium",
      },
      { new: true, upsert: true, runValidators: true }
    );

    const response = NextResponse.json({ user }, { status: 200 });
    response.cookies.set("_gtPaotwcsR", user!.refresh_token, {
      expires: new Date(Date.now() + 60 * 60 * 24 * 10 * 1000), // 10 days
      secure: true,
      httpOnly: true,
      sameSite: "strict",
      path: "/refresh",
    });

    // For welcome email
    const welcomeEmailBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { font-family: 'Circular', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      .logo { text-align: center; margin-bottom: 20px;; }
    .header { background-color: #1DB954; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
    .button { background-color: #1DB954; color: white; padding: 12px 20px; text-decoration: none; border-radius: 30px; display: inline-block; font-weight: bold; margin: 15px 0; }
    .footer { margin-top: 30px; font-size: 12px; color: #777; border-top: 1px solid #eee; padding-top: 20px; }
    h1 { color: #1DB954; margin-top: 0; }
    ul { color: #333; }
    a { color: #1DB954; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">
        <img src="https://i.imgur.com/AOZy6Iu.png" alt="Company Logo"  style='border-radius:100%; width:70px;height:70px;pointer-events:none;' height="auto">
    </div>
    
    <div class="header">
      <h1 style="color: white; margin: 0;">Welcome to Our Platform!</h1>
    </div>
    
    <strong >Musimeter.</strong>
    
    <p>We're thrilled to have you join our community. Your account has been successfully created and is ready to use.</p>
    
    <p>Here's what you can do next:</p>
    <ul>
      <li>Complete your profile settings</li>
      <li>Explore our available features</li>
      <li>Check out our quick start guide</li>
    </ul>
    
    <a href="https://musimeter.site/dashboard" class="button">Get Started</a>
    
    <p>If you have any questions or need assistance, our support team is always here to help.</p>
    
    <p>Best regards,<br>
    Musimeter. </p>
    
    <div class="footer">
      <p>This email was sent automatically. Please do not reply to this message.</p>
    </div>
  </div>
</body>
</html>`
;

    // For login notification
    const loginEmailBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { font-family: 'Circular', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .logo { text-align: center; margin-bottom: 20px;; }
    .header { background-color: #1DB954; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
    .alert { background-color: #fff8f8; border-left: 4px solid #ff3860; padding: 15px; margin: 20px 0; border-radius: 5px; }
    .details { background-color: #f7f7f7; padding: 15px; border-radius: 5px; margin: 15px 0; }
    .button { background-color: #1DB954; color: white; padding: 12px 20px; text-decoration: none; border-radius: 30px; display: inline-block; font-weight: bold; margin: 15px 0; }
    .footer { margin-top: 30px; font-size: 12px; color: #777; border-top: 1px solid #eee; padding-top: 20px; }
    h1 { color: #1DB954; margin-top: 0; }
    a { color: #1DB954; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">
      <img src="https://i.imgur.com/AOZy6Iu.png" alt="Company Logo"  style='border-radius:100%; width:70px;height:70px;pointer-events:none;' height="auto">
    </div>
    
    <div class="header">
      <h1 style="color: white; margin: 0;">New Login Detected</h1>
    </div>
    
    <strong >Musimeter.</strong>
    
    <p>We detected a new sign-in to your account with the following details:</p>
    
    <div class="details">
      <p><strong>Device:</strong> ${userAgent}</p>
      <p><strong>Location:</strong> ${locationInfo}</p>
      <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
    </div>
    
    <p>If this was you, you can safely ignore this message.</p>
    
    <div class="alert">
      <p><strong>If you don't recognize this activity, please take immediate action:</strong></p>
      <ol>
        <li>Reset your password immediately</li>
        <li>Review your account for any suspicious changes</li>
        <li>Contact our support team at support@musimeter.site</li>
      </ol>
      
      <a href="https://musimeter.site/reset-password" class="button" style="background-color: #ff3860;">Reset Password</a>
    </div>
    
    <p>We take your security seriously and recommend using two-factor authentication for additional protection.</p>
    
    <p>Best regards,<br>
    Musimeter.</p>
    
    <div class="footer">
      <p>This email was sent automatically. Please do not reply to this message.</p>
    </div>
  </div>
</body>
</html>`
;

    const emailSubject = isNewUser ? "Welcome to Our Platform!" : "New Login Detected";
    const emailBody = isNewUser ? welcomeEmailBody : loginEmailBody;

    await resend.emails.send({
      from: "hello@musimeter.site",
      to: body.email,
      subject: emailSubject,
      html: emailBody,
    });

    return response;
  } catch (error: any) {
    console.error("Error handling request:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
