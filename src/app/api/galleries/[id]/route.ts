import { NextResponse } from 'next/server';
import { GalleryRepository } from '../../../../repositories/galleryRepository';
import { handleApiError, ApiError } from '../../../../utils/errors';
import { z } from 'zod';

const updateGallerySchema = z.object({
  title: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  visibility: z.enum(['public', 'private', 'shared', 'invite_only']).optional(),
  coverImage: z.string().url().optional(),
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const gallery = await GalleryRepository.getGalleryById(id);

    if (!gallery) {
      throw new ApiError('Gallery not found', 404);
    }

    // In a real app, check if user has permission to read based on visibility & gallery_members

    return NextResponse.json({ success: true, gallery }, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = request.headers.get('x-user-id') || 'mock-user-123';
    
    const gallery = await GalleryRepository.getGalleryById(id);
    if (!gallery) {
      throw new ApiError('Gallery not found', 404);
    }
    
    // Ensure only owner can update
    if (gallery.userId !== userId) {
      throw new ApiError('Forbidden', 403);
    }

    const body = await request.json();
    const result = updateGallerySchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json({ error: 'Validation Error', details: result.error.format() }, { status: 400 });
    }

    await GalleryRepository.updateGallery(id, result.data);
    
    const updatedGallery = await GalleryRepository.getGalleryById(id);
    return NextResponse.json({ success: true, gallery: updatedGallery }, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = request.headers.get('x-user-id') || 'mock-user-123';
    
    const gallery = await GalleryRepository.getGalleryById(id);
    if (!gallery) {
      throw new ApiError('Gallery not found', 404);
    }
    
    if (gallery.userId !== userId) {
      throw new ApiError('Forbidden', 403);
    }

    // TODO: Optionally delete the corresponding Drive folder or move it to trash
    // await DriveService.deleteFolder(userId, gallery.driveFolderId);

    await GalleryRepository.deleteGallery(id);
    
    return NextResponse.json({ success: true, message: 'Gallery deleted successfully' }, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}
