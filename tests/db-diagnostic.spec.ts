import { test, expect, Page } from '@playwright/test';
import { getTestCredentials } from './helpers/credentials';

test.describe('API Diagnostics Tests', () => {
  test('Test DB API diagnostic endpoint', async ({ page }: { page: Page }) => {
    // Go to the login page
    await page.goto('/login');
    
    // Get the test credentials from file or environment variables
    const credentials = getTestCredentials();
    let email = process.env.TEST_USER_EMAIL || 'test@example.com';
    let password = process.env.TEST_USER_PASSWORD || 'TestPassword123!';
    
    if (credentials) {
      email = credentials.email;
      password = credentials.password;
      console.log(`Using stored credentials for: ${email}`);
    } else {
      console.log('Using environment variable or default credentials');
    }
    
    // Login with credentials
    await page.getByLabel('Email').fill(email);
    await page.getByLabel('Password').fill(password);
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    // After login, navigate to the diagnostic page
    await page.goto('/diagnostic');
    
    // Verify the diagnostic page loads
    await expect(page.getByText('API and Database Diagnostics')).toBeVisible({ timeout: 10000 });
    
    // Test that the DB connection test button works
    const testDbButton = page.getByRole('button', { name: /Test Database Connection/i });
    await expect(testDbButton).toBeVisible();
      // Click the button to test DB connection
    await testDbButton.click();
    
    // Wait for the result to appear and check it
    await expect(page.getByText('Database connection:')).toBeVisible({ timeout: 5000 });
    
    // Log the result
    const connectionStatus = await page.getByText('Database connection:').textContent();
    console.log('Database connection status:', connectionStatus);
  });
});
