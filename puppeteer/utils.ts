import { Page } from "puppeteer";
import { PNG } from "pngjs";
import * as pixelmatch from "pixelmatch";

export function delay(ms: number) : Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function expectConsoleLogs(logs: (string|RegExp)[], page: Page, timeoutMs: number, ignore?: Set<string>) : Promise<void> {
    return new Promise((resolve, reject) => {
        let currentIndex = 0;
        let timeout = setTimeout(function() {
            page.off("console", compare);
            reject("Timeout waiting for console logs");
        }, timeoutMs);
        function compare(evt: any) {
            if (ignore && ignore.has(evt.text())) return;
            let expected = logs[currentIndex];
            let passes = false;
            if (typeof expected === 'string' && evt.text() === expected) passes = true;
            else if (typeof expected !== 'string' && expected.test(evt.text())) passes = true;
            
            if (!passes) {
                page.off("console", compare);
                clearTimeout(timeout);
                reject(`Non-matching console log "${evt.text()}" !== "${logs[currentIndex]}"`);
            } else {
                currentIndex++;
                if (currentIndex >= logs.length) {
                    clearTimeout(timeout);
                    page.off("console", compare);
                    resolve();
                }
            }
        }
        page.on("console", compare);
    });
}

export function waitForConsoleLog(log: string, page: Page, timeoutMs: number) : Promise<void> {
    return new Promise((resolve, reject) => {
        let timeout = setTimeout(function() {
            page.off("console", compare);
            reject("Timeout waiting for console logs");
        }, timeoutMs);
        function compare(evt: any) {
            if (evt.text() === log) {
                page.off("console", compare);
                clearTimeout(timeout);
                resolve();
            }
        }
        page.on("console", compare);
    });
}

export async function compareScreenshots(expected: Buffer, found: Buffer) : Promise<void> {
    let adecoded = PNG.sync.read(expected);
    let bdecoded = PNG.sync.read(found);
    if (adecoded.width !== bdecoded.width || adecoded.height !== bdecoded.height) throw new Error("Screenshot dimensions mismatch");
    let res = pixelmatch(adecoded.data, bdecoded.data, null, adecoded.width, adecoded.height);
    await expect(res).toBeLessThan(10);
}