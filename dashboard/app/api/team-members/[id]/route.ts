import { NextRequest } from 'next/server';
import { executeQuery } from '@/lib/database';
import { saveUploadedFile } from '@/lib/fileUpload';
import { isAuthenticated } from '@/lib/authServer';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  // Verify authentication
  const authenticated = await isAuthenticated(request);
  if (!authenticated) {
    return new Response(
      JSON.stringify({ success: false, message: 'Authentication required' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const { id } = await params;  // Await the params promise

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

    // Update team member in the database
    let result;
    if (photoFile) {
      // If there's a new photo, update with the new photo URL
      result = await executeQuery(
        `UPDATE team_members
         SET name = $1, position = $2, bio = $3, photo_url = $4, email = $5,
             phone = $6, social_links = $7, is_active = $8, updated_at = CURRENT_TIMESTAMP
         WHERE id = $9
         RETURNING id, name, position, bio, photo_url as "photoUrl", email, phone,
                   social_links as "socialLinks", is_active as "isActive",
                   created_at as "createdAt", updated_at as "updatedAt"`,
        [
          name,
          position,
          bio,
          photoUrl,
          email || null,
          phone || null,
          JSON.stringify(socialLinks),
          isActive === 'true',
          id
        ]
      );
    } else {
      // If no new photo, don't update the photo URL
      result = await executeQuery(
        `UPDATE team_members
         SET name = $1, position = $2, bio = $3, email = $4,
             phone = $5, social_links = $6, is_active = $7, updated_at = CURRENT_TIMESTAMP
         WHERE id = $8
         RETURNING id, name, position, bio, photo_url as "photoUrl", email, phone,
                   social_links as "socialLinks", is_active as "isActive",
                   created_at as "createdAt", updated_at as "updatedAt"`,
        [
          name,
          position,
          bio,
          email || null,
          phone || null,
          JSON.stringify(socialLinks),
          isActive === 'true',
          id
        ]
      );
    }

    if (result.rowCount === 0) {
      return new Response(
        JSON.stringify({ success: false, message: 'Team member not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: result.rows[0]
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('PUT team members API error:', error);
    return new Response(
      JSON.stringify({ success: false, message: error.message || 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  // Verify authentication
  const authenticated = await isAuthenticated(request);
  if (!authenticated) {
    return new Response(
      JSON.stringify({ success: false, message: 'Authentication required' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const { id } = await params;  // Await the params promise

    // Delete team member from the database
    const result = await executeQuery(
      'DELETE FROM team_members WHERE id = $1',
      [id]
    );

    if (result.rowCount === 0) {
      return new Response(
        JSON.stringify({ success: false, message: 'Team member not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Team member deleted successfully'
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('DELETE team members API error:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}