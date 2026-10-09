import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { check, findColors, globToRegExp } from "../bin/check.mjs";

const bin = join(dirname(fileURLToPath(import.meta.url)), "../bin/check.mjs");
const texts = (source) => findColors(source).map((color) => color.text);

/** A throwaway repository holding the given files. */
function repo(files) {
  const root = mkdtempSync(join(tmpdir(), "tone-design-"));
  for (const [path, content] of Object.entries(files)) {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    writeFileSync(join(root, path), content);
  }
  return root;
}

test("finds hex colours of 3, 4, 6 and 8 digits and colour functions", () => {
  assert.deepEqual(texts("a { color: #fff; background: #E26B5C; border-color: #0008; outline-color: #340b10cc }"), [
    "#fff",
    "#E26B5C",
    "#0008",
    "#340b10cc",
  ]);
  assert.deepEqual(texts('const shadow = "0 0 0 1px rgba(0, 0, 0, 0.06), 0 2px oklch(0 0 0/0.45)";'), [
    "rgba(0, 0, 0, 0.06)",
    "oklch(0 0 0/0.45)",
  ]);
});

test("finds a colour inside a Tailwind arbitrary value", () => {
  assert.deepEqual(texts('const picked = "shadow-[0_0_0_3px_#fff,0_0_0_5px_var(--color-wine)]";'), ["#fff"]);
  assert.deepEqual(texts('<div className="shadow-[0_0_0_1px_oklch(1_0_0/0.08),0_12px_32px_-12px_oklch(0_0_0/0.45)]">'), [
    "oklch(1_0_0/0.08)",
    "oklch(0_0_0/0.45)",
  ]);
});

test("does not mistake an anchor, an entity, a selector or an issue number for a colour", () => {
  assert.deepEqual(texts('<a href="/pagina#abc">&#123; &#x1F600;</a>'), []);
  assert.deepEqual(texts("#app { margin: 0 }"), []);
  assert.deepEqual(texts("// corrigido em #101, ver também #1234"), []);
  assert.deepEqual(texts("/* o coral da marca (#e26b5c)\n   e o vinho (#340b10) */\nbody { margin: 0 }"), []);
  assert.deepEqual(texts('const url = "https://exemplo.com/#fff";'), ["#fff"]);
});

test("a token and a variable are not hand-written colours", () => {
  assert.deepEqual(texts("a { color: var(--tone-ink); background: var(--color-coral, currentColor) }"), []);
  assert.deepEqual(texts("const bg = colors.paper; const fg = `${color.wine[900]}`;"), []);
});

test("a marked line is skipped, and the next one when the mark says next-line", () => {
  const source = [
    'const veil = "rgba(21,20,19,0.45)"; // tone-design-ignore: véu sobre a amostra',
    "// tone-design-ignore-next-line: cor do produto, vem do catálogo",
    'const shade = "#a07e56";',
    'const other = "#604134";',
  ].join("\n");
  assert.deepEqual(findColors(source), [{ line: 4, column: 16, text: "#604134" }]);
});

test("glob: ** crosses folders, * stays in one", () => {
  assert.ok(globToRegExp("**/*.svg").test("src/app/icon.svg"));
  assert.ok(globToRegExp("**/*.svg").test("icon.svg"));
  assert.ok(globToRegExp("src/lib/tones.ts").test("src/lib/tones.ts"));
  assert.ok(globToRegExp("src/data/**").test("src/data/a/b.ts"));
  assert.ok(!globToRegExp("src/*.ts").test("src/lib/tones.ts"));
  assert.ok(!globToRegExp("src/lib/tones.ts").test("src/lib/tonesXts"));
});

test("reports file, line and column, and honours allow", () => {
  const root = repo({
    "src/card.tsx": 'export const card = { color: "#292420" };\n',
    "src/lib/tones.ts": 'export const MONK = ["#f6ede4", "#292420"];\n',
    "src/node_modules/x/y.js": 'module.exports = "#000";\n',
    "src/logo.svg": '<svg fill="#e26b5c"/>',
  });
  const result = check({ root, config: { include: ["src"], allow: ["src/lib/tones.ts"] } });
  assert.deepEqual(result.violations, [{ file: "src/card.tsx", line: 1, column: 31, text: "#292420" }]);
  assert.deepEqual(result.problems, []);
  assert.equal(result.scanned, 1);
});

test("legacy: the count has to match, upwards and downwards", () => {
  const files = { "server/report.ts": 'const a = "#fff"; const b = "#000";\n' };
  const run = (count) => check({ root: repo(files), config: { include: ["server"], legacy: { "server/report.ts": count } } });
  assert.deepEqual(run(2), { scanned: 1, violations: [], problems: [] });
  assert.match(run(1).problems[0], /tinha 1 cores literais e agora tem 2/);
  assert.match(run(3).problems[0], /caiu de 3 para 2 cores literais: troque o número para 2/);
});

test("legacy: an entry that no longer applies fails, so the list cannot outlive its reason", () => {
  const root = repo({ "src/a.ts": "export const a = 1;\n" });
  const clean = check({ root, config: { include: ["src"], legacy: { "src/a.ts": 2 } } });
  assert.match(clean.problems[0], /caiu de 2 para 0 cores literais: remova a entrada/);
  const gone = check({ root, config: { include: ["src"], legacy: { "src/sumiu.ts": 1 } } });
  assert.match(gone.problems[0], /"legacy" lista src\/sumiu\.ts, que não foi lido/);
});

test("an include that does not exist is a problem, not zero files read", () => {
  const result = check({ root: repo({}), config: { include: ["src"] } });
  assert.match(result.problems[0], /"include" aponta para src, que não existe/);
});

test("command line: exits 1 and lists the colours; exits 0 when clean", () => {
  const dirty = repo({ "tone-design.json": '{ "include": ["src"] }', "src/a.css": "a { color: #123456 }\n" });
  const failed = spawnSync(process.execPath, [bin], { cwd: dirty, encoding: "utf8" });
  assert.equal(failed.status, 1);
  assert.match(failed.stderr, /src\/a\.css:1:12 {2}#123456/);

  const clean = repo({ "tone-design.json": '{ "include": ["src"] }', "src/a.css": "a { color: var(--tone-ink) }\n" });
  assert.match(execFileSync(process.execPath, [bin], { cwd: clean, encoding: "utf8" }), /1 arquivos lidos, nenhuma cor/);
});

test("command line: also runs through the node_modules/.bin link", () => {
  const root = repo({ "tone-design.json": '{ "include": ["src"] }', "src/a.css": "a { color: #123456 }\n" });
  mkdirSync(join(root, "node_modules/.bin"), { recursive: true });
  symlinkSync(bin, join(root, "node_modules/.bin/tone-design-check"));
  const result = spawnSync(join(root, "node_modules/.bin/tone-design-check"), { cwd: root, encoding: "utf8" });
  assert.equal(result.status, 1);
});

test("command line: without tone-design.json exits 2 and says what is missing", () => {
  const result = spawnSync(process.execPath, [bin], { cwd: repo({}), encoding: "utf8" });
  assert.equal(result.status, 2);
  assert.match(result.stderr, /não achei tone-design\.json/);
});
