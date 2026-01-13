import { NextRequest } from 'next/server';
import { executeQuery } from '@/lib/database';
import { saveUploadedFile } from '@/lib/fileUpload';
import { isAuthenticated } from '@/lib/authServer';

export async function GET(request: NextRequest) {
  // Verify authentication
  const authenticated = await isAuthenticated(request);
  if (!authenticated) {
    return new Response(
      JSON.stringify({ success: false, message: 'Authentication required' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Fetch all team members from the database
    const result = await executeQuery(`
      SELECT
        id,
        name,
        position,
        bio,
        photo_url as "photoUrl",
        email,
        phone,
        social_links as "socialLinks",
        is_active as "isActive",
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM team_members
      ORDER BY name ASC
    `);

    return new Response(
      JSON.stringify({
        success: true,
        data: result.rows
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('GET team members API error:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function POST(request: NextRequest) {
  // Verify authentication
  const authenticated = await isAuthenticated(request);
  if (!authenticated) {
    return new Response(
      JSON.stringify({ success: false, message: 'Authentication required' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Parse form data
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const position = formData.get('position') as string;
    const bio = formData.get('bio') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const twitter = formData.get('twitter') as string;
    const linkedin = formData.get('linkedin') as string;
    const facebook = formData.get('facebook') as string;
    const isActive = formData.get('isActive') as string;
    const photoFile = formData.get('photo') as File | null;

    // Validate required fields
    if (!name || !position || !bio) {
      return new Response(
        JSON.stringify({ success: false, message: 'Name, position, and bio are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    let photoUrl = '';
    if (photoFile) {
      // Save the uploaded photo file
      photoUrl = await saveUploadedFile(photoFile, 'public/images/team');
    }

    // Create social links object
    const socialLinks: Record<string, string> = {};
    if (twitter) socialLinks.twitter = twitter;
    if (linkedin) socialLinks.linkedin = linkedin;
    if (facebook) socialLinks.facebook = facebook;

    // Insert new team member into the database
    const result = await executeQuery(
      `INSERT INTO team_members (name, position, bio, photo_url, email, phone, social_links, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, name, position, bio, photo_url as "photoUrl", email, phone,
                 social_links as "socialLinks", is_active as "isActive",
                 created_at as "createdAt", updated_at as "updatedAt"`,
      [
        name,
        position,
        bio,
        photoUrl || null,
        email || null,
        phone || null,
        JSON.stringify(socialLinks) || null,
        isActive === 'true'
      ]
    );

    return new Response(
      JSON.stringify({
        success: true,
        data: result.rows[0]
      }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('POST team members API error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message || 'Internal server error'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}