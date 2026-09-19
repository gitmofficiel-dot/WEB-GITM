const fs = require('fs');
let code = fs.readFileSync('src/context/LanguageContext.jsx', 'utf8');

const tFunc = `
  // 5. Translation Helper
  const t = (key) => {
    if (!key) return '';
    const keys = key.split('.');
    let result = translations[lang];
    for (let k of keys) {
      if (result && result[k]) {
        result = result[k];
      } else {
        // Fallback to English if not found
        let enResult = translations['en'];
        for (let ek of keys) {
          if (enResult && enResult[ek]) {
            enResult = enResult[ek];
          } else {
            return key; // return key if not found in both
          }
        }
        return enResult || key;
      }
    }
    return result;
  };
`;

if (!code.includes('const t = (key) =>')) {
  code = code.replace(/const \[activeDashboardRole, setActiveDashboardRole\] = useState\('student'\);/, 'const [activeDashboardRole, setActiveDashboardRole] = useState(\\'student\\');\n' + tFunc);
  code = code.replace(/return \(\s*<LanguageContext\.Provider value=\{\{\s*lang,/, 'return (\n    <LanguageContext.Provider value={{ lang, t, ');
  fs.writeFileSync('src/context/LanguageContext.jsx', code);
  console.log('Updated LanguageContext.jsx');
}
