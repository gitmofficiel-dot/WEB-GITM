import fs from 'fs';
import { globSync } from 'glob';

const files = globSync('src/**/*.jsx');
let totalMatches = 0;
let replaceCount = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;
  
  // Replace const { lang... } = useLanguage() with const { lang, t_inline... } = useLanguage()
  if (content.includes('useLanguage()') && !content.includes('t_inline')) {
    content = content.replace(/const\s+\{\s*([^}]*lang[^}]*)\}\s*=\s*useLanguage\(\)/g, (match, inner) => {
      return `const { ${inner.trim()}, t_inline } = useLanguage()`;
    });
  }

  // Find all instances of lang === 'ar' ? ... : ...
  // This is a complex regex. A simpler approach is to match the exact pattern:
  // lang === 'ar' ? "string1" : "string2"
  // lang === 'ar' ? 'string1' : 'string2'
  // lang === 'ar' ? \`string1\` : \`string2\`
  
  // Let's use a simpler regex that just matches the structure:
  // lang === 'ar' ? A : B
  // where A and B can be strings, template literals, or simple variables
  
  const regex = /lang\s*===\s*['"]ar['"]\s*\?\s*([^:]+)\s*:\s*([^<>\n}]+)/g;
  
  content = content.replace(regex, (match, arStr, enStr) => {
    totalMatches++;
    return `t_inline(${arStr.trim()}, ${enStr.trim()})`;
  });
  
  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    replaceCount++;
  }
});

console.log('Total matches replaced:', totalMatches);
console.log('Files modified:', replaceCount);
