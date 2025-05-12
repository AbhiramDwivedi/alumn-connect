// @ts-nocheck
// Admin approval test for AlumnConnect

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

test.describe('Admin Approval Flow', () => {
  test('Admin can approve a test user', async ({ page }) => {
    // Read test credentials from file if available
    const credentials = readCredentials();
    const testUserEmail = credentials?.email || 
                        process.env.TEST_USER_EMAIL || 
                        'Your test user email here';

    // Go to the login page
    await page.goto('/login');
    
    console.log(`Admin test: please approve user with email ${testUserEmail}`);
    console.log('Please login with admin credentials when the login page appears');
    
    // Wait for admin to manually login
    await page.waitForTimeout(10000); // Give admin time to login
    
    // Navigate to diagnostic page (assuming admin is logged in)
    await page.goto('/diagnostic');
    
    // Verify diagnostic page loads
    await expect(page.getByText('API and Database Diagnostics')).toBeVisible();
    
    console.log('Manual steps for admin:');
    console.log(`1. Check if user with email ${testUserEmail} is in the list`);
    console.log('2. Click "Approve" button next to the user');
    console.log('3. Verify the user status changes to "approved"');
    
    // Wait for admin to complete approval
    await page.waitForTimeout(30000); // Give admin time to approve the user
  });
});
