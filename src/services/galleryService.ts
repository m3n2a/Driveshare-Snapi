import { GalleryRepository } from '../repositories/galleryRepository';
import { DriveService } from './driveService';
import { Gallery, Visibility } from '../models/types';
import { generateShareCode, generateShareUrl } from '../utils/generators';
import { nanoid } from 'nanoid';

export class GalleryService {
  /**
   * Creates a new gallery, provisions a Google Drive folder, and saves metadata in Firestore.
   */
  static async createGallery(
    userId: string,
    title: string,
    description: string = '',
    visibility: Visibility = 'invite_only'
  ): Promise<Gallery> {
    
    // 1. Create a folder in the user's Google Drive
    const driveFolderId = await DriveService.createGalleryFolder(userId, `DriveShare - ${title}`);

    // 2. Adjust Drive permissions if the gallery is public
    if (visibility === 'public') {
      await DriveService.makeFolderPublic(userId, driveFolderId);
    }

    // 3. Generate sharing identifiers
    const shareCode = generateShareCode();
    const shareUrl = generateShareUrl(shareCode);
    const galleryId = nanoid(10); // Standard ID for Firestore

    // 4. Construct Gallery object
    const gallery: Gallery = {
      id: galleryId,
      userId,
      driveFolderId,
      title,
      description,
      visibility,
      shareCode,
      shareUrl,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    // 5. Save to Firestore
    await GalleryRepository.createGallery(gallery);

    // Note: We might also want to save the `driveFolderId` in the Gallery model 
    // to map the Firestore gallery to the Drive folder later! Let's update the Gallery model next.

    return gallery;
  }

  static async getGallery(galleryId: string): Promise<Gallery | null> {
    return GalleryRepository.getGalleryById(galleryId);
  }

  static async getGalleryByCode(shareCode: string): Promise<Gallery | null> {
    return GalleryRepository.getGalleryByShareCode(shareCode);
  }
}
