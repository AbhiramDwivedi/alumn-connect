// Test script to check the searchAlumni and getAlumniCount functions

const { searchAlumni, getAlumniCount } = require('../lib/db');
const { createLogger } = require('../lib/logger');

const logger = createLogger('test-db-functions');

async function testDatabaseFunctions() {
  try {
    logger.info('Testing searchAlumni function...');
    const searchParams = {
      query: '',
      limit: 10,
      offset: 0,
      sortBy: 'name',
      sortDirection: 'asc'
    };
    
    // Test searchAlumni
    try {
      const alumni = await searchAlumni(searchParams);
      logger.info(`searchAlumni succeeded, found ${alumni.length} records`);
      
      if (alumni.length > 0) {
        logger.info('Sample alumni record:', { 
          record: { ...alumni[0], password: undefined } // Omit password for security
        });
      }
    } catch (error) {
      logger.error('searchAlumni failed:', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
    }
    
    // Test getAlumniCount
    try {
      const count = await getAlumniCount({});
      logger.info(`getAlumniCount succeeded, total: ${count}`);
    } catch (error) {
      logger.error('getAlumniCount failed:', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
    }
    
  } catch (error) {
    logger.error('Test script error:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
  }
}

// Run the test
testDatabaseFunctions().then(() => {
  console.log('Test completed');
}).catch(error => {
  console.error('Unhandled error in test script:', error);
});
