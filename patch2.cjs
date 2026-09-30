const fs = require('fs');

let content = fs.readFileSync('src/components/dashboards/PresidentDashboard.jsx', 'utf8');

const importStr = "import { autoFetchNewsAndEvents } from '../../services/autoFetchService';";
if (!content.includes('autoFetchNewsAndEvents')) {
  content = content.replace(
    "import React, { useState, useEffect } from 'react';",
    "import React, { useState, useEffect } from 'react';\n" + importStr
  );
}

const target1 = "return () => { unsubNews(); unsubCourses(); unsubEvents(); unsubGallery(); unsubProjects(); unsubPartners(); unsubAbout(); unsubUsers(); };\r\n  }, []);";
const target2 = "return () => { unsubNews(); unsubCourses(); unsubEvents(); unsubGallery(); unsubProjects(); unsubPartners(); unsubAbout(); unsubUsers(); };\n  }, []);";

const hook = `

  useEffect(() => {
    const runAutoFetch = async () => {
      const lastFetch = localStorage.getItem('last_gitm_auto_fetch');
      const today = new Date().toISOString().split('T')[0];
      if (lastFetch !== today) {
        console.log('Running daily auto-fetch for news and events...');
        const res = await autoFetchNewsAndEvents();
        if (res && res.success && (res.addedNews > 0 || res.addedEvents > 0)) {
           toast.success(lang === 'ar' ? \`تم جلب \${res.addedNews} خبر و \${res.addedEvents} فعالية تلقائياً\` : \`Auto-fetched \${res.addedNews} News & \${res.addedEvents} Events\`);
           localStorage.setItem('last_gitm_auto_fetch', today);
        } else if (res && res.success) {
           localStorage.setItem('last_gitm_auto_fetch', today);
        }
      }
    };
    runAutoFetch();
  }, [lang]);
`;

if (content.includes(target1)) {
  content = content.replace(target1, target1 + hook);
} else if (content.includes(target2)) {
  content = content.replace(target2, target2 + hook);
}

fs.writeFileSync('src/components/dashboards/PresidentDashboard.jsx', content, 'utf8');
console.log('Done');
