import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  return NextResponse.json(
    { message: 'This endpoint is deprecated. Please use the OTP login flow.' },
    { status: 404 }
  );
}
