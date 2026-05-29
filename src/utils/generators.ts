import { nanoid } from 'nanoid';

/**
 * Generates a short, secure random code for sharing galleries.
 * Uses a custom alphabet to avoid ambiguous characters and profanity.
 * Example: 'AX92KD'
 */
export function generateShareCode(length = 6): string {
  // Using uppercase letters and numbers, excluding confusing characters (0, O, I, L, 1)
  const customAlphabet = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * customAlphabet.length);
    code += customAlphabet[randomIndex];
  }
  return code;
}

/**
 * Generates the full shareable URL based on the code.
 */
export function generateShareUrl(code: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return `${baseUrl}/join/${code}`;
}
