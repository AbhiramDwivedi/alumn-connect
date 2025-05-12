// @ts-nocheck
// User flow tests for AlumnConnect

const { test, expect } = require('@playwright/test');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

// Store credentials for use across tests
let testUserEmail;
let testUserPassword;

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

// Helper function to save credentials
function saveCredentials(email, password) {
  try {
    fs.writeFileSync(
      credentialsPath,
      JSON.stringify({ email, password }, null, 2),
      'utf8'
    );
    console.log(`Test credentials saved to ${credentialsPath}`);
  } catch (error) {
    console.error('Error saving test credentials:', error);
  }
}

test.describe('AlumnConnect User Flow', () => {
  test.beforeAll(async () => {
    // Check if we have existing credentials
    const existingCredentials = readCredentials();
    
    if (existingCredentials) {
      console.log('Using existing test credentials');
      testUserEmail = existingCredentials.email;
      testUserPassword = existingCredentials.password;
    } else {
      // Generate a unique email for testing
      const uniqueId = uuidv4().substring(0, 8);
      testUserEmail = `test-user-${uniqueId}@example.com`;
      testUserPassword = `Password123!${uniqueId}`;
      
      // Save the new credentials
      saveCredentials(testUserEmail, testUserPassword);
    }
    
    console.log(`Test credentials: ${testUserEmail} / ${testUserPassword}`);
  });

  test('User registration flow', async ({ page }) => {
    // Go to the homepage
    await page.goto('/');
    
    // Navigate to the registration page
    await page.getByRole('link', { name: 'Sign Up' }).click();
    
    // Fill out the registration form
    await page.getByLabel('Name').fill('Test User');
    await page.getByLabel('Email').fill(testUserEmail);
    await page.getByLabel('Password').fill(testUserPassword);
    
    // Submit the form
    await page.getByRole('button', { name: 'Sign Up' }).click();
    
    // Verify the registration was successful
    await expect(page.getByText('Registration successful')).toBeVisible({ timeout: 10000 });
    
    console.log(`Test user created with email: ${testUserEmail} and password: ${testUserPassword}`);
  });

  test('User login flow (pending approval)', async ({ page }) => {
    // Go to the login page
    await page.goto('/login');
    
    // Fill out the login form with previously created test user
    await page.getByLabel('Email').fill(testUserEmail);
    await page.getByLabel('Password').fill(testUserPassword);
    
    // Submit the form
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    // Verify that login shows pending approval status
    await expect(page.getByText('Your account is pending approval')).toBeVisible({ timeout: 10000 });
  });

  test('Admin approval diagnostic page', async ({ page }) => {
    // Navigate to the diagnostic page (requires admin login, this will be manual)
    await page.goto('/diagnostic');
    
    // Check if diagnostic page loads 
    await expect(page.getByText('API and Database Diagnostics')).toBeVisible();
    
    // The rest would require admin login, which is manual
    console.log('Manual step required: Login as admin and approve the test user with email:', testUserEmail);
  });
});
