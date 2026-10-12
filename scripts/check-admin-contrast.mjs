import assert from 'node:assert/strict';
const luminance = hex => {
  const rgb = hex.match(/[0-9a-f]{2}/gi).map(value => parseInt(value, 16) / 255).map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4);
  return rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722;
};
const pairs = [
 ['body', '213547', 'ffffff', 4.5], ['muted', '52657a', 'f3f6fa', 4.5],
 ['primary action', 'ffffff', '245ca6', 4.5], ['sidebar', 'ffffff', '17324f', 4.5],
 ['published badge', '176344', 'e8f6ef', 4.5], ['changed badge', '855309', 'fff3d8', 4.5],
 ['danger', 'a51f35', 'ffffff', 4.5], ['disabled label', '52657a', 'dce4ee', 4.5],
 ['light focus', '245ca6', 'ffffff', 3], ['dark focus', 'c7d8ed', '17324f', 3],
 ['input border', '708297', 'ffffff', 3],
];
for (const [name, foreground, background, minimum] of pairs) {
 const a = luminance(foreground), b = luminance(background);
 const ratio = (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
 assert.ok(ratio >= minimum, `${name}: ${ratio.toFixed(2)} below ${minimum}`);
 console.log(`${name}: ${ratio.toFixed(2)}:1`);
}
