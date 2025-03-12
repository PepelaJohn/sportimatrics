// app/api/contact/route.ts
import { connectDB } from "@/lib/connectToDb";
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";



export async function POST(request: NextRequest) {
  try {
    // Get form data from request
    await connectDB()
    const { name, subject, message, email } = await request.json();

    const EMAIL_CONFIG = {
        from: "musimeter.app@gmail.com", // Your app's sending email
        to: 'pepelajahy@gmail.com', // Your receiving email
        host: process.env.EMAIL_SERVER_HOST || "smtp.gmail.com",
        port: parseInt(process.env.EMAIL_SERVER_PORT || "587"),
        user: process.env.EMAIL_SERVER_USER || "musimeter.app@gmail.com",
        pass: process.env.EMAIL_SERVER_PASSWORD || "imdz jcpm qfbv wrvb",
        secure: process.env.EMAIL_SERVER_SECURE === "true", // true for 465, false for other ports
      };


    if (!name || !message || !subject) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Configure email transporter
    const transporter = nodemailer.createTransport({
      host: EMAIL_CONFIG.host,
      port: EMAIL_CONFIG.port,
      secure: EMAIL_CONFIG.secure,
      auth: {
        user: EMAIL_CONFIG.user,
        pass: EMAIL_CONFIG.pass,
      },
    });

    // Create email content
    const mailOptions = {
      from: EMAIL_CONFIG.from,
      to: EMAIL_CONFIG.to,
      replyTo: email,
      subject: `Contact Form: ${subject}`,
      text: `
Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}
      `,
      html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #2D3748; border-bottom: 1px solid #E2E8F0; padding-bottom: 10px;">New Contact Form Submission</h2>
  
  <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
    <tr>
      <td style="padding: 8px 0; font-weight: bold; width: 100px;">Name:</td>
      <td style="padding: 8px 0;">${name}</td>
    </tr>
    <tr>
      <td style="padding: 8px 0; font-weight: bold;">Email:</td>
      <td style="padding: 8px 0;">${email}</td>
    </tr>
    <tr>
      <td style="padding: 8px 0; font-weight: bold;">Subject:</td>
      <td style="padding: 8px 0;">${subject}</td>
    </tr>
  </table>
  
  <div style="background-color: #F7FAFC; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
    <h3 style="margin-top: 0; color: #4A5568;">Message:</h3>
    <div style="white-space: pre-wrap;">${message.replace(/\n/g, "<br>")}</div>
  </div>
  
  <p style="color: #718096; font-size: 12px; text-align: center; margin-top: 30px;">
    This email was sent from your website's contact form.
  </p>
</div>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Return success response
    return NextResponse.json(
      { success: true, message: "Message sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact form error:", error);

    // Return error response
    return NextResponse.json(
      {
        success: false,
        message: "Failed to send message",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// This function should be replaced with your actual auth implementation
function getUserEmailFromSession(request: NextRequest): string | null {
  // Replace this with actual code to get user email from your auth system
  // Examples:
  // - If using NextAuth.js: Get from the session
  // - If using cookies: Parse from cookies
  // - If using JWT: Decode from Authorization header

  // For now, return null as a placeholder
  return null;
}
