import crypto from 'crypto';

/**
 * Generates a code verifier for PKCE authentication
 * @returns A random string between 43-128 characters long
 */
export function generateCodeVerifier(): string {
  // Generate a random string between 43-128 characters
  const length = Math.floor(Math.random() * (128 - 43 + 1)) + 43;
  const randomBytes = crypto.randomBytes(length);
  return randomBytes.toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

/**
 * Generates a code challenge from a code verifier for PKCE
 * @param codeVerifier The code verifier to generate a challenge from, or generates a new one if not provided
 * @returns The code challenge string
 */
export function generateCodeChallenge(codeVerifier?: string): string {
  const verifier = codeVerifier || generateCodeVerifier();
  
  // Store the verifier in global context for server components or localStorage for client components
  if (typeof window !== 'undefined') {
    localStorage.setItem('pkce_code_verifier', verifier);
  } else {
    // For server components
    global.pkce_code_verifier = verifier;
  }
  
  // Generate challenge using SHA-256
  const challenge = crypto
    .createHash('sha256')
    .update(verifier)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
    
  return challenge;
}

/**
 * Retrieves the stored code verifier
 * @returns The stored code verifier or null if not found
 */
export function getCodeVerifier(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('pkce_code_verifier');
  } else {
    return global.pkce_code_verifier || null;
  }
}

/**
 * Generates a unique device ID for tracking user devices
 * @returns A unique device identifier
 */
export function generateDeviceId(): string {
  return crypto.randomUUID();
}

/**
 * Gets or creates a device ID from localStorage
 * @returns The device ID
 */
export function getOrCreateDeviceId(): string {
  if (typeof window !== 'undefined') {
    let deviceId = localStorage.getItem('device_id');
    if (!deviceId) {
      deviceId = generateDeviceId();
      localStorage.setItem('device_id', deviceId);
    }
    return deviceId;
  }
  return generateDeviceId(); // Fallback for server
}