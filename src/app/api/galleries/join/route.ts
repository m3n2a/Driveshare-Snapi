import { NextResponse } from 'next/server';
import { GalleryService } from '../../../../services/galleryService';
import { handleApiError, ApiError } from '../../../../utils/errors';
import { adminDb } from '../../../../lib/firebase-admin';
import { GalleryMember } from '../../../../models/types';
import { nanoid } from 'nanoid';
import { z } from 'zod';

const joinGallerySchema = z.object({
  shareCode: z.string().min(1, 'Share code is required'),
});

export async function POST(request: Request) {
  try {
    const userId = request.headers.get('x-user-id') || 'mock-user-123';
    
    if (!userId) {
      throw new ApiError('Unauthorized', 401);
    }

    const body = await request.json();
    const result = joinGallerySchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json({ error: 'Validation Error', details: result.error.format() }, { status: 400 });
    }

    const { shareCode } = result.data;
    const gallery = await GalleryService.getGalleryByCode(shareCode);

    if (!gallery) {
      throw new ApiError('Gallery not found or invalid link', 404);
    }

    // Check if user is already a member
    const existingMemberQuery = await adminDb
      .collection('gallery_members')
      .where('galleryId', '==', gallery.id)
      .where('userId', '==', userId)
      .limit(1)
      .get();

    if (!existingMemberQuery.empty) {
      return NextResponse.json({ success: true, message: 'Already a member', galleryId: gallery.id }, { status: 200 });
    }

    // Create a new member record
    const member: GalleryMember = {
      id: nanoid(12),
      galleryId: gallery.id,
      userId,
      role: 'contributor', // By default, users joining via link can contribute (configurable)
      joinedAt: Date.now(),
    };

    await adminDb.collection('gallery_members').doc(member.id).set(member);

    return NextResponse.json({ success: true, message: 'Joined successfully', galleryId: gallery.id }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
