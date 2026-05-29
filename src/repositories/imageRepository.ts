import { adminDb } from '../lib/firebase-admin';
import { Image } from '../models/types';

const COLLECTION_NAME = 'images';

export class ImageRepository {
  static async createImage(image: Image): Promise<Image> {
    await adminDb.collection(COLLECTION_NAME).doc(image.id).set(image);
    return image;
  }

  static async getImageById(id: string): Promise<Image | null> {
    const doc = await adminDb.collection(COLLECTION_NAME).doc(id).get();
    if (!doc.exists) return null;
    return doc.data() as Image;
  }

  static async getImagesByGalleryId(galleryId: string): Promise<Image[]> {
    const snapshot = await adminDb
      .collection(COLLECTION_NAME)
      .where('galleryId', '==', galleryId)
      .orderBy('uploadedAt', 'desc')
      .get();
      
    return snapshot.docs.map(doc => doc.data() as Image);
  }

  static async deleteImage(id: string): Promise<void> {
    await adminDb.collection(COLLECTION_NAME).doc(id).delete();
  }
}
