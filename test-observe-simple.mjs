import { Stagehand } from '@browserbasehq/stagehand';

console.log('========================================');
console.log('Testing Stagehand Observe Tool');
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

async function testObserve() {
  let stagehand;

  try {
    console.log('1. Initializing Stagehand...');
    stagehand = new Stagehand(config);
    await stagehand.init();
    console.log('✓ Stagehand initialized successfully\n');

    console.log('2. Getting page...');
    const pages = stagehand.context.pages();
    const page = pages[0];
    if (!page) {
      throw new Error('No active page available');
    }
    console.log('✓ Page acquired\n');

    console.log('3. Navigating to example.com...');
    await page.goto('https://example.com', { waitUntil: 'domcontentloaded' });
    console.log('✓ Navigation successful\n');

    console.log('4. Testing Observe tool...');
    console.log('   Instruction: "Find the More information link"');
    const observations = await stagehand.observe('Find all links on the page');
    console.log('✓ Observe completed successfully\n');

    console.log('Results:');
    console.log(JSON.stringify(observations, null, 2));

  } catch (error) {
    console.error('\n✗ Error occurred:');
    console.error('  Message:', error.message);
    console.error('  Stack:', error.stack);
    process.exit(1);
  } finally {
    if (stagehand) {
      console.log('\n4. Cleaning up...');
      await stagehand.close();
      console.log('✓ Cleanup complete');
    }
  }
}

testObserve().catch(console.error);
