// Helper functions for credential management in tests
import fs from 'fs';
import path from 'path';

// Define the structure of our test credentials
interface TestCredentials {
  email: string;
  password: string;
}

// Path to the credentials file
const credentialsPath = path.join(process.cwd(), 'test-credentials.json');

/**
 * Save test credentials to a file
 */
export function saveCredentials(email: string, password: string): void {
  const credentials: TestCredentials = { email, password };
  try {
    fs.writeFileSync(
      credentialsPath,
      JSON.stringify(credentials, null, 2),
      'utf8'
    );
    console.log(`Test credentials saved to ${credentialsPath}`);
  } catch (error) {
    console.error('Error saving test credentials:', error);
  }
}

/**
 * Read test credentials from file
 */
export function readCredentials(): TestCredentials | null {
  try {
    if (fs.existsSync(credentialsPath)) {
      const data = fs.readFileSync(credentialsPath, 'utf8');
      return JSON.parse(data) as TestCredentials;
    }
  } catch (error) {
    console.error('Error reading test credentials:', error);
  }
  return null;
}
