// Server-side authentication utilities
import { jwtVerify, SignJWT } from 'jose';

// JWT secret from environment variables
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-super-secret-jwt-key-here-change-in-production'
);

// Function to verify a JWT token
export async function verifyToken(token: string) {
  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    return {
      valid: true,
      payload: verified.payload
    };
  } catch (error) {
    console.error('Token verification error:', error);
    return {
      valid: false,
      payload: null
    };
  }
}

// Function to create a JWT token
export async function createToken(payload: any) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(JWT_SECRET);

  return token;
}