module.exports = {
    launch: {
      dumpio: true,
      headless: 'false',
      defaultViewport: {
          width: 320,
          height: 600,
          deviceScaleFactor: 2,
          isMobile: true,
          hasTouch: true
      },
      args: [
        '--ignore-certificate-errors',
      ]
    },
    browser: 'chromium',
    browserContext: 'default',
    server: {
        command: 'npm run standalone-test-serve',
        port: 7011,
        launchTimeout: 60000
    }
}