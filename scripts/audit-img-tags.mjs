#!/usr/bin/env node
import { promises as fs } from 'fs';
import path from 'path';

const exts = new Set(['.js', '.jsx', '.ts', '.tsx']);

async function* walk(dir) {
  for (const d of await fs.readdir(dir, { withFileTypes: true })) {
    const entry = path.join(dir, d.name);
    if (d.isDirectory()) {
      if (
        d.name === 'node_modules' ||
        d.name === '.next' ||
        d.name === 'dist' ||
        d.name === 'coverage' ||
        d.name === '__tests__' ||
        d.name === '__mocks__' ||
        d.name === 'stories'
      )
        continue;
      yield* walk(entry);
    } else if (exts.has(path.extname(d.name))) {
      // Skip common test/spec/story files
      if (
        /\.(test|spec)\.(js|jsx|ts|tsx)$/i.test(d.name) ||
        /\.stories\.(js|jsx|ts|tsx)$/i.test(d.name)
      ) {
        continue;
      }
      yield entry;
    }
  }
}

async function main() {
  const root = process.cwd();
  const srcDir = path.join(root, 'src');
  const matches = [];

  for await (const file of walk(srcDir)) {
    const text = await fs.readFile(file, 'utf8');
    // naive match for <img ...> that's not in a comment
    const regex = /<img\b[^>]*>/gi;
    let m;
    while ((m = regex.exec(text))) {
      const before = text.slice(0, m.index);
      const line = before.split(/\r?\n/).length;
      matches.push({
        file: path.relative(root, file),
        line,
        snippet: m[0].slice(0, 120) + (m[0].length > 120 ? '…' : ''),
      });
    }
  }

  if (matches.length === 0) {
    console.log('✅ No <img> tags found.');
    return;
  }

  console.log(`⚠️ Found ${matches.length} <img> tag(s) that may need migration to next/image:`);
  for (const m of matches) {
    console.log(` - ${m.file}:${m.line} ${m.snippet}`);
  }
  process.exitCode = 1; // fail CI to prompt action if desired
}

main().catch((e) => {
  console.error('audit-img-tags failed:', e);
  process.exit(1);
});
