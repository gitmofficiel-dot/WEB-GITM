#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const ROOT = process.cwd();
const SRC_DIR = path.join(ROOT, 'src');
const TARGET_LOCALES = ['ar', 'en', 'fr'];
const ARABIC_RE = /[\u0600-\u06FF]/;
const ALLOWED_ARABIC_VALUES = new Set(['العربية', 'عربي', 'عربية']);
const ALLOWED_ARABIC_KEY_RE = /(^|\.)(ar|arabic|langAr|titleAr|title_ar|nameAr|name_ar|bioAr|bio_ar)$/i;
const STRICT_MISSING = process.argv.includes('--strict');

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules' || entry.name === 'dist') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

// Extract a balanced {...} JS object literal starting at openBraceIdx
function extractBalancedObject(code, openBraceIdx) {
  let depth = 0;
  let quote = null;
  let inLineComment = false;
  let inBlockComment = false;

  for (let i = openBraceIdx; i < code.length; i++) {
    const ch = code[i];
    const next = code[i + 1];

    if (inLineComment) {
      if (ch === '\n') inLineComment = false;
      continue;
    }
    if (inBlockComment) {
      if (ch === '*' && next === '/') {
        inBlockComment = false;
        i++;
      }
      continue;
    }
    if (quote) {
      if (ch === '\\') {
        i++;
        continue;
      }
      if (ch === quote) quote = null;
      continue;
    }

    if (ch === '/' && next === '/') {
      inLineComment = true;
      i++;
      continue;
    }
    if (ch === '/' && next === '*') {
      inBlockComment = true;
      i++;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') {
      quote = ch;
      continue;
    }
    if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) return code.slice(openBraceIdx, i + 1);
    }
  }
  return null;
}

function loadLocalesFromJson(files) {
  const locales = {};
  for (const file of files) {
    const base = path.basename(file).toLowerCase();
    const match = base.match(/^(ar|en|fr|zh)\.json$/);
    if (!match) continue;
    try {
      locales[match[1]] = JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch (err) {
      console.warn(`::warning file=${path.relative(ROOT, file)}::Failed to parse JSON locale: ${err.message}`);
    }
  }
  return Object.keys(locales).length >= 2 ? { locales, source: 'src/**/*.json' } : null;
}

function loadLocalesFromJs(files) {
  const candidates = files.filter((f) => /\.(m?js|jsx|ts|tsx)$/.test(f));
  const declRe = /(?:export\s+)?(?:const|let|var)\s+(?:translations|dictionaries|locales|resources)\s*=\s*\{/g;

  for (const file of candidates) {
    const code = fs.readFileSync(file, 'utf8');
    declRe.lastIndex = 0;
    const match = declRe.exec(code);
    if (!match) continue;

    const openBraceIdx = match.index + match[0].length - 1;
    const literal = extractBalancedObject(code, openBraceIdx);
    if (!literal) continue;

    try {
      const evaluated = vm.runInNewContext(`(${literal})`, Object.create(null), { timeout: 1000 });
      if (evaluated && typeof evaluated === 'object') {
        const found = {};
        for (const loc of ['ar', 'en', 'fr', 'zh']) {
          if (evaluated[loc] && typeof evaluated[loc] === 'object') {
            found[loc] = evaluated[loc];
          }
        }
        if (Object.keys(found).length >= 2) {
          return { locales: found, source: path.relative(ROOT, file) };
        }
      }
    } catch (err) {
      console.warn(`::warning file=${path.relative(ROOT, file)}::Could not statically evaluate translations object (${err.message})`);
    }
  }
  return null;
}

function flatten(obj, prefix = '', out = new Map()) {
  if (typeof obj === 'string') {
    out.set(prefix, obj);
    return out;
  }
  if (Array.isArray(obj)) {
    obj.forEach((item, idx) => flatten(item, `${prefix}[${idx}]`, out));
    return out;
  }
  if (obj && typeof obj === 'object') {
    for (const [k, v] of Object.entries(obj)) {
      flatten(v, prefix ? `${prefix}.${k}` : k, out);
    }
  }
  return out;
}

function collectUsedKeys(files) {
  const used = new Set();
  const keyRe = /\bt\(\s*['"]([a-zA-Z0-9_.-]+)['"]\s*\)/g;
  for (const file of files) {
    if (!/\.(m?js|jsx|ts|tsx)$/.test(file)) continue;
    const code = fs.readFileSync(file, 'utf8');
    let m;
    while ((m = keyRe.exec(code)) !== null) {
      used.add(m[1]);
    }
  }
  return used;
}

function main() {
  const files = walk(SRC_DIR);
  const loaded = loadLocalesFromJson(files) || loadLocalesFromJs(files);

  if (!loaded) {
    console.warn('::warning::No structured multi-locale dictionary found under src/. Skipping i18n audit.');
    process.exit(0);
  }

  const { locales, source } = loaded;
  const activeLocales = TARGET_LOCALES.filter((l) => locales[l]);
  console.log(`i18n check: loaded [${activeLocales.join(', ')}] from ${source}`);

  const flatByLocale = {};
  const allKeys = new Set();
  for (const loc of activeLocales) {
    flatByLocale[loc] = flatten(locales[loc]);
    for (const key of flatByLocale[loc].keys()) allKeys.add(key);
  }

  // 1. Warn on missing keys across locales (non-blocking unless --strict)
  let totalMissing = 0;
  for (const loc of activeLocales) {
    const missing = [...allKeys].filter((k) => !flatByLocale[loc].has(k));
    totalMissing += missing.length;
    if (missing.length > 0) {
      console.warn(`\n[WARN] Locale "${loc}" is missing ${missing.length} key(s):`);
      for (const k of missing.slice(0, 25)) {
        console.warn(`  - ${k}`);
      }
      if (missing.length > 25) {
        console.warn(`  ... and ${missing.length - 25} more`);
      }
    }
  }

  // 2. Warn on t('key') references missing from locales (non-blocking)
  const usedKeys = collectUsedKeys(files);
  for (const loc of activeLocales) {
    const missingUsed = [...usedKeys].filter((k) => !flatByLocale[loc].has(k));
    if (missingUsed.length > 0) {
      console.warn(`\n[WARN] ${missingUsed.length} key(s) used via t() missing in "${loc}":`);
      for (const k of missingUsed.slice(0, 20)) {
        console.warn(`  - ${k}`);
      }
      if (missingUsed.length > 20) {
        console.warn(`  ... and ${missingUsed.length - 20} more`);
      }
    }
  }

  // 3. Fail on Arabic script leakage inside en/fr dictionaries
  const leakageErrors = [];
  for (const loc of ['en', 'fr']) {
    if (!flatByLocale[loc]) continue;
    for (const [key, val] of flatByLocale[loc].entries()) {
      const trimmed = val.trim();
      if (!ARABIC_RE.test(trimmed)) continue;
      if (ALLOWED_ARABIC_VALUES.has(trimmed)) continue;
      if (ALLOWED_ARABIC_KEY_RE.test(key)) continue;
      leakageErrors.push({ loc, key, preview: trimmed.slice(0, 80) });
    }
  }

  if (leakageErrors.length > 0) {
    console.error(`\n[ERROR] Arabic text leaked into non-Arabic locale(s) (${leakageErrors.length} occurrence(s)):`);
    for (const item of leakageErrors) {
      console.error(`::error file=${source}::[${item.loc}] ${item.key} => "${item.preview}"`);
    }
    process.exitCode = 1;
  } else {
    console.log('\n[OK] Zero Arabic text leakage detected in en/fr locales.');
  }

  if (STRICT_MISSING && totalMissing > 0) {
    console.error(`\n[ERROR] --strict enabled and ${totalMissing} missing key(s) found.`);
    process.exitCode = 1;
  }
}

main();
