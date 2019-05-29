const { config } = require('./defaults');

/**
 * Default config, headless Chrome
 */
exports.config = Object.assign({}, config, {
  services: ['chromedriver'],
  hostname: 'localhost',
  port: 9515,
  path: '/',
  capabilities: [
    {
      browserName: 'chrome',
      'goog:chromeOptions': {
        // to run chrome headless the following flags are required
        // (see https://developers.google.com/web/updates/2017/04/headless-chrome)
        args: [
          '--headless',
          '--disable-gpu',

          // avoid cross-origin issues
          '--disable-web-security',

          // Chrome sandboxing will not work in Travis
          '--no-sandbox',
        ],
      },
    },
  ],

  // Testing fix for failed address bind
  chromeDriverArgs: ['--whitelisted-ips='],
});