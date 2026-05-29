import { adminDb } from '../lib/firebase-admin';
import { User } from '../models/types';

const COLLECTION_NAME = 'users';

export class UserRepository {
  static async createUser(user: User): Promise<User> {
    await adminDb.collection(COLLECTION_NAME).doc(user.id).set(user);
    return user;
  }

  static async getUserById(id: string): Promise<User | null> {
    const doc = await adminDb.collection(COLLECTION_NAME).doc(id).get();
    if (!doc.exists) return null;
    return doc.data() as User;
  }

  static async updateUser(id: string, data: Partial<User>): Promise<void> {
    await adminDb.collection(COLLECTION_NAME).doc(id).update(data);
  }
}
