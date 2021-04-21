import "expect-puppeteer";

import * as utils from '@zappar/test-utils';

const CI_COMMIT_TAG = process.env["CI_COMMIT_TAG"] || "CI_COMMIT_TAG";

jest.setTimeout(60000);

const url = 'https://127.0.0.1:8080/face.html';

it('console logs', async () => {
    const page = await browser.newPage();
    page.goto(url);
    await utils.expectConsoleLogs([
        `Zappar for ThreeJS v${CI_COMMIT_TAG}`,
        /Zappar JS v\d*.\d*.\d*/,
        /Zappar CV v\d*.\d*.\d*/,
        "[Zappar] INFO camera_source_t initialized",
        "[Zappar] INFO camera_source_t initialized",
        "[Zappar] INFO html_element_source_t initialized",
        "[Zappar] INFO pipeline_t initialized",
        "[Zappar] INFO identity for license check: 127.*",
        "[Zappar] INFO face_tracker_t initialized",
        "Found 1 face(s)",
    ], page, 30000, new Set(["[Zappar] INFO no display data"]));
    await page.close();
});
