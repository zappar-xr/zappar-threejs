import "expect-puppeteer";
import * as utils from "@zappar/test-utils";
import { toMatchImageSnapshot } from "jest-image-snapshot";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const getStandaloneVersions = require("../standalone-versions");

expect.extend({ toMatchImageSnapshot });

const CI_COMMIT_TAG = process.env.CI_COMMIT_TAG || "CI_COMMIT_TAG";

jest.setTimeout(600000);

const testName = "image-tracking-target";

const test = (url: string, description: string) => {
  describe(`${description}`, () => {
    it("logs screenshot", async () => {
      const page = await browser.newPage();
      page.goto(url);
      await utils.expectConsoleLogs(
        [
          `Zappar for ThreeJS v${CI_COMMIT_TAG}`,
          /Zappar JS v\d*.\d*.\d*/,
          /Zappar CV v\d*.\d*.\d*/,
          "[Zappar] INFO html_element_source_t initialized",
          "[Zappar] INFO camera_source_t initialized",
          "[Zappar] INFO pipeline_t initialized",
          "[Zappar] INFO image_tracker_t initialized",
          "[Zappar] INFO loading target from memory: 236297 bytes",
          "[Zappar] INFO image target loaded",
          "Anchor is visible",
        ],
        page,
        120000,
        new Set([
          "[Zappar] INFO no display data",
          "[Zappar] INFO image tracker camera model recalculation",
          "[Zappar] INFO identity for license check: 127.*",
          "[HMR] Waiting for update signal from WDS...",
          "[WDS] Hot Module Replacement enabled.",
          "[WDS] Live Reloading enabled.",
          "[HMR] App is up to date.",
          "[HMR] Nothing hot updated.",
          "[WDS] App hot update...",
          "[WDS] App updated. Recompiling...",
        ])
      );

      const screenshot = await page.screenshot();
      expect(screenshot).toMatchImageSnapshot({
        customDiffConfig: {
          threshold: 0.02,
        },
        failureThreshold: 0.02,
        failureThresholdType: "percent",
      });
      // Avoid premature exit
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await page.close();
    });
  });
};

test(`https://127.0.0.1:8081/pages/jest/module/${testName}.html`, `module ${testName}`);

getStandaloneVersions().forEach((cdnVersion: string) => {
  test(`https://127.0.0.1:8081/pages/jest/generated-standalone/${testName}-${cdnVersion}.html`, `standalone ${testName}-${cdnVersion}`);
});
