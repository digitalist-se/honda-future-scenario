/*
  Api to check health of the system. Responds with status 200 if success or 500 if there's an error. If this api doesn't respond, we know that the service has crashed.
  GET /api/health
*/
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    return NextResponse.json({}, { status: 200 });
  } catch (error) {
    console.log(error);
    const error_message = error instanceof Error ? error.message : error;

    return NextResponse.json(
      {},
      { status: 500 }
    );
  }
}
