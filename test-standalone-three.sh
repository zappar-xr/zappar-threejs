set -e

rm -rf puppeteer-standalone-dist
mkdir -p puppeteer-standalone-dist
cp umd/* puppeteer-standalone-dist
cp puppeteer/standalone/* puppeteer-standalone-dist

mkdir -p test-screenshots

export ZAPPAR_STANDALONE=
sed -i '' -e "s#ZAPPAR_STANDALONE#${ZAPPAR_STANDALONE}#g" puppeteer-standalone-dist/*.html
sed -i '' -e "s#THREE_VERSION#$1#g" puppeteer-standalone-dist/*.html
export JEST_PUPPETEER_CONFIG=jest-puppeteer.config.standalone.js
npm run test-standalone