const { handler } = require('./src/index.js');

const testEvent = {
  queryStringParameters: {
    notion_secret: "secret_Kx7L2zA2ggI5ETuPtC93t0IdS85gUBPoa6Vrs91NPKE",
    pageId: "71a230664cf04e3cae7c1cecd2e6c465"
  }
};

const testContext = {};

async function runTest() {
  try {
    const result = await handler(testEvent, testContext);
    console.log('Result:', JSON.parse(result.body));
  } catch (error) {
    console.error('Error:', error);
  }
}

runTest();