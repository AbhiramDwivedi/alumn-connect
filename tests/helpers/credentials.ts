import fs from 'fs';
import path from 'path';

export interface TestCredentials {
  email: string;
  password: string;
}

const credentialsPath = path.join(process.cwd(), 'test-credentials.json');

export function saveTestCredentials(credentials: TestCredentials): void {
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

export function getTestCredentials(): TestCredentials | null {
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
