// Test script to check alumni API

async function testAlumniApi() {
  try {
    console.log('Testing alumni API...');
    
    // First try to get a session cookie by logging in
    console.log('Getting session...');
    const sessionResponse = await fetch('http://localhost:3000/api/auth/session');
    const sessionData = await sessionResponse.json();
    
    console.log('Session data:', JSON.stringify(sessionData, null, 2));
    
    // Now try to fetch alumni
    console.log('\nFetching alumni...');
    const response = await fetch('http://localhost:3000/api/alumni');
    const status = response.status;
    
    console.log(`API response status: ${status}`);
    
    // Try to get the response body
    try {
      const data = await response.json();
      console.log('API response data:', JSON.stringify(data, null, 2));
    } catch (e) {
      const text = await response.text();
      console.log('API response text:', text);
    }
  } catch (error) {
    console.error('Error in test script:', error);
  }
}

testAlumniApi();
