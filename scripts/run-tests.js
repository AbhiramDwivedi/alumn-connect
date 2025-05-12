// This script runs Playwright tests for the AlumnConnect application
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

/**
 * Prompt the user for input
 * @param {string} question - The question to ask the user
 * @returns {Promise<string>} - The user's answer
 */
function askQuestion(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise(resolve => {
    rl.question(question, answer => {
      rl.close();
      resolve(answer);
    });
  });
}

/**
 * Main function to run tests
 */
async function runTests() {
  try {
    // First install browsers if they're not already installed
    console.log('Checking for Playwright browsers...');
    try {
      execSync('npx playwright --version', { stdio: 'ignore' });
      console.log('Playwright is already installed.');
    } catch (error) {
      console.log('Installing Playwright browsers...');
      execSync('npx playwright install --with-deps', { stdio: 'inherit' });
    }

    // Ask which test to run
    console.log('\n==== AlumnConnect Test Runner ====');
    console.log('1. Run registration test (creates a new test user)');
    console.log('2. Run API endpoints test');
    console.log('3. Run alumni directory test (requires approved user)');
    console.log('4. Run DB diagnostics test');
    console.log('5. Run all tests');
    console.log('6. Clean up test artifacts');
    
    const answer = await askQuestion('\nSelect an option (1-6): ');
    
    switch (answer.trim()) {
      case '1':
        console.log('\nRunning registration test...');
        execSync('npm run test:registration', { stdio: 'inherit' });
        break;
      case '2':
        console.log('\nRunning API endpoints test...');
        execSync('npm run test:api', { stdio: 'inherit' });
        break;
      case '3':
        console.log('\nRunning alumni directory test...');
        execSync('npm run test:directory', { stdio: 'inherit' });
        break;
      case '4':
        console.log('\nRunning DB diagnostics test...');
        execSync('npm run test:diagnostic', { stdio: 'inherit' });
        break;
      case '5':
        console.log('\nRunning all tests...');
        execSync('npm test', { stdio: 'inherit' });
        break;
      case '6':
        console.log('\nCleaning up test artifacts...');
        const credentialsPath = path.join(process.cwd(), 'test-credentials.json');
        if (fs.existsSync(credentialsPath)) {
          fs.unlinkSync(credentialsPath);
          console.log('Deleted test credentials file.');
        } else {
          console.log('No test credentials file found.');
        }
        break;
      default:
        console.log('Invalid option selected.');
    }
  } catch (error) {
    console.error('Error running tests:', error);
    process.exit(1);
  }
}

// Run the main function
runTests();

// Run the main function
runTests();
