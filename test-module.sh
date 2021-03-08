set -e

mkdir -p test-screenshots

export JEST_PUPPETEER_CONFIG=jest-puppeteer.config.module.js
npm run test-module