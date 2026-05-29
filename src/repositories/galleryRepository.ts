import { adminDb } from '../lib/firebase-admin';
import { Gallery } from '../models/types';

const COLLECTION_NAME = 'galleries';

export class GalleryRepository {
  static async createGallery(gallery: Gallery): Promise<Gallery> {
    await adminDb.collection(COLLECTION_NAME).doc(gallery.id).set(gallery);
    return gallery;
  }

  static async getGalleryById(id: string): Promise<Gallery | null> {
    const doc = await adminDb.collection(COLLECTION_NAME).doc(id).get();
    if (!doc.exists) return null;
    return doc.data() as Gallery;
  }

  static async getGalleryByShareCode(shareCode: string): Promise<Gallery | null> {
    const snapshot = await adminDb
      .collection(COLLECTION_NAME)
      .where('shareCode', '==', shareCode)
      .limit(1)
      .get();
      
    if (snapshot.empty) return null;
    return snapshot.docs[0].data() as Gallery;
  }

  static async updateGallery(id: string, data: Partial<Gallery>): Promise<void> {
    await adminDb.collection(COLLECTION_NAME).doc(id).update({
      ...data,
      updatedAt: Date.now(),
    });
  }

  static async deleteGallery(id: string): Promise<void> {
    await adminDb.collection(COLLECTION_NAME).doc(id).delete();
  }

  static async getGalleriesByUserId(userId: string): Promise<Gallery[]> {
    const snapshot = await adminDb
      .collection(COLLECTION_NAME)
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();
      
    return snapshot.docs.map(doc => doc.data() as Gallery);
  }
}
