import { NextResponse } from 'next/server';
import { GalleryService } from '../../../../services/galleryService';
import { handleApiError, ApiError } from '../../../../utils/errors';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ shareCode: string }> }
) {
  try {
    const { shareCode } = await params;
    const gallery = await GalleryService.getGalleryByCode(shareCode);

    if (!gallery) {
      throw new ApiError('Gallery not found or invalid link', 404);
    }

    // Only return public-safe information before they join
    const publicGalleryInfo = {
      id: gallery.id,
      title: gallery.title,
      description: gallery.description,
      coverImage: gallery.coverImage,
      ownerId: gallery.userId,
      visibility: gallery.visibility,
    };

    return NextResponse.json({ success: true, gallery: publicGalleryInfo }, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}
