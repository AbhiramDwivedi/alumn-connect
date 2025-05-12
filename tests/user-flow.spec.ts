import { test, expect, Page } from '@playwright/test';
import { v4 as uuidv4 } from 'uuid';
import { saveTestCredentials, getTestCredentials } from './helpers/credentials';

// Store credentials for use across tests
let testUserEmail: string;
let testUserPassword: string;

test.describe('AlumnConnect User Flow', () => {
  test.beforeAll(async () => {
    // Check if we have existing credentials
    const existingCredentials = getTestCredentials();
    
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
      saveTestCredentials({ email: testUserEmail, password: testUserPassword });
    }
    
    console.log(`Test credentials: ${testUserEmail} / ${testUserPassword}`);
  });

  test('User registration flow', async ({ page }: { page: Page }) => {
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

  test('User login flow (pending approval)', async ({ page }: { page: Page }) => {
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
});
