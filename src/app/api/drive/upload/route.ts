import { NextResponse } from 'next/server';
import { DriveService } from '../../../../services/driveService';
import { GalleryRepository } from '../../../../repositories/galleryRepository';
import { handleApiError, ApiError } from '../../../../utils/errors';
import { z } from 'zod';

const createUploadUrlSchema = z.object({
  galleryId: z.string().min(1),
  fileName: z.string().min(1),
  mimeType: z.string().min(1),
  fileSize: z.number().positive(),
});

export async function POST(request: Request) {
  try {
    const userId = request.headers.get('x-user-id') || 'mock-user-123';
    
    if (!userId) {
      throw new ApiError('Unauthorized', 401);
    }

    const body = await request.json();
    const result = createUploadUrlSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json({ error: 'Validation Error', details: result.error.format() }, { status: 400 });
    }

    const { galleryId, fileName, mimeType, fileSize } = result.data;
    const gallery = await GalleryRepository.getGalleryById(galleryId);

    if (!gallery) {
      throw new ApiError('Gallery not found', 404);
    }

    // TODO: Ensure user has permission to upload to this gallery (check gallery_members)

    // Get an authenticated drive client for the owner of the gallery
    const drive = await DriveService.getDriveClient(gallery.userId);
    
    // Generate Resumable Upload URL
    // We do a POST to https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable
    // using the googleapis client but capturing the Location header
    
    // Workaround to get resumable upload URL using the underlying Gaxios client
    const res = await drive.context._options.auth.request({
      url: 'https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable',
      method: 'POST',
      headers: {
        'X-Upload-Content-Type': mimeType,
        'X-Upload-Content-Length': fileSize.toString(),
        'Content-Type': 'application/json; charset=UTF-8',
      },
      data: {
        name: fileName,
        parents: [gallery.driveFolderId], // Upload into the gallery's Drive folder
      },
    });

    const uploadUrl = res.headers['location'];

    if (!uploadUrl) {
      throw new ApiError('Failed to generate upload URL from Google Drive', 500);
    }

    // Return the URL so the client can do a PUT request directly to it
    return NextResponse.json({ success: true, uploadUrl }, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}
