import { NextResponse } from 'next/server';

export const parseRequestBody = async (req: Request) => {
  try {
    return await req.json();
  } catch (e) {
    console.error(e);
    throw new NextResponse(
      JSON.stringify({
        code: 'bad_request',
        message:
          'Invalid JSON format in request body. Please ensure the request body is a valid JSON object.'
      }),
      {
        status: 400
      }
    );
  }
};
