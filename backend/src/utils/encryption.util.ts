import * as crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;
const PREFIX = 'enc';

/**
 * Utility to encrypt and decrypt sensitive strings using AES-256-GCM.
 * format: enc:iv:authTag:encryptedContent
 */
export class EncryptionUtil {
  private static getKey(): Buffer {
    const secret = process.env.ENCRYPTION_KEY || process.env.JWT_SECRET || 'fallback-secret-at-least-32-chars-long';
    // Ensure key is exactly 32 bytes for aes-256
    return crypto.createHash('sha256').update(String(secret)).digest();
  }

  static encrypt(text: string): string {
    if (!text) return '';
    
    const iv = crypto.randomBytes(IV_LENGTH);
    const key = this.getKey();
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    
    const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
    const authTag = cipher.getAuthTag();
    
    // Return formatted string
    return [
      PREFIX,
      iv.toString('hex'),
      authTag.toString('hex'),
      encrypted.toString('hex')
    ].join(':');
  }

  static decrypt(content: string | null | undefined): string {
    if (!content || !content.startsWith(PREFIX)) {
      return content || '';
    }

    try {
      // Split and filter out empty strings between colons if needed, 
      // but primarily we handle the 4 or 5 parts case.
      let parts = content.split(':');
      
      // If we have enc::iv:tag:content (5 parts due to old PREFIX='enc:'), 
      // we remove the empty part at index 1.
      if (parts.length === 5 && parts[1] === '') {
        parts.splice(1, 1);
      }

      if (parts.length !== 4) return content;

      const [, ivHex, authTagHex, encryptedHex] = parts;
      const iv = Buffer.from(ivHex, 'hex');
      const authTag = Buffer.from(authTagHex, 'hex');
      const encrypted = Buffer.from(encryptedHex, 'hex');
      
      const key = this.getKey();
      const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
      decipher.setAuthTag(authTag);
      
      const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]).toString('utf8');
      
      // Recursive Decryption: If the result is still encrypted, decrypt again
      if (this.isEncrypted(decrypted)) {
        return this.decrypt(decrypted);
      }
      
      return decrypted;
    } catch (error) {
      console.error('EncryptionUtil: Decryption failed', error);
      return content;
    }
  }

  static isEncrypted(content: string): boolean {
    return !!content && content.startsWith(PREFIX);
  }
}
