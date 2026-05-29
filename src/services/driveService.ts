import { google } from 'googleapis';
import { DriveRepository } from '../repositories/driveRepository';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback` // Redirect URI
);

export class DriveService {
  /**
   * Generates the OAuth URL for the user to authenticate.
   */
  static getAuthUrl(userId: string): string {
    return oauth2Client.generateAuthUrl({
      access_type: 'offline', // Required to get a refresh token
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/drive.file', // Allows creating/editing files created by the app
      ],
      state: userId, // Pass userId to link the connection later
      prompt: 'consent' // Force consent screen to always get a refresh token
    });
  }

  /**
   * Exchanges the auth code for tokens and saves them in Firestore.
   */
  static async handleCallback(code: string, userId: string): Promise<void> {
    const { tokens } = await oauth2Client.getToken(code);
    
    // Get user info to save googleAccountId
    oauth2Client.setCredentials(tokens);
    const oauth2 = google.oauth2({ auth: oauth2Client, version: 'v2' });
    const userInfo = await oauth2.userinfo.get();

    await DriveRepository.saveConnection({
      id: userId,
      userId: userId,
      googleAccountId: userInfo.data.id || '',
      accessToken: tokens.access_token || '',
      refreshToken: tokens.refresh_token || '',
      expiresAt: tokens.expiry_date || 0,
      connectedAt: Date.now(),
    });
  }

  /**
   * Helper to get an authenticated Drive instance for a user.
   */
  static async getDriveClient(userId: string) {
    const connection = await DriveRepository.getConnectionByUserId(userId);
    if (!connection) {
      throw new Error('User has no Drive connection');
    }

    const client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );

    client.setCredentials({
      access_token: connection.accessToken,
      refresh_token: connection.refreshToken,
      expiry_date: connection.expiresAt,
    });

    // Automatically handles token refresh on calls
    client.on('tokens', async (tokens) => {
      await DriveRepository.updateTokens(
        userId, 
        tokens.access_token || '', 
        tokens.refresh_token, 
        tokens.expiry_date
      );
    });

    return google.drive({ version: 'v3', auth: client });
  }

  /**
   * Creates a folder in Google Drive for a Gallery.
   */
  static async createGalleryFolder(userId: string, folderName: string): Promise<string> {
    const drive = await this.getDriveClient(userId);
    
    const fileMetadata = {
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
    };

    const file = await drive.files.create({
      requestBody: fileMetadata,
      fields: 'id',
    });

    return file.data.id || '';
  }

  /**
   * Shares a folder in Google Drive (Anyone with link can view).
   */
  static async makeFolderPublic(userId: string, folderId: string): Promise<void> {
    const drive = await this.getDriveClient(userId);
    await drive.permissions.create({
      fileId: folderId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });
  }
}
