const fs = require('fs');

let seoContent = fs.readFileSync('src/components/SEO.jsx', 'utf8');

seoContent = seoContent.replace(/description = '.*?'/, "description = 'المنصة الوطنية للابتكار التكنولوجي والذكاء الاصطناعي بالمغرب - Groupe Innovation Technologique Maroc'");
seoContent = seoContent.replace(/keywords = '.*?'/, "keywords = 'GITM, Groupe Innovation Technologique Maroc, الذكاء الاصطناعي, الابتكار التكنولوجي, المغرب, Edge AI, IoT'");

fs.writeFileSync('src/components/SEO.jsx', seoContent, 'utf8');
