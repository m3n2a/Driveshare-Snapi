import { NextResponse, NextRequest } from 'next/server';
import { DriveService } from '../../../../services/driveService';
import { handleApiError } from '../../../../utils/errors';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const stateUserId = searchParams.get('state');

    if (!code || !stateUserId) {
      return NextResponse.json({ error: 'Missing code or state parameter' }, { status: 400 });
    }

    // Exchange the code for tokens and save to Firestore
    await DriveService.handleCallback(code, stateUserId);

    // Redirect the user back to the frontend settings/dashboard page
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    return NextResponse.redirect(`${baseUrl}/dashboard?driveConnected=true`);
  } catch (error) {
    return handleApiError(error);
  }
}
