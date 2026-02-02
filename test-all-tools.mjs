import { Stagehand } from '@browserbasehq/stagehand';

console.log('========================================');
console.log('Comprehensive Stagehand Tools Test');
console.log('========================================\n');

// Configuration
const config = {
  env: 'LOCAL',
  localBrowserLaunchOptions: {
    cdpUrl: 'ws://localhost:9222/devtools/browser/9e3ac084-4498-4713-b91c-29d8e25b029f'
  },
  model: {
    apiKey: process.env.OPENAI_API_KEY || 'your-openai-api-key-here',
    modelName: 'gpt-4o'
  },
  logger: (logLine) => {
    console.log(`[Stagehand] ${logLine.message}`);
  }
};

console.log('Configuration:');
console.log('  Environment: LOCAL');
console.log('  Model: gpt-4o');
console.log('  CDP URL: ws://localhost:9222/...');
console.log('  API Key: SET (length:', config.model.apiKey.length, ')');
console.log('');

const testResults = {
  navigate: { status: 'pending', error: null },
  observe: { status: 'pending', error: null },
  act: { status: 'pending', error: null },
  extract: { status: 'pending', error: null },
  screenshot: { status: 'pending', error: null }
};

async function testAllTools() {
  let stagehand;
  
  try {
    console.log('=== INITIALIZATION ===');
    console.log('Initializing Stagehand...');
    stagehand = new Stagehand(config);
    await stagehand.init();
    console.log('✓ Stagehand initialized successfully\n');

    const pages = stagehand.context.pages();
    const page = pages[0];
    if (!page) {
      throw new Error('No active page available');
    }
    console.log('✓ Page acquired\n');

    // Test 1: Navigate
    console.log('=== TEST 1: NAVIGATE ===');
    try {
      console.log('Navigating to example.com...');
      await page.goto('https://example.com', { waitUntil: 'domcontentloaded' });
      console.log('✓ Navigate: SUCCESS\n');
      testResults.navigate.status = 'passed';
    } catch (error) {
      console.error('✗ Navigate: FAILED -', error.message);
      testResults.navigate.status = 'failed';
      testResults.navigate.error = error.message;
    }

    // Test 2: Observe
    console.log('=== TEST 2: OBSERVE ===');
    try {
      console.log('Observing: "Find all links on the page"');
      const observations = await stagehand.observe('Find all links on the page');
      console.log('✓ Observe: SUCCESS');
      console.log('  Found', observations.length, 'elements');
      if (observations.length > 0) {
        console.log('  Sample:', observations[0].description);
      }
      console.log('');
      testResults.observe.status = 'passed';
    } catch (error) {
      console.error('✗ Observe: FAILED -', error.message);
      testResults.observe.status = 'failed';
      testResults.observe.error = error.message;
    }

    // Test 3: Extract
    console.log('=== TEST 3: EXTRACT ===');
    try {
      console.log('Extracting page title...');
      const extracted = await stagehand.extract({
        instruction: 'Extract the main heading text from the page',
        schema: {
          heading: 'string'
        }
      });
      console.log('✓ Extract: SUCCESS');
      console.log('  Extracted:', JSON.stringify(extracted, null, 2));
      console.log('');
      testResults.extract.status = 'passed';
    } catch (error) {
      console.error('✗ Extract: FAILED -', error.message);
      testResults.extract.status = 'failed';
      testResults.extract.error = error.message;
    }

    // Test 4: Act
    console.log('=== TEST 4: ACT ===');
    try {
      console.log('Acting: "Scroll down the page"');
      await stagehand.act('Scroll down the page');
      console.log('✓ Act: SUCCESS\n');
      testResults.act.status = 'passed';
    } catch (error) {
      console.error('✗ Act: FAILED -', error.message);
      testResults.act.status = 'failed';
      testResults.act.error = error.message;
    }

    // Test 5: Screenshot
    console.log('=== TEST 5: SCREENSHOT ===');
    try {
      console.log('Taking screenshot...');
      const screenshot = await page.screenshot({ type: 'png' });
      console.log('✓ Screenshot: SUCCESS');
      console.log('  Size:', screenshot.length, 'bytes\n');
      testResults.screenshot.status = 'passed';
    } catch (error) {
      console.error('✗ Screenshot: FAILED -', error.message);
      testResults.screenshot.status = 'failed';
      testResults.screenshot.error = error.message;
    }

  } catch (error) {
    console.error('\n✗ CRITICAL ERROR:');
    console.error('  Message:', error.message);
    console.error('  Stack:', error.stack);
  } finally {
    if (stagehand) {
      console.log('=== CLEANUP ===');
      await stagehand.close();
      console.log('✓ Cleanup complete\n');
    }
  }

  // Print summary
  console.log('========================================');
  console.log('TEST SUMMARY');
  console.log('========================================');
  
  const tools = ['navigate', 'observe', 'act', 'extract', 'screenshot'];
  let passedCount = 0;
  let failedCount = 0;
  
  tools.forEach(tool => {
    const result = testResults[tool];
    const icon = result.status === 'passed' ? '✓' : result.status === 'failed' ? '✗' : '○';
    const status = result.status.toUpperCase().padEnd(7);
    console.log(`${icon} ${tool.toUpperCase().padEnd(12)} ${status}${result.error ? ' - ' + result.error : ''}`);
    
    if (result.status === 'passed') passedCount++;
    if (result.status === 'failed') failedCount++;
  });
  
  console.log('========================================');
  console.log(`PASSED: ${passedCount}/${tools.length}`);
  console.log(`FAILED: ${failedCount}/${tools.length}`);
  console.log('========================================\n');
  
  if (failedCount > 0) {
    process.exit(1);
  }
}

testAllTools().catch(console.error);
