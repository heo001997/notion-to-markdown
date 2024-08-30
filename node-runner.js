const { handler } = require('./src/index.js');

const testEvent = {
  queryStringParameters: {
    notion_secret: "secret_Kx7L2zA2ggI5ETuPtC93t0IdS85gUBPoa6Vrs91NPKE",
    pageId: "91cc58f760f1418da6a624407b0ae577"
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