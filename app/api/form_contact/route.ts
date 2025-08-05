/*
  This route sends email using node mailer and smtp transport. Any smtp service provider can be used here.
  Ensure that the SMTP_HOST, SMTP_USER and SMTP_PASSWORD environment variables are set correctly.
*/

import { NextRequest, NextResponse } from "next/server";
import { createTransport } from "nodemailer";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const formData = await request.formData();

    const firstLastName = formData.get("firstLastName") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;

    console.log(`Contact form submitted.\n Name: ${firstLastName}\n Email: ${email}\n Message: ${message}`);

    if (!firstLastName || !email || !message) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    // Send email using node mailer
    const transporter = createTransport({
      host: process.env.SMTP_HOST,
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"FutureScenario" <${process.env.CONTACT_FORM_FROM_EMAIL}>`,
      to: process.env.CONTACT_FORM_TO_EMAIL,
      subject: "Honda future scenario - contact form submission",
      text: `A new contact form has been submitted on the Honda Future Scenario site. Details below.\n\nName: ${firstLastName}\nEmail: ${email}\nMessage:\n${message}`,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error processing request or sending email:", error);
    return NextResponse.json(
      { error: "Error processing request." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
