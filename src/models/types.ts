export type Visibility = 'public' | 'private' | 'shared' | 'invite_only';
export type Role = 'owner' | 'contributor' | 'viewer';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface DriveConnection {
  id: string;
  userId: string;
  googleAccountId: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  connectedAt: number;
}

export interface Gallery {
  id: string;
  userId: string; // The owner
  driveFolderId: string; // The folder in Google Drive
  title: string;
  description?: string;
  coverImage?: string;
  visibility: Visibility;
  shareCode: string;
  shareUrl: string;
  createdAt: number;
  updatedAt: number;
}

export interface Image {
  id: string;
  galleryId: string;
  driveFileId: string;
  driveFileUrl: string; // webViewLink or similar
  thumbnailUrl?: string; // Optional generated thumbnail URL
  fileName: string;
  mimeType: string;
  uploadedAt: number;
  metadata?: {
    size?: number;
    width?: number;
    height?: number;
  };
}

export interface GalleryMember {
  id: string;
  galleryId: string;
  userId: string;
  role: Role;
  joinedAt: number;
}
