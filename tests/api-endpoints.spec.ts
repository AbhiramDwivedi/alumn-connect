import { test, expect, Page } from '@playwright/test';
import { getTestCredentials } from './helpers/credentials';

test.describe('API Endpoint Tests', () => {
  test('Test DB API endpoint', async ({ page }: { page: Page }) => {
    // Go to the login page
    await page.goto('/login');
    
    // Get the test credentials
    const credentials = getTestCredentials();
    if (!credentials) {
      throw new Error('Test credentials not found. Run the registration test first.');
    }
    
    // Login
    await page.getByLabel('Email').fill(credentials.email);
    await page.getByLabel('Password').fill(credentials.password);
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    // Navigate to test-db endpoint (if allowed by the app)
    await page.goto('/api/test-db');
    
    // Check if the response contains expected data (this might be a JSON response)
    const pageContent = await page.textContent('body');
    const response = JSON.parse(pageContent || '{}');
    
    // Basic validation that the API returns a connection status
    expect(response).toHaveProperty('connected');
    
    // Additional checks depending on what the endpoint returns
    console.log('Test DB API Response:', response);
  });
  
  test('Alumni API endpoint', async ({ page }: { page: Page }) => {
    // Go to the login page
    await page.goto('/login');
    
    // Get the test credentials
    const credentials = getTestCredentials();
    if (!credentials) {
      throw new Error('Test credentials not found. Run the registration test first.');
    }
    
    // Login
    await page.getByLabel('Email').fill(credentials.email);
    await page.getByLabel('Password').fill(credentials.password);
    await page.getByRole('button', { name: 'Sign In' }).click();
      // After login, we should be able to access the API endpoint
    // We'll use the page's built-in fetch to test the API
    const apiResponse = await page.evaluate(async () => {
      const response = await fetch('/api/alumni');
      if (!response.ok) {
        return { error: response.statusText, status: response.status };
      }
      return await response.json();
    });
    
    console.log('Alumni API Response:', apiResponse);
    
    // Verify we don't get an error response
    expect(apiResponse).not.toHaveProperty('error');
    
    // Type guard for the response
    interface ApiResponse {
      status?: number;
      data?: unknown[];
      error?: string;
    }
    
    // Cast the response to our expected type
    const typedResponse = apiResponse as ApiResponse;
    
    // If the test user has pending status, we might not be able to access alumni data yet
    // In that case, check for an appropriate status or message
    if (typedResponse.status === 401 || typedResponse.status === 403) {
      console.log('User not approved yet - cannot access alumni data');
    } else {
      // If approved, verify we get a data array
      expect(typedResponse).toHaveProperty('data');
      if (typedResponse.data) {
        expect(Array.isArray(typedResponse.data)).toBeTruthy();
      }
    }
  });
});
