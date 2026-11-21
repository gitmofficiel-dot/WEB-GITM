export const missingKeys = {
  // ═══════════════════════════════════════════
  //  العربية (Arabic)
  // ═══════════════════════════════════════════
  ar: {
    lang: 'ar',
    archive: {
      title: 'الأرشيف التقني والميداني',
      subtitle: 'سجل موثّق لأبرز التجارب المخبرية، النماذج الأولية، والفعاليات التقنية التي أنجزتها مجموعة GITM.',
      labElectronics: 'مختبر الإلكترونيات والأنظمة المدمجة',
      labElectronicsDesc: 'تصميم الدوائر الإلكترونية، اختبار المتحكمات الدقيقة، وتطوير البطاقات الذكية لمشاريع الأتمتة.',
      fieldRobotics: 'اختبارات الروبوتات الميدانية',
      fieldRoboticsDesc: 'تجارب ميدانية لأنظمة الملاحة الذاتية والتحكم عن بُعد في بيئات حقيقية.',
      smartCityDeploy: 'نشر حلول المدن الذكية',
      smartCityDeployDesc: 'تطبيق شبكات الاستشعار وإنترنت الأشياء لمتابعة الطاقة والبيئة والبنية التحتية.',
      cloudTelemetry: 'القياس عن بُعد والسحابة',
      cloudTelemetryDesc: 'بناء لوحات مراقبة لحظية لجمع بيانات المستشعرات وتحليلها عبر البنية السحابية.',
      labAI: 'مختبر الذكاء الاصطناعي والرؤية الحاسوبية',
      labAIDesc: 'تدريب نماذج التعلم العميق ومعالجة الصور لتشغيل الأنظمة الذكية والروبوتات.',
      communityExpo: 'المعارض والملتقيات المجتمعية',
      communityExpoDesc: 'عروض حية وورشات تفاعلية لتقريب التكنولوجيا والهندسة من الطلبة والمهتمين.',
    },
    auth: {
      loginTitle: 'تسجيل الدخول إلى حسابك',
      registerTitle: 'إنشاء حساب جديد',
      forgotPassword: 'هل نسيت كلمة المرور؟',
      name: 'الاسم الكامل',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      loginBtn: 'تسجيل الدخول',
      registerBtn: 'إنشاء الحساب',
      dontHaveAccount: 'ليس لديك حساب بعد؟',
      alreadyHaveAccount: 'لديك حساب بالفعل؟',
      roles: {
        president: 'الرئيس',
        teacher: 'أستاذ ومؤطّر',
        member: 'عضو',
        student: 'طالب',
        partner: 'شريك',
        university: 'جامعة ومؤسسة تعليمية',
        contentManager: 'مدير المحتوى',
        supervisor: 'مشرف تقني',
      },
    },
    contact: {
      rateLimit: 'يرجى الانتظار دقيقة واحدة قبل إرسال رسالة جديدة.',
      error: 'تعذر إرسال الرسالة حالياً. يرجى المحاولة لاحقاً.',
    },
    dashboards: {
      demoControl: 'وضع المعاينة التفاعلي',
      demoDesc: 'بدّل بين مختلف أدوار المنصة لاستكشاف لوحات التحكم والصلاحيات المتاحة لكل دور.',
    },
    hero: {
      titles: [
        'منصة المهندسين المغاربة للإبداع',
        'نبتكر حلول الذكاء الاصطناعي والروبوتات',
        'نبني الجيل القادم من الأنظمة الذكية',
      ],
    },
    methodology: {
      title: 'منهجيتنا الهندسية',
      subtitle: 'مسار عمل منظم يحوّل الأفكار الطموحة إلى أنظمة تقنية موثوقة وقابلة للتطبيق.',
      steps: [
        {
          number: '01',
          title: 'التحليل وتحديد المتطلبات',
          desc: 'دراسة المشكلة الميدانية بدقة وتحديد المواصفات التقنية والقيود التشغيلية.',
        },
        {
          number: '02',
          title: 'التصميم وبناء النموذج الأولي',
          desc: 'هندسة العتاد والبرمجيات وبناء نموذج أولي قابل للاختبار السريع.',
        },
        {
          number: '03',
          title: 'الاختبار والتحقق الميداني',
          desc: 'إخضاع النظام لاختبارات الأداء والأمان في ظروف تشغيل حقيقية.',
        },
        {
          number: '04',
          title: 'النشر والتطوير المستمر',
          desc: 'إطلاق الحل التقني ومتابعته بالتحديثات والتوثيق المفتوح.',
        },
      ],
    },
    showcase: {
      title: 'معرض الابتكارات الهندسية',
      subtitle: 'نماذج مختارة من المشاريع التي طوّرها مهندسو GITM في المدن الذكية والروبوتات والمنصات الرقمية.',
      problem: 'التحدي التقني',
      techUsed: 'التقنيات المستخدمة',
      archDiagram: 'المخطط المعماري للنظام',
      categories: {
        smartCity: 'المدن الذكية',
        robotics: 'الروبوتات والأنظمة المدمجة',
        platforms: 'المنصات والأنظمة الرقمية',
      },
      projects: {
        smartCity: [
          {
            title: 'شبكة مراقبة الطاقة والإنارة الذكية',
            problem: 'ارتفاع استهلاك الطاقة وصعوبة رصد الأعطال الميدانية في الوقت الحقيقي.',
            desc: 'نظام إنترنت أشياء يراقب الاستهلاك لحظياً ويرسل تنبيهات فورية للصيانة الوقائية.',
            tech: ['ESP32', 'MQTT', 'Cloud Telemetry', 'React'],
          },
        ],
        robotics: [
          {
            title: 'روبوت زراعي وميداني ذاتي التوجيه',
            problem: 'الحاجة إلى أتمتة المسح الميداني والمراقبة الزراعية بدقة وتكلفة منخفضة.',
            desc: 'منصة روبوتية مزودة بمستشعرات بيئية ورؤية حاسوبية للعمل الميداني المستقل.',
            tech: ['ROS', 'Embedded C++', 'Computer Vision', 'LiDAR'],
          },
        ],
        platforms: [
          {
            title: 'بوابة GITM للبيانات والتشخيص الذكي',
            problem: 'تشتت أدوات التشخيص والتكوين التقني وصعوبة إتاحتها للمهندسين والطلبة.',
            desc: 'منصة سحابية موحدة للتشخيص التقني، إدارة المشاريع، والتعلم التطبيقي.',
            tech: ['React', 'Cloudflare Workers', 'Firebase', 'MCP'],
          },
        ],
      },
    },
    tech: {
      title: 'البنية التقنية والتخصصات',
      subtitle: 'مجموعة متكاملة من البرمجيات والعتاد وتقنيات الذكاء الاصطناعي التي نعتمدها في مشاريعنا.',
      boundaryTitle: 'تكامل العتاد والبرمجيات',
      boundaryDesc: 'نجمع بين التصميم الإلكتروني منخفض المستوى والأنظمة السحابية الحديثة لبناء حلول متكاملة من المستشعر حتى واجهة المستخدم.',
      categories: {
        software: 'البرمجيات والمنصات',
        hardware: 'العتاد والأنظمة المدمجة',
        ai: 'الذكاء الاصطناعي والبيانات',
      },
      items: {
        software: ['React & Vite', 'Cloudflare Workers', 'Firebase & Firestore', 'Linux / GITM OS', 'Rust & Python'],
        hardware: ['ESP32 & STM32', 'PCB Design', 'CAN Bus & OBD-II', 'IoT Sensors', 'Robotics Actuators'],
        ai: ['Computer Vision', 'Edge AI', 'LLM & MCP Integration', 'Predictive Analytics', 'Telemetry Pipelines'],
      },
    },
  },

  // ═══════════════════════════════════════════
  //  English
  // ═══════════════════════════════════════════
  en: {
    lang: 'en',
    archive: {
      title: 'Technical & Field Archive',
      subtitle: 'A documented record of GITM laboratory experiments, engineering prototypes, and field deployments.',
      labElectronics: 'Electronics & Embedded Systems Lab',
      labElectronicsDesc: 'Circuit design, microcontroller validation, and custom board development for automation projects.',
      fieldRobotics: 'Field Robotics Testing',
      fieldRoboticsDesc: 'Real-world trials of autonomous navigation, telemetry, and remote control systems.',
      smartCityDeploy: 'Smart City Deployments',
      smartCityDeployDesc: 'IoT sensor networks deployed to monitor energy, environmental metrics, and urban infrastructure.',
      cloudTelemetry: 'Cloud Telemetry & Monitoring',
      cloudTelemetryDesc: 'Real-time dashboards for ingesting, analyzing, and visualizing connected device data.',
      labAI: 'AI & Computer Vision Lab',
      labAIDesc: 'Deep learning and visual perception models powering intelligent diagnostics and robotics.',
      communityExpo: 'Community Exhibitions & Workshops',
      communityExpoDesc: 'Live demonstrations and hands-on workshops bringing applied engineering closer to students and builders.',
    },
    auth: {
      loginTitle: 'Sign In to Your Account',
      registerTitle: 'Create a New Account',
      forgotPassword: 'Forgot your password?',
      name: 'Full Name',
      email: 'Email Address',
      password: 'Password',
      loginBtn: 'Sign In',
      registerBtn: 'Create Account',
      dontHaveAccount: "Don't have an account yet?",
      alreadyHaveAccount: 'Already have an account?',
      roles: {
        president: 'President',
        teacher: 'Instructor & Mentor',
        member: 'Member',
        student: 'Student',
        partner: 'Partner',
        university: 'University & Institution',
        contentManager: 'Content Manager',
        supervisor: 'Technical Supervisor',
      },
    },
    contact: {
      rateLimit: 'Please wait one minute before sending another message.',
      error: 'Unable to send your message right now. Please try again later.',
    },
    dashboards: {
      demoControl: 'Interactive Role Preview',
      demoDesc: 'Switch between platform roles to explore each dashboard layout and its available capabilities.',
    },
    hero: {
      titles: [
        'Moroccan Engineering & Innovation Platform',
        'Building AI, Robotics & Embedded Solutions',
        'Shaping the Next Generation of Smart Systems',
      ],
    },
    methodology: {
      title: 'Our Engineering Methodology',
      subtitle: 'A structured workflow that turns ambitious ideas into reliable, field-ready technology.',
      steps: [
        {
          number: '01',
          title: 'Analysis & Specifications',
          desc: 'Define the real-world challenge, technical requirements, and operational constraints.',
        },
        {
          number: '02',
          title: 'Architecture & Prototyping',
          desc: 'Design hardware and software layers and build a rapid testable prototype.',
        },
        {
          number: '03',
          title: 'Field Testing & Validation',
          desc: 'Validate performance, safety, and resilience under real operating conditions.',
        },
        {
          number: '04',
          title: 'Deployment & Iteration',
          desc: 'Ship production-ready solutions backed by clear documentation and continuous updates.',
        },
      ],
    },
    showcase: {
      title: 'Engineering Innovation Showcase',
      subtitle: 'Selected GITM projects spanning smart cities, robotics, and modern digital platforms.',
      problem: 'Technical Challenge',
      techUsed: 'Technologies Used',
      archDiagram: 'System Architecture Diagram',
      categories: {
        smartCity: 'Smart Cities',
        robotics: 'Robotics & Embedded',
        platforms: 'Digital Platforms',
      },
      projects: {
        smartCity: [
          {
            title: 'Smart Energy & Lighting Telemetry Grid',
            problem: 'High energy waste and delayed detection of field infrastructure faults.',
            desc: 'An IoT telemetry network that tracks real-time consumption and triggers proactive maintenance alerts.',
            tech: ['ESP32', 'MQTT', 'Cloud Telemetry', 'React'],
          },
        ],
        robotics: [
          {
            title: 'Autonomous Field & Agri-Robotics Platform',
            problem: 'Need for affordable, accurate automated field monitoring and navigation.',
            desc: 'A modular robotic unit combining environmental sensors and computer vision for autonomous operation.',
            tech: ['ROS', 'Embedded C++', 'Computer Vision', 'LiDAR'],
          },
        ],
        platforms: [
          {
            title: 'GITM Diagnostics & Knowledge Portal',
            problem: 'Fragmented engineering diagnostics and technical training resources.',
            desc: 'A unified cloud platform for technical diagnostics, project tracking, and applied learning.',
            tech: ['React', 'Cloudflare Workers', 'Firebase', 'MCP'],
          },
        ],
      },
    },
    tech: {
      title: 'Technology Stack & Domains',
      subtitle: 'The core software, hardware, and AI technologies powering GITM engineering initiatives.',
      boundaryTitle: 'Hardware-to-Cloud Integration',
      boundaryDesc: 'We bridge low-level electronics and modern cloud platforms to deliver complete end-to-end systems from sensor to interface.',
      categories: {
        software: 'Software & Platforms',
        hardware: 'Hardware & Embedded',
        ai: 'AI & Data Systems',
      },
      items: {
        software: ['React & Vite', 'Cloudflare Workers', 'Firebase & Firestore', 'Linux / GITM OS', 'Rust & Python'],
        hardware: ['ESP32 & STM32', 'PCB Design', 'CAN Bus & OBD-II', 'IoT Sensors', 'Robotics Actuators'],
        ai: ['Computer Vision', 'Edge AI', 'LLM & MCP Integration', 'Predictive Analytics', 'Telemetry Pipelines'],
      },
    },
  },

  // ═══════════════════════════════════════════
  //  Français (French)
  // ═══════════════════════════════════════════
  fr: {
    lang: 'fr',
    archive: {
      title: 'Archives Techniques et de Terrain',
      subtitle: 'Un registre documenté des expérimentations en laboratoire, prototypes et déploiements réalisés par GITM.',
      labElectronics: 'Laboratoire d’Électronique et Systèmes Embarqués',
      labElectronicsDesc: 'Conception de circuits, validation de microcontrôleurs et développement de cartes électroniques sur mesure.',
      fieldRobotics: 'Tests de Robotique sur le Terrain',
      fieldRoboticsDesc: 'Essais en conditions réelles de navigation autonome, de télémétrie et de commande à distance.',
      smartCityDeploy: 'Déploiements Villes Intelligentes',
      smartCityDeployDesc: 'Réseaux de capteurs IoT dédiés au suivi énergétique, environnemental et aux infrastructures urbaines.',
      cloudTelemetry: 'Télémétrie Cloud et Supervision',
      cloudTelemetryDesc: 'Tableaux de bord en temps réel pour collecter, analyser et visualiser les données des objets connectés.',
      labAI: 'Laboratoire IA et Vision par Ordinateur',
      labAIDesc: 'Modèles d’apprentissage profond et de perception visuelle pour le diagnostic intelligent et la robotique.',
      communityExpo: 'Expositions et Ateliers Communautaires',
      communityExpoDesc: 'Démonstrations en direct et ateliers pratiques pour rapprocher l’ingénierie des étudiants et passionnés.',
    },
    auth: {
      loginTitle: 'Connexion à votre compte',
      registerTitle: 'Créer un nouveau compte',
      forgotPassword: 'Mot de passe oublié ?',
      name: 'Nom complet',
      email: 'Adresse e-mail',
      password: 'Mot de passe',
      loginBtn: 'Se connecter',
      registerBtn: 'Créer le compte',
      dontHaveAccount: 'Vous n’avez pas encore de compte ?',
      alreadyHaveAccount: 'Vous avez déjà un compte ?',
      roles: {
        president: 'Président',
        teacher: 'Formateur et Mentor',
        member: 'Membre',
        student: 'Étudiant',
        partner: 'Partenaire',
        university: 'Université et Institution',
        contentManager: 'Responsable Contenu',
        supervisor: 'Superviseur Technique',
      },
    },
    contact: {
      rateLimit: 'Veuillez patienter une minute avant d’envoyer un nouveau message.',
      error: 'Impossible d’envoyer votre message pour le moment. Veuillez réessayer plus tard.',
    },
    dashboards: {
      demoControl: 'Aperçu Interactif des Rôles',
      demoDesc: 'Basculez entre les différents rôles de la plateforme pour explorer chaque tableau de bord.',
    },
    hero: {
      titles: [
        'Plateforme Marocaine d’Ingénierie et d’Innovation',
        'Solutions en IA, Robotique et Systèmes Embarqués',
        'Bâtir la Nouvelle Génération de Systèmes Intelligents',
      ],
    },
    methodology: {
      title: 'Notre Méthodologie d’Ingénierie',
      subtitle: 'Une démarche structurée qui transforme des idées ambitieuses en solutions techniques fiables.',
      steps: [
        {
          number: '01',
          title: 'Analyse et Cahier des Charges',
          desc: 'Étude précise du besoin terrain, des spécifications techniques et des contraintes opérationnelles.',
        },
        {
          number: '02',
          title: 'Architecture et Prototypage',
          desc: 'Conception matérielle et logicielle suivie d’un prototype rapide et testable.',
        },
        {
          number: '03',
          title: 'Tests et Validation Terrain',
          desc: 'Vérification des performances, de la sécurité et de la robustesse en conditions réelles.',
        },
        {
          number: '04',
          title: 'Déploiement et Amélioration Continue',
          desc: 'Mise en service accompagnée d’une documentation claire et de mises à jour régulières.',
        },
      ],
    },
    showcase: {
      title: 'Vitrine des Innovations',
      subtitle: 'Projets sélectionnés conçus par les ingénieurs de GITM en villes intelligentes, robotique et plateformes numériques.',
      problem: 'Défi Technique',
      techUsed: 'Technologies Utilisées',
      archDiagram: 'Schéma d’Architecture Système',
      categories: {
        smartCity: 'Villes Intelligentes',
        robotics: 'Robotique et Embarqué',
        platforms: 'Plateformes Numériques',
      },
      projects: {
        smartCity: [
          {
            title: 'Réseau de Télémétrie Énergétique et Éclairage Intelligent',
            problem: 'Surconsommation énergétique et détection tardive des pannes sur les infrastructures.',
            desc: 'Système IoT mesurant la consommation en temps réel avec alertes de maintenance préventive.',
            tech: ['ESP32', 'MQTT', 'Cloud Telemetry', 'React'],
          },
        ],
        robotics: [
          {
            title: 'Plateforme Robotique Autonome de Terrain',
            problem: 'Besoin d’une surveillance agricole et technique automatisée à coût maîtrisé.',
            desc: 'Robot modulaire intégrant capteurs environnementaux et vision par ordinateur pour opérer en autonomie.',
            tech: ['ROS', 'Embedded C++', 'Computer Vision', 'LiDAR'],
          },
        ],
        platforms: [
          {
            title: 'Portail GITM de Diagnostic et de Formation',
            problem: 'Dispersion des outils de diagnostic technique et des parcours d’apprentissage pratique.',
            desc: 'Plateforme cloud unifiée dédiée au diagnostic, au suivi de projets et à la formation appliquée.',
            tech: ['React', 'Cloudflare Workers', 'Firebase', 'MCP'],
          },
        ],
      },
    },
    tech: {
      title: 'Stack Technologique et Domaines',
      subtitle: 'Les technologies logicielles, matérielles et d’IA qui propulsent les projets de GITM.',
      boundaryTitle: 'Intégration Matériel-Cloud',
      boundaryDesc: 'Nous relions l’électronique bas niveau aux plateformes cloud modernes pour concevoir des systèmes complets, du capteur jusqu’à l’interface.',
      categories: {
        software: 'Logiciels et Plateformes',
        hardware: 'Matériel et Embarqué',
        ai: 'IA et Données',
      },
      items: {
        software: ['React & Vite', 'Cloudflare Workers', 'Firebase & Firestore', 'Linux / GITM OS', 'Rust & Python'],
        hardware: ['ESP32 & STM32', 'PCB Design', 'CAN Bus & OBD-II', 'IoT Sensors', 'Robotics Actuators'],
        ai: ['Computer Vision', 'Edge AI', 'LLM & MCP Integration', 'Predictive Analytics', 'Telemetry Pipelines'],
      },
    },
  },
};
