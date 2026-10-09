import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { buildModel, flatten, loadTokens, render } from "../scripts/build.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const { version } = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
const files = render(loadTokens(), version);

test("the committed dist/ matches the tokens", () => {
  for (const [name, content] of Object.entries(files)) {
    assert.equal(readFileSync(join(root, "dist", name), "utf8"), content, `dist/${name} is stale`);
  }
});

test("--check passes when dist/ is up to date", () => {
  execFileSync(process.execPath, [join(root, "scripts/build.mjs"), "--check"]);
});

test("the Tailwind theme keeps the names the site already uses", () => {
  const theme = files["theme.css"];
  for (const declaration of [
    "--color-coral: #e26b5c;",
    "--color-coral-50: #fff4f2;",
    "--color-coral-600: #c44134;",
    "--color-wine: #340b10;",
    "--color-wine-800: #50171c;",
    "--color-wine-950: #210507;",
    "--color-muted: #75595c;",
    '--font-sans: var(--font-host-grotesk, "Host Grotesk"), ui-sans-serif, system-ui, sans-serif;',
    '--font-display: var(--font-crimson-pro, "Crimson Pro"), ui-serif, Georgia, serif;',
    "--ease-soft: cubic-bezier(0.2, 0, 0, 1);",
  ]) {
    assert.ok(theme.includes(declaration), `theme.css is missing "${declaration}"`);
  }
  for (const utility of ["display-xl", "display-word", "display-lg", "display-md", "display-sm", "lead", "press"]) {
    assert.ok(theme.includes(`@utility ${utility} {`), `the ${utility} utility is missing`);
  }
});

test("the theme does not redefine Tailwind names that would change existing utilities", () => {
  const theme = files["theme.css"];
  // `--spacing-md` and the like hijack `max-w-md`; `--radius-full` would change `rounded-full`.
  assert.doesNotMatch(theme, /--spacing-/);
  assert.doesNotMatch(theme, /--radius-(xs|sm|md|lg|xl|2xl|3xl|4xl|full):/);
  assert.doesNotMatch(theme, /--text-(xs|sm|base|lg|xl|\dxl):/);
});

test("no text size in the theme shares its name with a colour", () => {
  const theme = files["theme.css"];
  const colors = new Set([...theme.matchAll(/--color-([a-z-]+?)(?:-\d+)?:/g)].map((match) => match[1]));
  for (const [, size] of theme.matchAll(/--text-([a-z-]+):/g)) {
    assert.ok(!colors.has(size), `text-${size} would be a size and a colour at once`);
  }
});

test("in the plain CSS variables the base of each scale keeps its number", () => {
  const css = files["tokens.css"];
  assert.ok(css.includes("--tone-coral-500: #e26b5c;"));
  assert.ok(css.includes("--tone-wine-900: #340b10;"));
  assert.ok(css.includes("--tone-ink: #292420;"));
  assert.ok(css.includes("--tone-shadow-raised: 0 0 0 1px"));
});

test("light and dark have the same roles", () => {
  const { neutral } = buildModel(loadTokens(), version);
  assert.deepEqual(Object.keys(neutral.dark), Object.keys(neutral.light));
  const dark = files["tokens-dark.css"];
  assert.ok(dark.startsWith("/*") && dark.includes('[data-tone-scheme="dark"] {'));
});

test("the module exports what the types declare", async () => {
  const module = await import("../dist/index.js");
  const declared = [...files["index.d.ts"].matchAll(/^export declare const (\w+):/gm)].map((match) => match[1]);
  assert.deepEqual(Object.keys(module).sort(), declared.sort());
  assert.equal(module.version, version);
  assert.equal(module.color.coral[500], "#e26b5c");
  assert.equal(module.easing.soft, "cubic-bezier(0.2, 0, 0, 1)");
});

test("each display style carries the size a phone gets: the floor of the clamp", () => {
  const { display } = buildModel(loadTokens(), version);
  assert.deepEqual(display.xl.phone, { fontSize: 44, fontWeight: 400 });
  assert.deepEqual(display.lg.phone, { fontSize: 41.6, fontWeight: 400 });
  assert.deepEqual(display.sm.phone, { fontSize: 26, fontWeight: 500 });
});

test("a reference resolves to the value of the token it points to, inside composite values too", () => {
  const tree = {
    font: { family: { display: { $value: "Crimson Pro" } } },
    logo: { $value: { fontFamily: "{font.family.display}", fontWeight: 500 } },
    copy: { $value: "{logo}" },
  };
  const byPath = Object.fromEntries(flatten(tree).map((token) => [token.path.join("."), token.value]));
  assert.deepEqual(byPath.logo, { fontFamily: "Crimson Pro", fontWeight: 500 });
  assert.deepEqual(byPath.copy, { fontFamily: "Crimson Pro", fontWeight: 500 });
});

test("a reference that does not exist or loops fails with the path of the token", () => {
  assert.throws(() => flatten({ a: { $value: "{nada.aqui}" } }), /a aponta para \{nada\.aqui\}/);
  assert.throws(() => flatten({ a: { $value: "{b}" }, b: { $value: "{a}" } }), /Referência circular/);
});

test("a leaf without $value does not pass silently", () => {
  assert.throws(() => flatten({ color: { coral: "#e26b5c" } }), /color\.coral não é um token/);
});

test("the group's type applies to the tokens inside it, and the token's own wins", () => {
  const tokens = flatten(loadTokens());
  const type = (path) => tokens.find((token) => token.path.join(".") === path).type;
  assert.equal(type("neutral.light.paper"), "color");
  assert.equal(type("neutral.light.raised"), "shadow");
});
