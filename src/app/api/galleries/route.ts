import { NextResponse } from 'next/server';
import { GalleryService } from '../../../services/galleryService';
import { GalleryRepository } from '../../../repositories/galleryRepository';
import { handleApiError, ApiError } from '../../../utils/errors';
import { z } from 'zod';

// Schema for request validation
const createGallerySchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().max(500).optional(),
  visibility: z.enum(['public', 'private', 'shared', 'invite_only']).default('invite_only'),
});

export async function POST(request: Request) {
  try {
    // TODO: In a real app, extract userId from the authenticated session (e.g., next-auth)
    // For now, we assume a header or mock user ID for testing purposes
    const userId = request.headers.get('x-user-id') || 'mock-user-123';

    if (!userId) {
      throw new ApiError('Unauthorized', 401);
    }

    const body = await request.json();
    
    // Validate request body
    const result = createGallerySchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: 'Validation Error', details: result.error.format() }, { status: 400 });
    }

    const { title, description, visibility } = result.data;

    // Create the gallery (provisions Drive folder & Firestore metadata)
    const gallery = await GalleryService.createGallery(userId, title, description, visibility);

    return NextResponse.json({ success: true, gallery }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function GET(request: Request) {
  try {
    // TODO: Extract userId from authenticated session
    const userId = request.headers.get('x-user-id') || 'mock-user-123';

    if (!userId) {
      throw new ApiError('Unauthorized', 401);
    }

    const galleries = await GalleryRepository.getGalleriesByUserId(userId);

    return NextResponse.json({ success: true, galleries }, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}
