import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const formData = await request.formData();

    const firstLastName = formData.get("firstLastName") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;

    console.log(firstLastName, email, message);

    if (!firstLastName || !email || !message) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    // Send the mail
    // ...
  } catch (error) {
    console.error("Error processing request or sending email:", error);
    return NextResponse.json(
      { error: "Error processing request." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
