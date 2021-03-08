set -e

rm -rf puppeteer-standalone-dist
mkdir -p puppeteer-standalone-dist
cp puppeteer/standalone/* puppeteer-standalone-dist

mkdir -p test-screenshots

export ZAPPAR_STANDALONE=https://libs.zappar.com/zappar-threejs/$CI_COMMIT_TAG
sed -i '' -e "s#ZAPPAR_STANDALONE#${ZAPPAR_STANDALONE}#g" puppeteer-standalone-dist/*.html
sed -i '' -e "s#THREE_VERSION#r123#g" puppeteer-standalone-dist/*.html
export JEST_PUPPETEER_CONFIG=jest-puppeteer.config.standalone.js
npm run test-standalone