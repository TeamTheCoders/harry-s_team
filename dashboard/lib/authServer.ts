import { verifyToken } from './auth';

// Function to check if a request is authenticated
export async function isAuthenticated(request: Request) {
  // Extract token from authorization header
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }

  const token = authHeader.substring(7); // Remove 'Bearer ' prefix
  const result = await verifyToken(token);

  return result.valid;
}