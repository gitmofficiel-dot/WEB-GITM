import { build } from 'vite';
import fs from 'node:fs';
import { parse } from 'espree';
import config from '../vite.config.js';
try {
  for (const file of ['components/About.jsx', 'components/AutomaticContent.jsx', 'components/NewsPage.jsx', 'components/EventsPage.jsx']) {
    try { parse(fs.readFileSync(`src/${file}`, 'utf8'), { ecmaVersion: 'latest', sourceType: 'module', ecmaFeatures: { jsx: true } }); }
    catch (error) { throw new Error(`${file}:${error.lineNumber}: ${error.message}`); }
  }
  console.log('Changed components parsed successfully');
  await build({ ...config, configFile: false });
} catch (error) { console.error(String(error).replace(/\x1b\[[0-9;]*m/g, '')); process.exit(1); }
