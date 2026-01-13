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

    // Update hero image in the database
    let result;
    if (imageFile) {
      // If there's a new image, update with the new image URL
      result = await executeQuery(
        `UPDATE hero_images
         SET title = $1, image_url = $2, alt_text = $3, caption = $4,
             position = $5, is_active = $6, updated_at = CURRENT_TIMESTAMP
         WHERE id = $7
         RETURNING id, title, image_url as "imageUrl", alt_text as "altText",
                   caption, position, is_active as "isActive", created_at as "createdAt",
                   updated_at as "updatedAt"`,
        [
          title || null,
          imageUrl,
          altText,
          caption || null,
          position ? parseInt(position) : 0,
          isActive === 'true',
          id
        ]
      );
    } else {
      // If no new image, don't update the image URL
      result = await executeQuery(
        `UPDATE hero_images
         SET title = $1, alt_text = $2, caption = $3,
             position = $4, is_active = $5, updated_at = CURRENT_TIMESTAMP
         WHERE id = $6
         RETURNING id, title, image_url as "imageUrl", alt_text as "altText",
                   caption, position, is_active as "isActive", created_at as "createdAt",
                   updated_at as "updatedAt"`,
        [
          title || null,
          altText,
          caption || null,
          position ? parseInt(position) : 0,
          isActive === 'true',
          id
        ]
      );
    }

    if (result.rowCount === 0) {
      return new Response(
        JSON.stringify({ success: false, message: 'Hero image not found' }),
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
    console.error('PUT hero images API error:', error);
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

    // Delete hero image from the database
    const result = await executeQuery(
      'DELETE FROM hero_images WHERE id = $1',
      [id]
    );

    if (result.rowCount === 0) {
      return new Response(
        JSON.stringify({ success: false, message: 'Hero image not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Hero image deleted successfully'
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('DELETE hero images API error:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}