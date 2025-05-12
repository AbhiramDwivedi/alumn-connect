# AlumnConnect Testing Guide

This document provides instructions for running the automated tests for the AlumnConnect application.

## Prerequisites

- Node.js (18.x or later)
- npm 
- A running instance of the AlumnConnect application

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Install Playwright browsers:
   ```bash
   npx playwright install --with-deps
   ```

## Running Tests

### Using the Interactive Test Runner

The easiest way to run tests is with the interactive test runner:

```bash
node scripts/run-tests.js
```

This will show you the available test options and guide you through the process.

### Manual Test Commands

#### All Tests
To run all tests:
```bash
npm test
```

#### Individual Test Suites

1. **User Registration Flow**:
   ```bash
   npm run test:registration
   ```
   This tests the registration process and creates a test user.

2. **API Endpoints**:
   ```bash
   npm run test:api
   ```
   This verifies that the API endpoints are working correctly.

3. **Alumni Directory** (requires approved user):
   ```bash
   npm run test:directory
   ```
   This tests the alumni directory functionality.

4. **Database Diagnostics**:
   ```bash
   npm run test:diagnostic
   ```
   This tests the database connection diagnostics.

## Test Workflow

The recommended workflow is:

1. Run registration test first to create a test user
2. Login to the admin dashboard manually and approve the user 
3. Run the directory test to verify the approved user can access the alumni directory
4. Run the API test to verify all endpoints are working

## Credentials Management

Test credentials are stored in a file called `test-credentials.json` at the root of the project. This allows tests to be run in sequence without having to recreate the test user each time.

The file contains:
```json
{
  "email": "test-user-xxxxx@example.com",
  "password": "Password123!xxxxx"
}
```

## Troubleshooting

### Common Issues

1. **Tests fail with authentication errors**
   - This likely means your test user hasn't been approved yet
   - Login as an admin and approve the user from the diagnostic page

2. **Tests can't find UI elements**
   - UI selectors may have changed - update the selectors in the test files
   - The page structure might have been updated

3. **Database connection issues**
   - Verify your database connection in the environment variables
   - Check if the database is running and accessible

### Viewing Test Reports

After running tests, you can view the HTML report:
```bash
npx playwright show-report
```

## Manual Testing Steps

For critical workflows, perform these manual tests:

1. **Registration Flow**
   - Navigate to `/register`
   - Create a new account
   - Verify you're redirected to the pending status page

2. **Admin Approval**
   - Login as an admin
   - Navigate to the `/diagnostic` page
   - Use the approval features to approve a user
   - Verify the user status changes in both database and UI

3. **Alumni Directory**
   - Login as an approved user
   - Verify you can access the alumni directory
   - Try searching for alumni
   - Check that alumni cards display correctly

## Utility Scripts

### Approve All Users Script

To approve all pending users in the database:
```bash
node scripts/approve-all-users.js
```

### Approve Specific User

To approve a specific user by email:
```bash
node scripts/approve-user-by-email.js user@example.com
```

### Reset User Tokens

To force token regeneration for users:
```bash
node scripts/reset-user-tokens.js
```
