import { NextRequest } from 'next/server';
import { executeQuery, getAdminByEmail, updateAdminLastLogin } from '@/lib/database';
import { createToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    if (!body.email || !body.password) {
      return new Response(
        JSON.stringify({ success: false, message: 'Email and password are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { email, password } = body;

    // Check if admin exists in the database
    const admin = await getAdminByEmail(email);

    if (!admin) {
      return new Response(
        JSON.stringify({ success: false, message: 'Invalid email or password' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // In a real implementation, you would hash and compare the password
    // For this implementation, we'll use the credentials from environment variables
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      // Update last login time
      await updateAdminLastLogin(email);

      // Generate JWT token
      const token = await createToken({
        sub: admin.id.toString(),
        email: admin.email,
        isActive: admin.is_active
      });

      return new Response(
        JSON.stringify({
          success: true,
          token,
          user: {
            id: admin.id,
            email: admin.email
          }
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } else {
      return new Response(
        JSON.stringify({ success: false, message: 'Invalid email or password' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (error: any) {
    console.error('Login API error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message || 'Internal server error'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}