const fs = require('fs');
const path = require('path');

const filePath = path.join('e:', 'GITM', 'src', 'translations', 'dictionary.js');
let content = fs.readFileSync(filePath, 'utf8');

const arContact = `
    contact: {
      title: 'اتصل بنا',
      subtitle: 'نحن هنا للإجابة على استفساراتك واستقبال مقترحاتك',
      infoTitle: 'معلومات التواصل',
      infoDesc: 'يمكنك التواصل معنا عبر البريد الإلكتروني الرسمي أو تحديد موعد لاجتماع.',
      officialEmail: 'البريد الرسمي: contact@gitm.ma',
      location: 'المقر: المغرب',
      scheduleBtn: 'تحديد موعد',
      formTitle: 'أرسل رسالة',
      success: 'تم إرسال رسالتك بنجاح. سنتواصل معك قريباً.',
      name: 'الاسم الكامل',
      email: 'البريد الإلكتروني',
      subject: 'الموضوع',
      message: 'الرسالة',
      sending: 'جاري الإرسال...',
      submit: 'إرسال الرسالة',
    },
`;

const enContact = `
    contact: {
      title: 'Contact Us',
      subtitle: 'We are here to answer your questions and receive your suggestions',
      infoTitle: 'Contact Information',
      infoDesc: 'You can reach out via our official email or schedule a meeting.',
      officialEmail: 'Official Email: contact@gitm.ma',
      location: 'Location: Morocco',
      scheduleBtn: 'Schedule Meeting',
      formTitle: 'Send a Message',
      success: 'Your message has been sent successfully. We will contact you soon.',
      name: 'Full Name',
      email: 'Email Address',
      subject: 'Subject',
      message: 'Message',
      sending: 'Sending...',
      submit: 'Send Message',
    },
`;

const frContact = `
    contact: {
      title: 'Nous Contacter',
      subtitle: 'Nous sommes là pour répondre à vos questions et recevoir vos suggestions',
      infoTitle: 'Informations de Contact',
      infoDesc: 'Vous pouvez nous joindre par email ou planifier une réunion.',
      officialEmail: 'Email Officiel : contact@gitm.ma',
      location: 'Emplacement : Maroc',
      scheduleBtn: 'Planifier une Réunion',
      formTitle: 'Envoyer un Message',
      success: 'Votre message a été envoyé avec succès. Nous vous contacterons bientôt.',
      name: 'Nom Complet',
      email: 'Adresse Email',
      subject: 'Sujet',
      message: 'Message',
      sending: 'Envoi...',
      submit: 'Envoyer le Message',
    },
`;

const zhContact = `
    contact: {
      title: '联系我们',
      subtitle: '我们随时准备回答您的问题并听取您的建议',
      infoTitle: '联系方式',
      infoDesc: '您可以通过官方电子邮件联系我们或安排会议。',
      officialEmail: '官方邮箱: contact@gitm.ma',
      location: '地点: 摩洛哥',
      scheduleBtn: '安排会议',
      formTitle: '发送消息',
      success: '您的消息已成功发送。我们将尽快与您联系。',
      name: '全名',
      email: '电子邮件',
      subject: '主题',
      message: '消息',
      sending: '发送中...',
      submit: '发送消息',
    },
`;

const tzmContact = `
    contact: {
      title: 'ⴰⵏⵎⵢⴰⵡⴰⴹ',
      subtitle: 'ⵏⵍⵍⴰ ⴷⴰ ⵃⵎⴰ ⴰⴷ ⵏⵔⴰⵔ ⵖⴼ ⵉⵙⵇⵙⵉⵜⵏ ⵏⵏⵓⵏ',
      infoTitle: 'ⵉⵏⵖⵎⵉⵙⵏ ⵏ ⵓⵎⵢⴰⵡⴰⴹ',
      infoDesc: 'ⵜⵣⵎⵔⵎ ⴰⴷ ⵜⵎⵢⴰⵡⴰⴹⵎ ⵢⵉⴷⵏⵖ.',
      officialEmail: 'ⵜⴰⴱⵔⴰⵜ ⵜⴰⵎⴰⴷⴷⵓⴷⵜ: contact@gitm.ma',
      location: 'ⴰⴷⵖⴰⵔ: ⵍⵎⵖⵔⵉⴱ',
      scheduleBtn: 'ⵙⵡⵓⵜⵜⵓ ⴰⵏⵎⵓⵇⵇⴰⵔ',
      formTitle: 'ⴰⵣⵏ ⵜⴰⴱⵔⴰⵜ',
      success: 'ⵜⴻⵜⵜⵡⴰⵣⵏ ⵜⴱⵔⴰⵜ ⵏⵏⵓⵏ ⵙ ⵓⵎⵓⵔⵙ.',
      name: 'ⵉⵙⵎ ⵉⵎⵎⵉⴷⵏ',
      email: 'ⵜⴰⵏⴼⵉⵍⵓⵜ ⵜⴰⵍⵉⴽⵟⵕⵓⵏⵉⵜ',
      subject: 'ⴰⵙⵏⵜⵍ',
      message: 'ⵜⴰⴱⵔⴰⵜ',
      sending: 'ⴰⵣⴰⵏ...',
      submit: 'ⴰⵣⵏ ⵜⴰⴱⵔⴰⵜ',
    },
`;

content = content.replace(/teamAbout: 'تعرف علينا',\s*\},/g, "teamAbout: 'تعرف علينا',\n    }," + arContact);
content = content.replace(/teamAbout: 'About Us',\s*\},/g, "teamAbout: 'About Us',\n    }," + enContact);
content = content.replace(/teamAbout: 'À propos de nous',\s*\},/g, "teamAbout: 'À propos de nous',\n    }," + frContact);
content = content.replace(/teamAbout: '关于我们',\s*\},/g, "teamAbout: '关于我们',\n    }," + zhContact);
content = content.replace(/teamAbout: 'ⵖⴼ ⴰⵏⵖ',\s*\},/g, "teamAbout: 'ⵖⴼ ⴰⵏⵖ',\n    }," + tzmContact);

fs.writeFileSync(filePath, content);
console.log('Done!');
