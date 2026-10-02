const fs = require('fs');

const path = 'e:/GITM/src/components/dashboards/PresidentDashboard.jsx';
let content = fs.readFileSync(path, 'utf8');

const bad = `    const unsubUsers = onSnapshot(collection(db, 'users'), snap => {\n    const unsubUsers = onSnapshot(collection(db, 'users'), snap => {\n      const usersData = snap.docs.map(d => ({id: d.id, ...d.data()}));\n      const roleOrder = { 'president': 1, 'supervisor': 2, 'teacher': 3, 'partner': 4, 'university': 5, 'content_manager': 6, 'member': 7, 'student': 8, 'suspended': 9 };\n      usersData.sort((a, b) => {\n        const orderA = roleOrder[a.role] || 10;\n        const orderB = roleOrder[b.role] || 10;\n        if (orderA !== orderB) return orderA - orderB;\n        return (a.nameLatin || a.name || '').localeCompare(b.nameLatin || b.name || '');\n      });\n      setAllUsers(usersData);\n    });\n    });`;

const good = `    const unsubUsers = onSnapshot(collection(db, 'users'), snap => {\n      const usersData = snap.docs.map(d => ({id: d.id, ...d.data()}));\n      const roleOrder = { 'president': 1, 'supervisor': 2, 'teacher': 3, 'partner': 4, 'university': 5, 'content_manager': 6, 'member': 7, 'student': 8, 'suspended': 9 };\n      usersData.sort((a, b) => {\n        const orderA = roleOrder[a.role] || 10;\n        const orderB = roleOrder[b.role] || 10;\n        if (orderA !== orderB) return orderA - orderB;\n        return (a.nameLatin || a.name || '').localeCompare(b.nameLatin || b.name || '');\n      });\n      setAllUsers(usersData);\n    });`;

content = content.replace(bad.replace(/\n/g, '\r\n'), good.replace(/\n/g, '\r\n'));
content = content.replace(bad, good);

fs.writeFileSync(path, content, 'utf8');
console.log('done');
