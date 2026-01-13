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
    // Fetch all hero images from the database
    const result = await executeQuery(`
      SELECT
        id,
        title,
        image_url as "imageUrl",
        alt_text as "altText",
        caption,
        position,
        is_active as "isActive",
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM hero_images
      ORDER BY position ASC
    `);

    return new Response(
      JSON.stringify({
        success: true,
        data: result.rows
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('GET hero images API error:', error);
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
    const title = formData.get('title') as string;
    const altText = formData.get('altText') as string;
    const caption = formData.get('caption') as string;
    const position = formData.get('position') as string;
    const isActive = formData.get('isActive') as string;
    const imageFile = formData.get('image') as File | null;

    // Validate required fields
    if (!altText) {
      return new Response(
        JSON.stringify({ success: false, message: 'Alt text is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    let imageUrl = '';
    if (imageFile) {
      // Save the uploaded image file
      imageUrl = await saveUploadedFile(imageFile);
    }

    // Insert new hero image into the database
    const result = await executeQuery(
      `INSERT INTO hero_images (title, image_url, alt_text, caption, position, is_active)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, title, image_url as "imageUrl", alt_text as "altText",
                 caption, position, is_active as "isActive", created_at as "createdAt",
                 updated_at as "updatedAt"`,
      [
        title || null,
        imageUrl,
        altText,
        caption || null,
        position ? parseInt(position) : 0,
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
    console.error('POST hero images API error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message || 'Internal server error'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

