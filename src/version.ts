const VERSION = "0.3.22";
console.log(`Zappar for ThreeJS v${VERSION}`);

let skipping = false;
export const skipVersionLog = () : void => { skipping = true };
