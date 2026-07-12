import { NextResponse } from 'next/server';
import { z } from 'zod/v4';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth/auth';
import { headers } from 'next/headers';

const feedbackSchema = z.object({
  message: z.string().min(1, 'Message is required').max(2000)
});

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validation = feedbackSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.issues },
        { status: 400 }
      );
    }

    const { message } = validation.data;

    await prisma.feedback.create({
      data: { userId: session.user.id, message }
    });

    return NextResponse.json(
      { success: true, message: 'Feedback submitted successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Feedback submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
