import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { z } from 'zod';
import { createContactMessage } from '@/models/ContactMessage';

// Define the validation schema using Zod
const contactSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  subject: z.string().min(5, { message: 'Subject must be at least 5 characters' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters' }),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the request body
    const validatedData = contactSchema.parse(body);

    // Save the message to the database
    const contactMessage = await createContactMessage({
      name: validatedData.name,
      email: validatedData.email,
      message: validatedData.message,
    });

    if (!contactMessage) {
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to save message to database'
        },
        { status: 500 }
      );
    }

    // In a real application, you would also:
    // 1. Send an email notification
    // 2. Possibly trigger other business logic

    console.log('New contact form submission saved to database:', contactMessage);

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'Thank you for your message! We will get back to you soon.'
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Return validation errors
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid input data',
          errors: error.issues // Changed from .errors to .issues
        },
        { status: 400 }
      );
    }

    // Return generic error for unexpected errors
    return NextResponse.json(
      {
        success: false,
        message: 'An error occurred while processing your request'
      },
      { status: 500 }
    );
  }
}