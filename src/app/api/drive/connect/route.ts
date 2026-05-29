import { NextResponse } from 'next/server';
import { DriveService } from '../../../../services/driveService';
import { handleApiError, ApiError } from '../../../../utils/errors';

export async function POST(request: Request) {
  try {
    const userId = request.headers.get('x-user-id') || 'mock-user-123';
    
    if (!userId) {
      throw new ApiError('Unauthorized', 401);
    }

    const authUrl = DriveService.getAuthUrl(userId);
    
    return NextResponse.json({ success: true, authUrl }, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}
