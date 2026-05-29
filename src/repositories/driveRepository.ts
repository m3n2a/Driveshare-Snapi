import { adminDb } from '../lib/firebase-admin';
import { DriveConnection } from '../models/types';

const COLLECTION_NAME = 'drive_connections';

export class DriveRepository {
  static async saveConnection(connection: DriveConnection): Promise<void> {
    await adminDb.collection(COLLECTION_NAME).doc(connection.userId).set(connection);
  }

  static async getConnectionByUserId(userId: string): Promise<DriveConnection | null> {
    const doc = await adminDb.collection(COLLECTION_NAME).doc(userId).get();
    if (!doc.exists) return null;
    return doc.data() as DriveConnection;
  }

  static async updateTokens(userId: string, accessToken: string, refreshToken?: string, expiresAt?: number): Promise<void> {
    const updates: Partial<DriveConnection> = { accessToken };
    if (refreshToken) updates.refreshToken = refreshToken;
    if (expiresAt) updates.expiresAt = expiresAt;
    
    await adminDb.collection(COLLECTION_NAME).doc(userId).update(updates);
  }

  static async removeConnection(userId: string): Promise<void> {
    await adminDb.collection(COLLECTION_NAME).doc(userId).delete();
  }
}
