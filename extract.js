import fs from 'fs';
import path from 'path';

function getFiles(dir, filesList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const stat = fs.statSync(path.join(dir, file));
    if (stat.isDirectory()) {
      getFiles(path.join(dir, file), filesList);
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      filesList.push(path.join(dir, file));
    }
  }
  return filesList;
}

const files = getFiles('src');
let matches = [];
const regex = /lang\s*===\s*['"]ar['"]\s*\?\s*['"]([^'"]+)['"]\s*:\s*['"]([^'"]+)['"]/g;
const regex2 = /lang\s*===\s*['"]ar['"]\s*\?\s*([^]+)\s*:\s*([^]+)/g;

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  let match;
  while ((match = regex.exec(content)) !== null) {
    matches.push({ file, ar: match[1], en: match[2], original: match[0] });
  }
  while ((match = regex2.exec(content)) !== null) {
    matches.push({ file, ar: match[1], en: match[2], original: match[0] });
  }
}

fs.writeFileSync('extracted.json', JSON.stringify(matches, null, 2));
console.log('Extracted ' + matches.length + ' strings.');
