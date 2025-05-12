import { test, expect, Page } from '@playwright/test';
import { getTestCredentials } from './helpers/credentials';

// This test verifies the alumni directory functionality after a user has been approved
test.describe('Approved User Alumni Directory', () => {
  test.beforeEach(async ({ page }: { page: Page }) => {
    // Go to the login page
    await page.goto('/login');
    
    // Get the test credentials from our helper
    const credentials = getTestCredentials();
    const email = credentials ? credentials.email : (process.env.TEST_USER_EMAIL || 'your-approved-test-user@example.com');
    const password = credentials ? credentials.password : (process.env.TEST_USER_PASSWORD || 'YourPassword123!');
    
    console.log(`Logging in with: ${email}`);
    
    // Fill out the login form
    await page.getByLabel('Email').fill(email);
    await page.getByLabel('Password').fill(password);
    
    // Submit the form
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    // Wait for navigation to complete
    await page.waitForURL('**/directory', { timeout: 15000 }).catch(() => {
      console.log('Navigation to directory not completed - user may still be pending approval');
    });
  });

  test('Alumni directory loads and displays alumni', async ({ page }: { page: Page }) => {
    // Verify the directory page loads
    await expect(page.getByText('Alumni Directory')).toBeVisible();
    
    // Verify that alumni entries are displayed (assuming at least one)
    await expect(page.locator('.alumni-card').first()).toBeVisible({ timeout: 15000 });
    
    // Test the search functionality
    const searchInput = page.getByPlaceholder('Search by name or profession');
    await searchInput.fill('a');  // Generic search term likely to return results
    
    // Wait for search results to update
    await page.waitForTimeout(1000);
    
    // Verify that some results are displayed
    await expect(page.locator('.alumni-card').first()).toBeVisible();
  });

  test('Verifies no error messages are displayed', async ({ page }: { page: Page }) => {
    // Check if there are any error messages visible
    const errorMessage = page.getByText('Failed to load alumni');
    await expect(errorMessage).not.toBeVisible({ timeout: 15000 });
  });
});
