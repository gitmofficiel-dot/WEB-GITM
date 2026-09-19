const fs = require('fs');

let content = fs.readFileSync('src/components/About.jsx', 'utf8');

// Find the end of schemaMarkup declaration
const schemaEnd = content.indexOf('};', content.indexOf('const schemaMarkup = {')) + 2;

const schemaInjection = `
  if (teamMembers.official.length > 0 || teamMembers.internal.length > 0) {
    const allMembers = [...teamMembers.official, ...teamMembers.internal];
    schemaMarkup.employee = allMembers.map(member => {
      const socialLinks = [];
      if (member.socialLinks?.linkedin) socialLinks.push(member.socialLinks.linkedin);
      if (member.socialLinks?.github) socialLinks.push(member.socialLinks.github);
      if (member.socialLinks?.facebook) socialLinks.push(member.socialLinks.facebook);
      
      return {
        "@type": "Person",
        "name": member.name,
        "jobTitle": member.role,
        "image": member.image,
        "sameAs": socialLinks
      };
    });
  }
`;

if (!content.includes('schemaMarkup.employee =')) {
  content = content.substring(0, schemaEnd) + '\n' + schemaInjection + content.substring(schemaEnd);
  fs.writeFileSync('src/components/About.jsx', content, 'utf8');
}
