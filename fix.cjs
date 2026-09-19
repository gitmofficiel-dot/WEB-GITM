const fs = require('fs');

const indexHtml = `<!doctype html>
<html lang="ar" dir="rtl" class="scroll-smooth">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/png" href="/logo.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#0B132B" />
    <link rel="apple-touch-icon" href="/logo.png" />
    <link rel="canonical" href="https://gitm.pages.dev/" />
    
    <!-- Primary Meta Tags -->
    <title>GITM | Groupe Innovation Technologique Maroc - المنصة الوطنية للابتكار التكنولوجي والذكاء الاصطناعي</title>
    <meta name="title" content="GITM | Groupe Innovation Technologique Maroc - المنصة الوطنية للابتكار التكنولوجي والذكاء الاصطناعي" />
    <meta name="description" content="مجموعة الابتكار التكنولوجي بالمغرب (GITM) - Groupe Innovation Technologique Maroc. هي منصة وطنية رائدة تهدف إلى تطوير الذكاء الاصطناعي Edge AI، إنترنت الأشياء IoT، الأنظمة المدمجة، وتأهيل الكفاءات الهندسية المغربية." />
    <meta name="keywords" content="GITM, Groupe Innovation Technologique Maroc, المنصة الوطنية للابتكار التكنولوجي, الذكاء الاصطناعي بالمغرب, إنترنت الأشياء, الأنظمة المدمجة, Edge AI, الكفاءات الهندسية, مشاريع تكنولوجية, محمد غزاوني, MOHAMMED RHZAOUNI, Abdelrazak Zdari, عبد الرزاق زداري, Morocco Tech Innovation, Casablanca Tech Hub" />
    <meta name="author" content="Groupe Innovation Technologique Maroc (GITM)" />
    
    <!-- Search Engine Indexing & Bot Directives -->
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
    <meta name="bingbot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
    <meta name="rating" content="general" />
    <meta name="distribution" content="global" />

    <!-- Open Graph / Facebook / WhatsApp -->
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="GITM - Groupe Innovation Technologique Maroc" />
    <meta property="og:url" content="https://gitm.pages.dev/" />
    <meta property="og:title" content="GITM | Groupe Innovation Technologique Maroc" />
    <meta property="og:description" content="مجموعة الابتكار التكنولوجي بالمغرب منصة رائدة للذكاء الاصطناعي وتطوير الكفاءات المغربية. مؤسسها محمد غزاوني (MOHAMMED RHZAOUNI)." />
    <meta property="og:image" content="https://gitm.pages.dev/logo.png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:locale" content="ar_MA" />
    <meta property="og:locale:alternate" content="en_US" />
    <meta property="og:locale:alternate" content="fr_FR" />

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@gitmofficiel" />
    <meta name="twitter:url" content="https://gitm.pages.dev/" />
    <meta name="twitter:title" content="GITM | Groupe Innovation Technologique Maroc" />
    <meta name="twitter:description" content="مجموعة الابتكار التكنولوجي بالمغرب المنصة الوطنية للذكاء الاصطناعي. مؤسسها محمد غزاوني." />
    <meta name="twitter:image" content="https://gitm.pages.dev/logo.png" />

    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

    <!-- Schema.org JSON-LD Structured Data -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": "https://gitm.pages.dev/#organization",
          "name": "GITM - Groupe Innovation Technologique Maroc",
          "alternateName": [
            "مجموعة الابتكار التكنولوجي بالمغرب",
            "GITM Maroc"
          ],
          "url": "https://gitm.pages.dev/",
          "logo": {
            "@type": "ImageObject",
            "url": "https://gitm.pages.dev/logo.png",
            "caption": "GITM Logo"
          },
          "image": "https://gitm.pages.dev/logo.png",
          "description": "مجموعة الابتكار التكنولوجي بالمغرب منصة وطنية للذكاء الاصطناعي وتطوير المشاريع الهندسية",
          "founder": {
            "@type": "Person",
            "name": "محمد غزاوني",
            "alternateName": ["MOHAMMED RHZAOUNI", "محمد غزاوني"],
            "birthDate": "2004-01-31",
            "birthPlace": {
              "@type": "Place",
              "name": "واد زم، المغرب"
            },
            "jobTitle": "مؤسس المجموعة والمشرف العام",
            "url": "https://gitm.pages.dev/about-us"
          },
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "MA",
            "addressLocality": "الدار البيضاء",
            "addressRegion": "الدار البيضاء-سطات"
          },
          "foundingDate": "2026",
          "sameAs": [
            "https://github.com/gitmofficiel-dot/WEB-GITM",
            "https://gitm.pages.dev"
          ]
        },
        {
          "@type": "WebSite",
          "@id": "https://gitm.pages.dev/#website",
          "url": "https://gitm.pages.dev/",
          "name": "GITM Official Platform",
          "publisher": {
            "@id": "https://gitm.pages.dev/#organization"
          }
        }
      ]
    }
    </script>
  </head>
  <body class="bg-slate-50 dark:bg-cyber-bg text-slate-900 dark:text-cyber-text transition-colors duration-300">
    <div id="root">
      <noscript>
        <header>
          <h1>GITM - Groupe Innovation Technologique Maroc - مجموعة الابتكار التكنولوجي بالمغرب</h1>
          <p>المنصة الوطنية للابتكار التكنولوجي والذكاء الاصطناعي. مؤسسها محمد غزاوني (MOHAMMED RHZAOUNI) من مدينة واد زم.</p>
        </header>
      </noscript>
    </div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>`;
fs.writeFileSync('index.html', indexHtml, 'utf8');

// Also update About.jsx properly without regex replacing garbled text, just replace the whole content from scratch by reading it, finding the spots and injecting.
let aboutContent = fs.readFileSync('src/components/About.jsx', 'utf8');

// We just replace the schemaMarkup variable
const newSchemaStr = `const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "مجموعة الابتكار التكنولوجي بالمغرب",
    "alternateName": "Groupe Innovation Technologique Maroc (GITM)",
    "url": "https://gitm.pages.dev",
    "logo": "https://gitm.pages.dev/logo.png",
    "founder": {
      "@type": "Person",
      "name": "محمد غزاوني",
      "alternateName": "MOHAMMED RHZAOUNI",
      "birthDate": "2004-01-31",
      "birthPlace": {
        "@type": "Place",
        "name": "واد زم، المغرب"
      },
      "jobTitle": "مؤسس المجموعة والمشرف العام"
    }
  };`;
aboutContent = aboutContent.replace(/const schemaMarkup = \{[\s\S]*?\};\n/, newSchemaStr + '\n');

// The garbled Arabic strings in the initial state object
aboutContent = aboutContent.replace(/vision_ar: '.*?',/, "vision_ar: 'ريادة تطوير الذكاء الاصطناعي المغربي وتصديره عالميا، وبناء جسور متينة للإبداع التقني المبتكر والتفوق الأكاديمي.',");
aboutContent = aboutContent.replace(/mission_ar: '.*?',/, "mission_ar: 'توفير بيئة بحثية متقدمة للمواهب المغربية لبناء أنظمة ذكية بدعم وطني.',");
aboutContent = aboutContent.replace(/history_ar: '.*?',/, "history_ar: 'تأسست GITM لتوحيد المبدعين والمبتكرين المغاربة. نسعى لتوفير بيئة تكنولوجية متكاملة تفتح آفاقاً جديدة للشباب المغربي.',");

// The garbled Strings below
aboutContent = aboutContent.replace(/pageTitle = lang === 'ar' \? '.*?' : 'About Us \| MOHAMMED RHZAOUNI - GITM Founder';/, "pageTitle = lang === 'ar' ? 'من نحن | محمد غزاوني - مؤسس GITM' : 'About Us | MOHAMMED RHZAOUNI - GITM Founder';");
aboutContent = aboutContent.replace(/pageDesc = lang === 'ar' \? '.*?' : '.*?'/, "pageDesc = lang === 'ar' ? 'نحن منصة تكنولوجية مغربية رائدة. محمد غزاوني - MOHAMMED RHZAOUNI هو مؤسس مجموعة الابتكار التكنولوجي بالمغرب GITM.' : 'We are a leading Moroccan tech initiative. MOHAMMED RHZAOUNI is the founder of GITM.';");

// HTML text replacements
aboutContent = aboutContent.replace(/\{lang === 'ar' \? 'U\.U\+O,U\.Oc .*?' : 'National Organization, Global Vision'\}/, "{lang === 'ar' ? 'منظمة وطنية برؤية عالمية' : 'National Organization, Global Vision'}");
aboutContent = aboutContent.replace(/\{lang === 'ar' \? 'U\+OU\+O1 .*?' : 'Building Tech from Morocco to the World'\}/, "{lang === 'ar' ? 'نبني التكنولوجيا من المغرب إلى العالم' : 'Building Tech from Morocco to the World'}");
aboutContent = aboutContent.replace(/\{lang === 'ar'\s*\?\s*'O U\,U\.OOU\.U\^O1Oc .*?'\s*:\s*'The Moroccan Group.*?'\}/, "{lang === 'ar' ? 'مجموعة الابتكار التكنولوجي بالمغرب (GITM) تقود التحول الرقمي وتفتح آفاقاً للشباب المغربي.' : 'The Moroccan Group for Technological Innovation (GITM) leads digital transformation and opens horizons for Moroccan youth globally.'}");

aboutContent = aboutContent.replace(/\{lang === 'ar' \? 'O U\,OO USOc O U\,O1O U\,U\.USOc' : 'Global Vision'\}/, "{lang === 'ar' ? 'الرؤية العالمية' : 'Global Vision'}");
aboutContent = aboutContent.replace(/\{lang === 'ar' \? 'O U\,O3O U\,Oc O U\,U\^OU\+USOc' : 'National Mission'\}/, "{lang === 'ar' ? 'المهمة الوطنية' : 'National Mission'}");
aboutContent = aboutContent.replace(/\{lang === 'ar' \? 'OO-U\,Oc O U\,OOO3USO3' : 'Our Journey'\}/, "{lang === 'ar' ? 'رحلة التأسيس' : 'Our Journey'}");

aboutContent = aboutContent.replace(/\{lang === 'ar'\s*\?\s*'OOO3OO GITM .*?'\s*:\s*'GITM was founded.*?'\}/, "{lang === 'ar' ? 'تأسست GITM لتوحيد المبدعين والمبتكرين المغاربة. نسعى لتوفير بيئة تكنولوجية متكاملة تفتح آفاقاً جديدة للشباب المغربي.' : 'GITM was founded to unite Moroccan creators and innovators. We strive to provide an integrated technological environment that opens new horizons for Moroccan youth.'}");

aboutContent = aboutContent.replace(/\{lang === 'ar' \? 'U\.O-U\.O_ OOO U\^U\+US' : 'MOHAMMED RHZAOUNI'\}/, "{lang === 'ar' ? 'محمد غزاوني' : 'MOHAMMED RHZAOUNI'}");
aboutContent = aboutContent.replace(/\{lang === 'ar' \? 'U\.O O3O3 O U\,U\.OU\.U\^O1Oc U\^O U\,U\.O'OU\? O U\,O1O U\.' : 'Founder & General Supervisor'\}/, "{lang === 'ar' ? 'مؤسس المجموعة والمشرف العام' : 'Founder & General Supervisor'}");

aboutContent = aboutContent.replace(/\{lang === 'ar' \? 'OO OUSOr U\^U\.UO U\+ O U\,O OO_USO O_: .*?' : 'Born: January 31, 2004 in Oued Zem, Morocco\.'\}/, "{lang === 'ar' ? 'تاريخ ومكان الازدياد: 31 يناير 2004 بمدينة واد زم، المغرب.' : 'Born: January 31, 2004 in Oued Zem, Morocco.'}");

aboutContent = aboutContent.replace(/\{lang === 'ar'\s*\?\s*'U\.O-U\.O_ OOO U\^U\+US U\^ O'O O" .*?'\s*:\s*'Mohammed Rhzaouni is a young Moroccan.*?'\}/, "{lang === 'ar' ? 'محمد غزاوني (MOHAMMED RHZAOUNI) هو شاب مغربي شغوف بالتكنولوجيا والابتكار. يكرس جهده من خلال هذه المجموعة لقيادة المشاريع التقنية وتوفير بيئة خصبة للإبداع التكنولوجي.' : 'Mohammed Rhzaouni is a young Moroccan with a great passion for technology and innovation. He dedicates his effort through this group to lead technical projects and provide a fertile environment for technological creativity.'}");

aboutContent = aboutContent.replace(/\{lang === 'ar' \? 'OOU\,O U\.U\+O  U\^OU\+OO OOOU\+O ' : 'Our Impact'\}/, "{lang === 'ar' ? 'أثرنا الملموس' : 'Our Impact'}");
aboutContent = aboutContent.replace(/\{lang === 'ar' \? 'O U\,O U\+OU\,O U\,Oc' : 'Launch'\}/, "{lang === 'ar' ? 'الانطلاقة' : 'Launch'}");
aboutContent = aboutContent.replace(/\{lang === 'ar' \? 'U\.O'OU\^O1O U< U\.O\"OUUOO U<' : 'Innovative Projects'\}/, "{lang === 'ar' ? 'مشاريع مبتكرة' : 'Innovative Projects'}");
aboutContent = aboutContent.replace(/\{lang === 'ar' \? 'O1O U\^ OUO O_USU\.US' : 'Academic Members'\}/, "{lang === 'ar' ? 'أعضاء أكاديميون' : 'Academic Members'}");

aboutContent = aboutContent.replace(/\{lang === 'ar' \? 'U\?OUSU\,U\+O  O U\,U\.OU\.USO' : 'Our Exceptional Team'\}/, "{lang === 'ar' ? 'فريقنا الاستثنائي' : 'Our Exceptional Team'}");
aboutContent = aboutContent.replace(/\{lang === 'ar' \? 'U\+OrO\"Oc U\.U\+ O U\,U\.UU\+O_O3USU\+ .*?' : 'An elite group of engineers.*?'\}/, "{lang === 'ar' ? 'نخبة من المهندسين والباحثين يحولون رؤية GITM إلى واقع.' : 'An elite group of engineers and researchers turning GITM vision into reality.'}");

aboutContent = aboutContent.replace(/\{lang === 'ar' \? 'OO1O O O O U\,U\?OUSU\, O U\,OO3U\.USUSU\+' : 'Official Team Members'\}/, "{lang === 'ar' ? 'الأعضاء الرسميون للفريق' : 'Official Team Members'}");
aboutContent = aboutContent.replace(/\{lang === 'ar' \? 'OO1O O O O U\,U\?OUSU\, O U\,O_O OrU\,US' : 'Internal Team'\}/, "{lang === 'ar' ? 'الفريق الداخلي' : 'Internal Team'}");

aboutContent = aboutContent.replace(/\{lang === 'ar' \? 'U\.O'O OUUSO1' : 'Projects'\}/g, "{lang === 'ar' ? 'مشاريع' : 'Projects'}");

fs.writeFileSync('src/components/About.jsx', aboutContent, 'utf8');
