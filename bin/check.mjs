#!/usr/bin/env node
// tone-design-check: fails when a colour is written by hand instead of coming from the tokens.
//
//   tone-design-check [--config <file>] [--root <dir>]
//
// Reads tone-design.json at the root of the repository:
//
//   include  folders or files to read
//   allow    globs of files where a literal colour is data, not interface
//            (skin tones, product shade ranges, icons)
//   legacy   { "file": n }: literals that were there before the move to the
//            tokens. The number has to match: if it rises, someone wrote a new
//            colour; if it falls, update it, so the list cannot outlive its reason.
//
// A line with "tone-design-ignore: <reason>" is skipped; with
// "tone-design-ignore-next-line: <reason>", the next one is.
import { existsSync, readdirSync, readFileSync, realpathSync, statSync } from "node:fs";
import { join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const SOURCE = /\.(css|scss|less|[cm]?[jt]sx?|html|vue|svelte|astro)$/;
const SKIPPED_DIRS = new Set(["node_modules", ".git", ".next", ".expo", ".turbo", ".vercel", "dist", "build", "out", "coverage"]);
// A "#" after a letter, a digit or "&" is a URL anchor or an HTML entity, not a colour.
const HEX = /(?<![A-Za-z0-9&])#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})(?![\w-])/g;
// No \b: in a Tailwind arbitrary value the function comes after "_" (`shadow-[0_0_0_1px_oklch(...)]`).
const FUNCTION = /(?<![A-Za-z0-9-])(?:rgba?|hsla?|hwb|oklch|oklab)\(/g;
const IGNORE_LINE = /tone-design-ignore(?!-next-line)/;
const IGNORE_NEXT = /tone-design-ignore-next-line/;

const toPosix = (path) => path.split(sep).join("/");

/** A glob with `**`, `*` and `?` as a regular expression over paths with "/". */
export function globToRegExp(glob) {
  let source = "";
  for (let i = 0; i < glob.length; i++) {
    const char = glob[i];
    if (char === "*" && glob[i + 1] === "*") {
      // "**/" matches zero or more folders; a trailing "**" matches everything.
      if (glob[i + 2] === "/") {
        source += "(?:.*/)?";
        i += 2;
      } else {
        source += ".*";
        i += 1;
      }
    } else if (char === "*") source += "[^/]*";
    else if (char === "?") source += "[^/]";
    else source += char.replace(/[.+^${}()|[\]\\]/g, "\\$&");
  }
  return new RegExp(`^${source}$`);
}

/** Blanks out comments, keeping the line breaks, so a colour quoted in a comment does not count. */
function withoutComments(source) {
  const blank = (text) => text.replace(/[^\n]/g, " ");
  return (
    source
      .replace(/\/\*[\s\S]*?\*\//g, blank)
      .replace(/<!--[\s\S]*?-->/g, blank)
      // "//" after ":" is a URL.
      .replace(/(?<![:\\])\/\/.*$/gm, blank)
  );
}

/**
 * The literal colours of a file.
 * @param {string} source
 * @returns {{ line: number, column: number, text: string }[]}
 */
export function findColors(source) {
  const raw = source.split("\n");
  const lines = withoutComments(source).split("\n");
  const found = [];
  lines.forEach((line, index) => {
    if (IGNORE_LINE.test(raw[index]) || (index > 0 && IGNORE_NEXT.test(raw[index - 1]))) return;
    for (const pattern of [HEX, FUNCTION]) {
      for (const match of line.matchAll(pattern)) {
        const text = pattern === FUNCTION ? line.slice(match.index).match(/^[a-z]+\([^)]*\)?/)[0] : match[0];
        found.push({ line: index + 1, column: match.index + 1, text });
      }
    }
  });
  return found.sort((a, b) => a.line - b.line || a.column - b.column);
}

function walk(path, files = []) {
  const stats = statSync(path);
  if (stats.isFile()) {
    if (SOURCE.test(path)) files.push(path);
    return files;
  }
  for (const entry of readdirSync(path, { withFileTypes: true })) {
    if (entry.isDirectory() && SKIPPED_DIRS.has(entry.name)) continue;
    if (entry.isDirectory() || entry.isFile()) walk(join(path, entry.name), files);
  }
  return files;
}

/**
 * @param {{ root: string, config: { include?: string[], allow?: string[], legacy?: Record<string, number> } }} options
 * @returns {{ scanned: number, violations: { file: string, line: number, column: number, text: string }[], problems: string[] }}
 */
export function check({ root, config }) {
  const include = config.include ?? ["src"];
  const allow = (config.allow ?? []).map(globToRegExp);
  const legacy = config.legacy ?? {};
  const violations = [];
  const problems = [];
  const counts = new Map();
  let scanned = 0;

  for (const entry of include) {
    const start = resolve(root, entry);
    if (!existsSync(start)) {
      problems.push(`"include" aponta para ${entry}, que não existe.`);
      continue;
    }
    for (const path of walk(start)) {
      const file = toPosix(relative(root, path));
      if (allow.some((pattern) => pattern.test(file))) continue;
      scanned += 1;
      const colors = findColors(readFileSync(path, "utf8"));
      counts.set(file, colors.length);
      if (file in legacy) continue;
      for (const color of colors) violations.push({ file, ...color });
    }
  }

  for (const [file, expected] of Object.entries(legacy)) {
    const actual = counts.get(file);
    if (actual === undefined) {
      problems.push(`"legacy" lista ${file}, que não foi lido (não existe mais, está fora de "include" ou está em "allow"). Remova a entrada.`);
    } else if (actual > expected) {
      problems.push(`${file} tinha ${expected} cores literais e agora tem ${actual}. Cor nova vem dos tokens.`);
    } else if (actual < expected) {
      const fix = actual === 0 ? "remova a entrada" : `troque o número para ${actual}`;
      problems.push(`${file} caiu de ${expected} para ${actual} cores literais: ${fix} em "legacy".`);
    }
  }

  return { scanned, violations, problems };
}

function main() {
  const args = process.argv.slice(2);
  const option = (name) => (args.includes(name) ? args[args.indexOf(name) + 1] : undefined);
  const root = resolve(option("--root") ?? process.cwd());
  const configPath = resolve(root, option("--config") ?? "tone-design.json");
  if (!existsSync(configPath)) {
    console.error(`tone-design: não achei ${toPosix(relative(root, configPath))}. Crie o arquivo com "include", "allow" e "legacy".`);
    process.exit(2);
  }
  const { scanned, violations, problems } = check({ root, config: JSON.parse(readFileSync(configPath, "utf8")) });

  if (violations.length === 0 && problems.length === 0) {
    console.log(`tone-design: ${scanned} arquivos lidos, nenhuma cor escrita à mão.`);
    return;
  }
  if (violations.length > 0) {
    const files = new Set(violations.map((violation) => violation.file)).size;
    console.error(`tone-design: ${violations.length} cor(es) escrita(s) à mão em ${files} arquivo(s).\n`);
    for (const { file, line, column, text } of violations) console.error(`  ${file}:${line}:${column}  ${text}`);
    console.error(
      [
        "",
        "Cor vem dos tokens de @toneorg/design: leia node_modules/@toneorg/design/DESIGN.md.",
        'Se o valor é dado e não interface (tom de pele, cartela, ícone), liste o arquivo em "allow"',
        'no tone-design.json ou marque a linha com "tone-design-ignore: <motivo>".',
      ].join("\n"),
    );
  }
  if (problems.length > 0) {
    if (violations.length > 0) console.error("");
    for (const problem of problems) console.error(`tone-design: ${problem}`);
  }
  process.exit(1);
}

// Through node_modules/.bin the path arrives as a symbolic link.
if (process.argv[1] && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) main();
