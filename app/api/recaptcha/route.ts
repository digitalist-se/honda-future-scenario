import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const postData = await request.json();

    const url = "https://www.google.com/recaptcha/api/siteverify";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        secret: process.env.RECAPTHA_SECRET_KEY!,
        response: postData.token,
      }),
    };

    const response = await fetch(url, options);
    if (response.status !== 200) {
      throw new Error(`Recaptcha request: ${url}`);
    }
    const result = await response.json();

    // Score closer to 1 means its likely a user
    if (result.success && result.score >= 0.5) {
      return NextResponse.json({ success: true }, { status: 200 });
    } else {
      return NextResponse.json({ success: false }, { status: 200 });
    }
  } catch (error) {
    console.log(error);
    const error_message = error instanceof Error ? error.message : error;

    return NextResponse.json(
      { success: false, error: error_message },
      { status: 500 }
    );
  }
}
