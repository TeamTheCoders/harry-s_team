# Admin Dashboard Documentation

## Overview
This admin dashboard allows administrators to manage website content including hero images and team member details. The dashboard is built with Next.js 16.0.10 and provides a simple, intuitive interface for non-technical users.

## Getting Started

### Prerequisites
- Node.js 18 or higher
- PostgreSQL database
- Next.js development environment

### Installation
1. Clone the repository
2. Navigate to the `dashboard` directory
3. Install dependencies: `npm install`
4. Create a `.env.local` file with the required environment variables
5. Start the development server: `npm run dev`

### Environment Variables
Create a `.env.local` file in the dashboard directory with the following variables:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/admin_dashboard"

# Authentication Credentials
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="secure_password"

# Application Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# JWT Secret
JWT_SECRET="your-super-secret-jwt-key-here-change-in-production"
```

## Features

### Authentication
- Secure login using email and password
- JWT-based session management
- Automatic redirection to login page for unauthorized users

### Hero Images Management
- Upload, edit, and delete hero images
- Set alt text for accessibility
- Add captions and titles
- Control visibility and position

### Team Members Management
- Add, edit, and remove team member information
- Upload profile photos
- Add contact information and social links
- Control visibility

## API Endpoints

### Authentication
- `POST /api/auth/login` - Authenticate admin user

### Hero Images
- `GET /api/hero-images` - Retrieve all hero images
- `POST /api/hero-images` - Create a new hero image
- `PUT /api/hero-images/[id]` - Update a hero image
- `DELETE /api/hero-images/[id]` - Delete a hero image

### Team Members
- `GET /api/team-members` - Retrieve all team members
- `POST /api/team-members` - Create a new team member
- `PUT /api/team-members/[id]` - Update a team member
- `DELETE /api/team-members/[id]` - Delete a team member

## Security
- CSRF protection for all API requests
- Rate limiting to prevent abuse
- Input validation and sanitization
- JWT tokens with expiration
- Secure password handling

## Troubleshooting

### Common Issues
1. **Login fails**: Verify that your `.env.local` file contains the correct ADMIN_EMAIL and ADMIN_PASSWORD
2. **Database connection errors**: Check that your DATABASE_URL is correctly configured and the database server is running
3. **File upload errors**: Ensure that your server has sufficient storage and proper permissions for file uploads