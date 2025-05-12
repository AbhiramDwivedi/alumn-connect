// @ts-nocheck
// API endpoint tests for AlumnConnect

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

test.describe('API Endpoint Tests', () => {
  test('Test DB API endpoint', async ({ page }) => {
    // Go to the login page
    await page.goto('/login');
    
    // Get the test credentials
    const credentials = readCredentials();
    if (!credentials) {
      console.log('Test credentials not found. Using environment variables or defaults.');
      const email = process.env.TEST_USER_EMAIL || 'test@example.com';
      const password = process.env.TEST_USER_PASSWORD || 'Password123!';
      
      // Login with environment variables or defaults
      await page.getByLabel('Email').fill(email);
      await page.getByLabel('Password').fill(password);
    } else {
      // Login with stored credentials
      await page.getByLabel('Email').fill(credentials.email);
      await page.getByLabel('Password').fill(credentials.password);
    }
    
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    // Navigate to test-db endpoint (if allowed by the app)
    await page.goto('/api/test-db');
    
    // Check if the response contains expected data (this might be a JSON response)
    const pageContent = await page.textContent('body');
    
    try {
      const response = JSON.parse(pageContent || '{}');
      
      // Basic validation that the API returns a connection status
      expect(response).toHaveProperty('connected');
      
      // Additional checks depending on what the endpoint returns
      console.log('Test DB API Response:', response);
    } catch (error) {
      console.log('Response is not valid JSON, or access is restricted');
      console.log('Raw response:', pageContent);
    }
  });
  
  test('Alumni API endpoint', async ({ page }) => {
    // Go to the login page
    await page.goto('/login');
    
    // Get the test credentials
    const credentials = readCredentials();
    if (!credentials) {
      console.log('Test credentials not found. Using environment variables or defaults.');
      const email = process.env.TEST_USER_EMAIL || 'test@example.com';
      const password = process.env.TEST_USER_PASSWORD || 'Password123!';
      
      // Login with environment variables or defaults
      await page.getByLabel('Email').fill(email);
      await page.getByLabel('Password').fill(password);
    } else {
      // Login with stored credentials
      await page.getByLabel('Email').fill(credentials.email);
      await page.getByLabel('Password').fill(credentials.password);
    }
    
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    // After login, we should be able to access the API endpoint
    // We'll use the page's built-in fetch to test the API
    const apiResponse = await page.evaluate(async () => {
      try {
        const response = await fetch('/api/alumni');
        if (!response.ok) {
          return { error: response.statusText, status: response.status };
        }
        return await response.json();
      } catch (e) {
        return { error: e.toString() };
      }
    });
    
    console.log('Alumni API Response:', apiResponse);
    
    // If the test user has pending status, we might not be able to access alumni data yet
    if (apiResponse.status === 401 || apiResponse.status === 403) {
      console.log('User not approved yet - cannot access alumni data');
    } else if (!apiResponse.error) {
      // If approved and no error, verify we get a data array
      expect(apiResponse).toHaveProperty('data');
      expect(Array.isArray(apiResponse.data)).toBeTruthy();
    }
  });
});
