// The contrast promises DESIGN.md makes, checked against the tokens (WCAG 2.x).
import assert from "node:assert/strict";
import { test } from "node:test";
import { color, neutral } from "../dist/index.js";

function luminance(hex) {
  const [r, g, b] = [1, 3, 5].map((at) => {
    const channel = Number.parseInt(hex.slice(at, at + 2), 16) / 255;
    return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a, b) {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}

const TEXT = 4.5;
const LARGE = 3;

test("on coral, only wine works as text", () => {
  assert.ok(contrast(color.wine[900], color.coral[500]) >= TEXT);
  const white = contrast(color.white, color.coral[500]);
  assert.ok(white >= LARGE && white < TEXT, "white on coral is for display sizes only (24 px and up)");
});

test("small coral text on white is coral-600, never coral-500", () => {
  assert.ok(contrast(color.coral[600], color.white) >= TEXT);
  assert.ok(contrast(color.coral[500], color.white) < TEXT);
  assert.ok(contrast(color.coral[700], color.coral[50]) >= TEXT);
});

test("secondary text passes on every light brand ground", () => {
  for (const ground of [color.white, color.coral[50], color.coral[100]]) {
    assert.ok(contrast(color.muted, ground) >= TEXT);
  }
});

test("on wine, white, blush and the light corals pass as text", () => {
  for (const text of [color.white, color.coral[50], color.coral[200], color.coral[300], color.coral[500]]) {
    assert.ok(contrast(text, color.wine[900]) >= TEXT);
  }
  assert.ok(contrast(color.coral[200], color.wine[950]) >= TEXT);
});

test("the three brand buttons keep a readable label, on hover too", () => {
  assert.ok(contrast(color.white, color.wine[900]) >= TEXT);
  assert.ok(contrast(color.white, color.wine[800]) >= TEXT);
  assert.ok(contrast(color.wine[900], color.coral[500]) >= TEXT);
  assert.ok(contrast(color.wine[900], color.coral[300]) >= TEXT);
  assert.ok(contrast(color.wine[900], color.coral[100]) >= TEXT);
  assert.ok(contrast(color.wine[900], color.coral[200]) >= TEXT);
});

for (const scheme of ["light", "dark"]) {
  test(`neutral ground (${scheme}): text, secondary text and error pass on every surface`, () => {
    const roles = neutral[scheme];
    for (const ground of [roles.paper, roles.surface, roles.sunken]) {
      assert.ok(contrast(roles.ink, ground) >= TEXT);
      assert.ok(contrast(roles.graphite, ground) >= TEXT);
    }
    for (const ground of [roles.paper, roles.surface]) assert.ok(contrast(roles.alert, ground) >= TEXT);
    assert.ok(contrast(roles.onInk, roles.ink) >= TEXT);
    // A control outline is an interface element, not text: 3:1.
    assert.ok(contrast(roles.control, roles.surface) >= LARGE);
  });
}
