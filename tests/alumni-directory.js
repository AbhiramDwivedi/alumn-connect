// @ts-nocheck
// Alumni directory tests for AlumnConnect

const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

// Path to the credentials file
const credentialsPath = path.join(process.cwd(), 'test-credentials.json');

// Helper function to read credentials
function readCredentials() {
  try {
    if (fs.existsSync(credentialsPath)) {
      const data = fs.readFileSync(credentialsPath, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading test credentials:', error);
  }
  return null;
}

// This test verifies the alumni directory functionality after a user has been approved
test.describe('Approved User Alumni Directory', () => {
  test.beforeEach(async ({ page }) => {
    // Go to the login page
    await page.goto('/login');
    
    // Get the test credentials from our helper
    const credentials = readCredentials();
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

  test('Alumni directory loads and displays alumni', async ({ page }) => {
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

  test('Alumni details are accessible', async ({ page }) => {
    // Locate and click on the first alumni card
    await page.locator('.alumni-card').first().click();
    
    // Verify the alumni details modal or page opens
    await expect(page.locator('.alumni-details')).toBeVisible();
    
    // Verify essential information is displayed
    await expect(page.locator('.alumni-details').getByText('Contact Information')).toBeVisible();
  });

  test('Verifies no error messages are displayed', async ({ page }) => {
    // Check if there are any error messages visible
    const errorMessage = page.getByText('Failed to load alumni');
    await expect(errorMessage).not.toBeVisible({ timeout: 15000 });
  });
});
