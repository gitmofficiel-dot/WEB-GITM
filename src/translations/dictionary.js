export const languages = {
  ar: { name: 'العربية', dir: 'rtl', flag: '🇲🇦' },
  en: { name: 'English', dir: 'ltr', flag: '🇬🇧' },
  fr: { name: 'Français', dir: 'ltr', flag: '🇫🇷' },
  zh: { name: '中文', dir: 'ltr', flag: '🇨🇳' },
  tzm: { name: 'ⵜⴰⵎⴰⵣⵉⵖⵜ', dir: 'ltr', flag: '🇲🇦' },
  es: { name: 'Español (AI)', dir: 'ltr', flag: '🇪🇸' },
  de: { name: 'Deutsch (AI)', dir: 'ltr', flag: '🇩🇪' },
  ja: { name: '日本語 (AI)', dir: 'ltr', flag: '🇯🇵' },
};

export const translations = {
  ar: {
    nav: {
      brand: 'GITM',
      home: 'الرئيسية',
      about: 'من نحن',
      archive: 'أرشيف الصور',
      projects: 'المشاريع Hub',
      academy: 'الأكاديمية الهندسية',
      dashboard: 'لوحات التحكم',
      login: 'تسجيل الدخول',
      register: 'إنشاء حساب',
      logout: 'خروج',
      aiTranslator: 'مترجم الذكاء الاصطناعي',
      themeLight: 'وضع نهاري',
      themeDark: 'وضع ليلي',
    },
    hero: {
      tagline: 'ريادة الثورة التكنولوجية في المغرب',
      title: 'نصنع أنظمة ذكية تعيد تعريف المستقبل',
      subtitle: 'مجموعة الابتكار التكنولوجي بالمغرب (GITM) تطور حلولاً برمجية معقدة، وأنظمة مدمجة متقدمة، وروبوتات مستقلة تعتمد على Edge AI وتدفق البيانات الفوري.',
      ctaPrimary: 'استكشف ابتكاراتنا',
      ctaSecondary: 'تواصل للتعاون التقني',
      liveTelemetry: 'البث المباشر للبيانات للـ Edge Nodes نشط في المغرب 🇲🇦',
      aiStatus: 'حالة نظام الوكلاء المتعددين: مستقر | سرعة المعالجة: 45 TFLOPS',
    },
    about: {
      title: 'من نحن & فريق الخبراء',
      subtitle: 'العقول الهندسية والبحثية المبتكرة وراء مشاريع GITM في المغرب',
      divisionTitle: 'الأقسام التقنية التخصصية',
      divisionDesc: 'نحن ندمج بين تصميم العتاد المادي وبرمجة النظم السحابية وذكاء الآلة لبناء حلول سيادية متكاملة.',
      statsCommits: 'مساهمات الكود (سنوياً)',
      statsProjects: 'المشاريع النشطة',
      statsCore: 'التخصص الأساسي',
      profileTitle: 'الملف الفني لعضو الفريق',
      profileClose: 'إغلاق الملف',
      githubLink: 'الملف الشخصي على GitHub',
      linkedinLink: 'الملف الشخصي على LinkedIn',
      roles: {
        yassine: 'قائد الفريق وخبير النظم المدمجة والعتاد',
        amine: 'باحث أول في الذكاء الاصطناعي والروبوتات المستقلة',
        sara: 'مطور الويب الشامل وهندسة السحابيات الموزعة',
      },
      bios: {
        yassine: 'أكثر من 8 سنوات من الخبرة في تصميم لوحات الدوائر الإلكترونية المطبوعة متعددة الطبقات (PCB) وتطوير الأنظمة المدمجة المتقدمة (STM32/ESP32). يقود الجوانب العتادية والميكانيكية للروبوتات وعقد الاستشعار.',
        amine: 'حاصل على الدكتوراه في النظم اللامركزية والتحكم المستقل. خبير في أنظمة الوكلاء المتعددين (Multi-Agent Systems) وتطبيقات الرؤية الحاسوبية والذكاء الاصطناعي التوليدي الحافة (Edge AI).',
        sara: 'متخصصة في بناء وتأمين المنصات السحابية واللوحات البرمجية عالية الأداء. تدير تدفق البيانات فوري الاستجابة عبر قنوات WebSockets و gRPC وتضمن توزيع الحاويات واستقرار السيرفرات.',
      }
    },
    archive: {
      title: 'أرشيف الصور والمختبرات',
      subtitle: 'معرض بصري يوثق تجاربنا الميدانية، ومختبرات تصنيع الإلكترونيات، وورش بناء الروبوتات',
      labElectronics: 'مختبر الإلكترونيات وتجميع اللوحات المطبوعة',
      labElectronicsDesc: 'حيث يتم تصنيع، وتجميع، واختبار النماذج العتادية الأولية وتفليش الأنظمة البرمجية عليها.',
      fieldRobotics: 'التجارب الميدانية للروبوتات المستقلة',
      fieldRoboticsDesc: 'اختبارات الملاحة الذاتية وخوارزميات التنسيق الجماعي للطائرات المسيرة والروبوتات الأرضية.',
      smartCityDeploy: 'تركيب واختبار عقد Edge AI الذكية بالشارع',
      smartCityDeployDesc: 'تركيب أجهزة الرصد ومعالجة الكاميرات محلياً في التقاطعات الحيوية لإدارة المرور بالمغرب.',
      cloudTelemetry: 'غرفة التحكم المركزي وبث البيانات',
      cloudTelemetryDesc: 'مراقبة التغذية الحية لشبكة أجهزة إنترنت الأشياء والتحكم بالروبوتات عن بعد بالمللي ثانية.',
      labAI: 'مختبر تدريب الشبكات العصبية والحواسب الفائقة',
      labAIDesc: 'البنية التحتية المحلية المستخدمة لتدريب وضغط نماذج الذكاء الاصطناعي لتشغيلها على الرقائق الصغيرة.',
      communityExpo: 'معرض التقنيات المغربي للابتكار والتواصل',
      communityExpoDesc: 'عرض ابتكارات الفريق للجهات الداعمة والجامعات لتوسيع نطاق الشراكات التقنية.',
    },
    projects: {
      title: 'بوابة المشاريع وتتبع المستودعات',
      subtitle: 'مراقبة فورية لحالة تطوير المشاريع الهندسية وربطها المباشر بمستودعات GitHub للمطورين',
      statusLabel: 'حالة المشروع',
      githubRepo: 'مستودع GitHub',
      commitsCount: 'عدد الالتزامات الكودية',
      pullRequests: 'طلبات الدمج النشطة',
      activeIssues: 'المشكلات المفتوحة',
      viewRepository: 'استعراض الكود المصدري',
      status: {
        idea: 'فكرة وتصميم معماري',
        development: 'قيد التطوير البرمجي',
        testing: 'الاختبار الميداني والضبط',
        deployed: 'مستقر وموزع تشغيلياً',
      },
      list: {
        smartTraffic: {
          name: 'نظام المرور الذكي بالـ Edge AI',
          desc: 'نظام إدارة الإشارات الضوئية التكيفي في الدار البيضاء بناءً على خوارزميات الرؤية الحاسوبية المحلية.',
          repo: 'gitm-org/edge-ai-traffic-controller',
        },
        swarmNav: {
          name: 'ملاحة الأسراب الروبوتية ROS2',
          desc: 'منظومة الملاحة الجماعية اللامركزية للبحث والإنقاذ باستخدام LiDAR وكاميرات العمق العتادية.',
          repo: 'gitm-org/ros2-swarm-coordinator',
        },
        telemetryHub: {
          name: 'منصة تدفق البيانات السحابية (IoT Hub)',
          desc: 'خادم بث فوري عالي الأداء مع لوحات قيادة مخصصة لإدارة وتتبع مئات العقد الميدانية بالمغرب.',
          repo: 'gitm-org/gitm-telemetry-ingestion-core',
        },
        edgeHardware: {
          name: 'لوحة التحكم والمتحكمات STM32 v2',
          desc: 'تصميم عتادي مخصص يدمج لوحة معالجة ذكية مع حساسات اتصال LoRaWAN وبطارية طاقة شمسية.',
          repo: 'gitm-org/stm32-lora-sensor-board',
        }
      }
    },
    academy: {
      title: 'الأكاديمية الهندسية المتطورة لـ GITM',
      subtitle: 'أكاديمية تدريب تطبيقي تركز على دمج الأجهزة والذكاء الاصطناعي والسحابيات - تجربة عملية 100% وليست مجرد فيديوهات تلقينية كباقي المنصات التقليدية',
      learningTracks: 'مسارات التعلم التخصصية',
      playgroundTitle: 'المحاكي البرمجي التفاعلي وعقدة المعالجة (Sandbox)',
      playgroundDesc: 'اكتب الكود وجرب تشغيله في محاكي العتاد المدمج أو أرسل أمر محاكاة لنموذج الذكاء الاصطناعي.',
      terminalHeader: 'محاكاة عتاد STM32 / مترجم الذكاء الاصطناعي',
      runCodeBtn: 'تشغيل الكود الفني',
      resetCodeBtn: 'إعادة ضبط المحاكي',
      enrolledBadge: 'منخرط في المسار',
      enrollBtn: 'بدء التدريب التطبيقي',
      sandboxOutput: 'مخرجات المحاكاة العتادية:',
      codePlaceholder: '// اكتب كود C/C++ للمتحكم الصغير أو كود بايثون للذكاء الاصطناعي هنا...',
      tracks: {
        edge: {
          title: 'مهندس Edge AI ونظم مدمجة',
          desc: 'تعلم برمجة لوحات STM32 و ESP32 وتفليش نماذج شبكات عصبية خفيفة الوزن للرؤية الحاسوبية على العتاد المباشر.',
          level: 'متقدم | 40 ساعة تدريبية',
        },
        robotics: {
          title: 'هندسة الروبوتات المستقلة والـ ROS2',
          desc: 'تطوير خوارزميات الملاحة ورسم الخرائط SLAM والتحكم الجماعي بالأسراب الروبوتية وتنسيق المهام تعاونياً.',
          level: 'خبير | 60 ساعة تدريبية',
        },
        iotCloud: {
          title: 'معماري منصات الـ IoT والويب السحابي',
          desc: 'بناء خوادم تدفق البيانات الحية، استخدام WebSockets و gRPC وبناء لوحات التحكم ذات الاستجابة بالمللي ثانية.',
          level: 'متوسط - متقدم | 45 ساعة تدريبية',
        }
      }
    },
    auth: {
      loginTitle: 'بوابة تسجيل الدخول الرسمية لـ GITM',
      registerTitle: 'إنشاء حساب جديد بالمنصة',
      email: 'البريد الإلكتروني المهني',
      password: 'كلمة المرور',
      confirmPassword: 'تأكيد كلمة المرور',
      name: 'الاسم الكامل',
      roleSelect: 'اختر دورك الوظيفي بالمنصة',
      loginBtn: 'تسجيل دخول آمن',
      registerBtn: 'تسجيل حساب جديد',
      forgotPassword: 'نسيت كلمة المرور؟',
      dontHaveAccount: 'ليس لديك حساب؟ سجل هنا',
      alreadyHaveAccount: 'لديك حساب بالفعل؟ ادخل هنا',
      roles: {
        president: 'رئيس الفريق / المدير العام',
        teacher: 'عضو هيئة التدريس / المعلم',
        member: 'مهندس / عضو الفريق التقني',
        student: 'طالب / متدرب بالأكاديمية',
        partner: 'شريك استراتيجي / مؤسسة داعمة',
        university: 'ممثلو الجامعات الشريكة',
      }
    },
    dashboards: {
      demoControl: 'لوحة معايرة الأدوار والأنظمة (Demo Controller)',
      demoDesc: 'تتيح لك هذه الأداة الطيران الفوري بين لوحات التحكم الستة لاختبار كافة الوظائف والمخرجات دون الحاجة لتسجيل حسابات منفصلة.',
      activeRoleLabel: 'الدور النشط حالياً:',
      president: {
        title: 'لوحة القيادة العامة للمدير العام ورئيس الفريق',
        subtitle: 'المراقبة الاستراتيجية للموارد المالية، وتوزيع المهام الهندسية، والموافقات الجامعية الموحدة.',
        stats: {
          budget: 'الميزانية المتاحة للمشاريع',
          students: 'الطلاب المسجلين بالأكاديمية',
          tasks: 'المهام التقنية النشطة',
          partners: 'المؤسسات والجامعات الشريكة',
        },
        actions: {
          title: 'العمليات الاستراتيجية للمدير',
          assignTask: 'إسناد مهمة برمجية جديدة للعضو',
          allocBudget: 'تخصيص تمويل لبحث علمي مشترك',
          approveGrant: 'الموافقة على تمويل مقترح من مؤسسة داعمة',
          taskPlaceholder: 'اكتب تفاصيل المهمة (مثال: تحديث مكتبة الاتصال STM32)...',
          targetMember: 'المهندس المستهدف:',
          amount: 'مبلغ التمويل (بالدرهم):',
          successTask: 'تم إسناد المهمة وإرسالها للوحة العضو بنجاح!',
          successBudget: 'تم تخصيص الميزانية وإبلاغ الجامعة الشريكة!',
        }
      },
      teacher: {
        title: 'لوحة المعلمين والمدربين بالأكاديمية',
        subtitle: 'إدارة المسارات التدريبية، ونشر التحديثات، وتقييم أعمال وحلول الطلاب بالأكاديمية.',
        stats: {
          classes: 'الصفوف النشطة',
          graded: 'الحلول التي تم تقييمها',
          pending: 'طلبات التقييم المعلقة',
          score: 'متوسط أداء الطلاب',
        },
        actions: {
          title: 'إدارة المحتوى والدرجات',
          createCourse: 'نشر تحديث تدريبي جديد',
          gradeStudent: 'تقييم كود وحل الطالب',
          coursePlaceholder: 'عنوان الدرس التدريبي الجديد...',
          gradeScore: 'الدرجة (من 100):',
          successCourse: 'تم نشر الدرس التدريبي بنجاح وأصبح متاحاً للطلاب!',
          successGrade: 'تم تسجيل الدرجة وإرسال النتيجة للوحة الطالب!',
        }
      },
      member: {
        title: 'لوحة المهندسين وأعضاء الفريق التقني',
        subtitle: 'تتبع المهام المسندة، تحديث تقدم لوحات الدوائر PCBs، وإطلاق محاكاة تدريب خوارزميات الذكاء الاصطناعي.',
        stats: {
          myTasks: 'المهام المسندة إليّ',
          commits: 'عدد التعديلات الكودية',
          aiJobs: 'تجارب تدريب الشبكات العصبية',
          hardwareBuilds: 'اللوحات الإلكترونية المكتملة',
        },
        actions: {
          title: 'تنفيذ العمليات الهندسية',
          launchTraining: 'إطلاق محاكاة تدريب نموذج Edge AI',
          updateTask: 'تحديث حالة مهمة عتادية',
          successTrain: 'بدأت عملية تدريب الشبكة العصبية في السحابة المحلية...',
          successTask: 'تم تحديث حالة المهمة بنجاح وإبلاغ رئيس الفريق!',
        }
      },
      student: {
        title: 'لوحة الطلاب والمتدربين بالأكاديمية',
        subtitle: 'متابعة تقدم المسارات الدراسية، تسليم التعيينات الكودية، والاطلاع على نتائج التقييم.',
        stats: {
          myCourses: 'المسارات المسجل بها',
          myGrade: 'معدلي الأكاديمي',
          quizPassed: 'الاختبارات التي اجتزتها',
          hoursSpent: 'ساعات التدريب العملي',
        },
        actions: {
          title: 'منطقة الأنشطة الدراسية',
          submitCode: 'تقديم كود حل التعيين البرمجي',
          takeQuiz: 'إجراء اختبار مسار Edge AI السريع',
          successCode: 'تم تقديم الكود بنجاح وإرسال إشعار لمعلم المسار لتقييمه!',
          successQuiz: 'تم تقديم إجابات الاختبار وحصلت على نتيجة 90%!',
        }
      },
      partner: {
        title: 'لوحة المؤسسات الداعمة والشركاء الماليين',
        subtitle: 'تتبع بنود التمويل للمشاريع الاستراتيجية، ومراقبة أداء المختبرات المستفيدة من الدعم المالي.',
        stats: {
          funded: 'إجمالي الدعم الممنوح',
          sponsoredLabs: 'المختبرات المدعومة',
          papersPublished: 'البحوث العلمية المكتملة',
          roi: 'مؤشر كفاءة التمويل',
        },
        actions: {
          title: 'الاستثمار التكنولوجي والشراكات',
          fundProject: 'تقديم منحة تمويل لمشروع جديد',
          requestReport: 'طلب تقرير الأداء المالي والميداني للمختبر',
          successFund: 'تم تقديم منحة التمويل المقترحة لرئيس الفريق للمصادقة!',
          successReport: 'تم إرسال طلب التقرير التقني للمختبر المستهدف!',
        }
      },
      university: {
        title: 'لوحة الجامعات والمؤسسات الأكاديمية الشريكة',
        subtitle: 'تنسيق البحوث المشتركة، وإدارة طلبات تدريب الطلاب والباحثين، وتوطين الابتكار.',
        stats: {
          researchers: 'الباحثين المشتركين',
          internships: 'فرص التدريب النشطة للطلاب',
          jointProjects: 'البحوث المشتركة الفعالة',
          labTelemetry: 'أجهزة قياس المختبر الجامعي',
        },
        actions: {
          title: 'التعاون الأكاديمي المباشر',
          approveInternship: 'الموافقة على طلب تدريب طالب جامعي',
          publishPaper: 'نشر ملخص بحث علمي مشترك',
          successIntern: 'تمت الموافقة على تدريب الطالب وتسجيله بلوحة التدريب!',
          successPaper: 'تم تسجيل ونشر ملخص البحث المشترك في قائمة المنشورات!',
        }
      }
    },
    aiModal: {
      title: 'محاكاة مترجم الذكاء الاصطناعي الفوري للغات',
      desc: 'يقوم نموذج الترجمة المتعدد اللغات لدينا الآن بإعادة محاذاة البنية اللغوية وتوليد المحتوى باللغة المحددة.',
      processing: 'جاري استدعاء نموذج الترجمة (LLM Neural Pipeline)...',
      tokenizing: 'تحليل البنية اللغوية (Tokenizing AST)...',
      translating: 'تطبيق مصفوفات التحويل اللغوي...',
      rendering: 'إعادة بناء الواجهة بديناميكية...',
      success: 'اكتملت الترجمة الذكية بنجاح بنسبة 99.8%!',
      close: 'تطبيق اللغة',
    },
    showcase: {
      title: 'معرض الحلول والنظم المتكاملة',
      subtitle: 'استعراض معماري وفني للمشاريع والأنظمة الذكية التي تم بناؤها وتوزيعها ميدانياً',
      archDiagram: 'مخطط بنية النظام الهندسي',
      problem: 'المشكلة والحل التقني:',
      techUsed: 'التقنيات والمكتبات المستخدمة:',
      categories: {
        smartCity: 'إدارة المرور الذكية (Edge AI)',
        robotics: 'الملاحة التعاونية للأسراب (ROS2)',
        platforms: 'منصة بث البيانات وإنترنت IoT',
      },
      projects: {
        smartCity: {
          title: 'نظام التحكم المروري التكيفي بالذكاء الاصطناعي',
          description: 'نظام متكامل لمعالجة دفق الفيديو في الحافة (Edge) باستخدام كاميرات عالية الدقة ونماذج YOLOv8 للرسم البياني وتصنيف المركبات، مما يقلل وقت الانتظار في التقاطعات الحيوية بنسبة 35%.',
          problemSolved: 'معالجة الازدحام المروري الخانق بذكاء وديناميكية بدلاً من التوقيت الثابت للإشارات التقليدية.',
          architecture: 'Jetson Nano node -> MQTT Broker -> InfluxDB -> Node-RED control matrix',
          tech: 'YOLOv8, Python, MQTT, C++, InfluxDB',
        },
        robotics: {
          title: 'برمجة وتنسيق أسراب الروبوتات ROS2',
          description: 'منظومة تنسيق ذكية للتحكم اللامركزي بأسراب من الروبوتات الأرضية والجوية للبحث والإنقاذ، تعتمد على خوارزميات SLAM للملاحة وتوزيع المهام الآلي.',
          problemSolved: 'ملاحة الروبوتات في بيئات معزولة خالية من نظام تحديد المواقع العالمي GPS وتنسيق المهام بدون خادم مركزي.',
          architecture: 'Micro-ROS on ESP32 -> ROS2 Humble -> Zenoh DDS -> LIDAR mapping pipeline',
          tech: 'ROS2, C++, ESP32, Python, Zenoh, LiDAR',
        },
        platforms: {
          title: 'خادم تدفق وتحليل بيانات الـ IoT والشبكات',
          description: 'بنية تحتية سحابية هجينة وبوابة بث بيانات تدعم استجابة بالمللي ثانية وملايين العقد الموزعة لتتبع وحفظ قراءات الاستشعار والتحكم بالروبوتات عن بعد.',
          problemSolved: 'تأخير الاتصال واستقرار بث البيانات الضخمة مع ملايين التحديثات المتزامنة.',
          architecture: 'React Client Websockets -> Node.js Cluster -> TimescaleDB -> Redis Cache',
          tech: 'React, Node.js, WebSockets, TimescaleDB, Docker, Redis',
        },
      },
    },
    methodology: {
      title: 'منهجية العمل وهندسة النظم',
      subtitle: 'كيف ننتقل بالأفكار والمشاريع التقنية من التخطيط النظري إلى التشغيل الميداني الفعلي',
      steps: [
        {
          num: '01',
          title: 'الدراسة والتصميم المعماري',
          desc: 'تحليل المتطلبات التقنية، تصميم مسارات تدفق البيانات للشبكة، تحديد المكونات والعتاد الإلكتروني وإعداد المخططات الأولية للدوائر.'
        },
        {
          num: '02',
          title: 'التطوير البرمجي وتصنيع العتاد',
          desc: 'كتابة البرمجيات المنخفضة المستوى (Firmware)، تصميم وطباعة لوحات الدوائر الإلكترونية (PCB)، وتطوير خوارزميات الذكاء الاصطناعي في الحافة.'
        },
        {
          num: '03',
          title: 'المعايرة والاختبار الميداني',
          desc: 'إخضاع النظم لاختبارات الجهد والمحاكاة البيئية، معايرة الحساسات في ظروف حقيقية، وضبط تكامل البرمجيات مع العتاد لضمان الاستقرار.'
        },
        {
          num: '04',
          title: 'النشر والمراقبة المستمرة',
          desc: 'التثبيت الميداني للمشاريع، تفعيل التحديثات اللاسلكية الآمنة (OTA)، وربط العقد بلوحات التحكم المركزية لمراقبة بث البيانات فوري الاستجابة.'
        }
      ]
    },
    team: {
      title: 'فريق الخبراء المبتكرين',
      subtitle: 'العقول الهندسية التي تصنع الحلول السيادية والابتكارات الميدانية في المغرب',
      skillsLabel: 'المهارات والتقنيات الأساسية:',
      members: [
        {
          name: 'المهندس ياسين المراكشي',
          role: 'خبير النظم المدمجة والعتاد',
          bio: 'أكثر من 8 سنوات من الخبرة في تصميم لوحات الدوائر الإلكترونية المطبوعة متعددة الطبقات (PCB) وتطوير الأنظمة المدمجة المتقدمة (STM32/ESP32).',
          skills: ['Altium Designer', 'C/C++', 'STM32 HAL', 'RTOS', 'KiCad'],
          image: '/member_yassine.png'
        },
        {
          name: 'د. أمين بنجلون',
          role: 'باحث أول في الذكاء الاصطناعي والروبوتات المستقلة',
          bio: 'حاصل على الدكتوراه في النظم اللامركزية والتحكم المستقل. خبير في أنظمة الوكلاء المتعددين وتطبيقات الرؤية الحاسوبية والذكاء الاصطناعي الحافة.',
          skills: ['ROS2 Humble', 'Python', 'YOLOv8', 'TensorFlow', 'LiDAR SLAM'],
          image: '/member_amine.png'
        },
        {
          name: 'المهندسة سارة الفاسي',
          role: 'مطور الويب الشامل وهندسة السحابيات الموزعة',
          bio: 'متخصصة في بناء وتأمين المنصات السحابية واللوحات البرمجية عالية الأداء. تدير تدفق البيانات فوري الاستجابة عبر قنوات WebSockets.',
          skills: ['React.js', 'Node.js', 'WebSockets', 'Docker', 'TimescaleDB'],
          image: '/member_sara.png'
        }
      ]
    }
  },
  en: {
    nav: {
      brand: 'GITM',
      home: 'Home',
      about: 'About Us',
      archive: 'Image Archive',
      projects: 'Projects Hub',
      academy: 'Engineering Academy',
      dashboard: 'Dashboards',
      login: 'Sign In',
      register: 'Sign Up',
      logout: 'Log Out',
      aiTranslator: 'AI Translator',
      themeLight: 'Light Mode',
      themeDark: 'Dark Mode',
    },
    hero: {
      tagline: 'Leading the Technological Revolution in Morocco',
      title: 'We Engineer Smart Systems That Define the Future',
      subtitle: 'Groupe Innovation Technologique Maroc (GITM) develops complex software solutions, advanced embedded systems, and autonomous robotics driven by Edge AI and real-time data streaming.',
      ctaPrimary: 'Explore Innovations',
      ctaSecondary: 'Connect for Tech Collaboration',
      liveTelemetry: 'Live Edge Node Telemetry Active in Morocco 🇲🇦',
      aiStatus: 'Multi-Agent Status: Stable | Processing Speed: 45 TFLOPS',
    },
    about: {
      title: 'About Us & Expert Team',
      subtitle: 'The engineering minds and researchers behind GITM projects in Morocco',
      divisionTitle: 'Specialized Tech Divisions',
      divisionDesc: 'We integrate hardware design, distributed cloud computing, and machine learning to build secure sovereign solutions.',
      statsCommits: 'Code Commits (Annual)',
      statsProjects: 'Active Projects',
      statsCore: 'Core Specialty',
      profileTitle: 'Member Technical Profile',
      profileClose: 'Close Profile',
      githubLink: 'GitHub Profile',
      linkedinLink: 'LinkedIn Profile',
      roles: {
        yassine: 'Team Lead & Embedded Systems Hardware Specialist',
        amine: 'Senior AI & Autonomous Robotics Researcher',
        sara: 'Fullstack Developer & Distributed Cloud Architect',
      },
      bios: {
        yassine: 'Over 8 years of experience in multi-layer PCB design (Altium/KiCad) and advanced embedded microcontrollers (STM32/ESP32). Leads the hardware development of robotic platforms.',
        amine: 'PhD in Decentralized Systems. Expert in Multi-Agent Systems, advanced Computer Vision algorithms, and training lightweight Edge AI neural networks.',
        sara: 'Specialized in building and scaling high-performance, real-time web cloud architectures. Manages WebSocket, gRPC stream queues, and Kubernetes deployments.',
      }
    },
    archive: {
      title: 'Image Archive & Labs',
      subtitle: 'Visual catalog documenting our hardware laboratories, robotic field trials, and active workshops',
      labElectronics: 'PCB Assembly & Electronics Lab',
      labElectronicsDesc: 'Where hardware prototypes are designed, soldered, assembled, and debugged locally.',
      fieldRobotics: 'Autonomous Robotic Swarm Testing',
      fieldRoboticsDesc: 'Field testing of navigation, SLAM mapping, and consensus algorithms for drone swarms.',
      smartCityDeploy: 'Edge AI Smart Traffic Nodes Installation',
      smartCityDeployDesc: 'Deploying edge cameras and real-time computation nodes at critical intersections in Morocco.',
      cloudTelemetry: 'Cloud Command & Telemetry Center',
      cloudTelemetryDesc: 'Live monitoring and milliseconds-level remote command room of field nodes.',
      labAI: 'Neural Network Supercomputer Suite',
      labAIDesc: 'Local GPU infrastructure utilized to train, compress, and quantize models for edge chips.',
      communityExpo: 'Moroccan Technology Expo & Networking',
      communityExpoDesc: 'Showcasing the team\'s innovations to supporting partners and universities to expand academic alliances.',
    },
    projects: {
      title: 'Projects Directory & Repo Hub',
      subtitle: 'Real-time engineering projects directory integrated with GitHub repositories status',
      statusLabel: 'Project Status',
      githubRepo: 'GitHub Repository',
      commitsCount: 'Code Commits',
      pullRequests: 'Active Pull Requests',
      activeIssues: 'Open Issues',
      viewRepository: 'Browse Source Code',
      status: {
        idea: 'Architecture & Design Phase',
        development: 'Active Code Development',
        testing: 'Field Calibration & Testing',
        deployed: 'Stable Production Deployment',
      },
      list: {
        smartTraffic: {
          name: 'Edge AI Traffic Management System',
          desc: 'Adaptive video-processing traffic signals deployed locally in Casablanca.',
          repo: 'gitm-org/edge-ai-traffic-controller',
        },
        swarmNav: {
          name: 'ROS2 Swarm Robotic Navigator',
          desc: 'Decentralized collective navigation for search-and-rescue swarms using LiDAR.',
          repo: 'gitm-org/ros2-swarm-coordinator',
        },
        telemetryHub: {
          name: 'Real-Time IoT Telemetry Stream (Cloud)',
          desc: 'High-throughput WebSocket telemetry ingestion hub monitoring field deployments.',
          repo: 'gitm-org/gitm-telemetry-ingestion-core',
        },
        edgeHardware: {
          name: 'STM32 Edge Controller Board v2',
          desc: 'Custom PCB blending microchip processing, LoRaWAN transceivers, and battery solar charge paths.',
          repo: 'gitm-org/stm32-lora-sensor-board',
        }
      }
    },
    academy: {
      title: 'GITM Advanced Engineering Academy',
      subtitle: 'Hands-on applied learning merging Hardware, AI, and Cloud. 100% practical lab exercises instead of passive slide-watching Coursera clones',
      learningTracks: 'Learning Specialization Tracks',
      playgroundTitle: 'Interactive Code Sandbox & MCU Simulator',
      playgroundDesc: 'Write code to compile on virtual hardware or trigger simulated AI training jobs.',
      terminalHeader: 'STM32 Hardware Compiler / AI Executor',
      runCodeBtn: 'Run Technical Code',
      resetCodeBtn: 'Reset Simulator',
      enrolledBadge: 'Enrolled in Track',
      enrollBtn: 'Start Practical Track',
      sandboxOutput: 'Hardware Terminal Output:',
      codePlaceholder: '// Write C/C++ firmware or Python ML scripts here...',
      tracks: {
        edge: {
          title: 'Edge AI & Embedded Systems Specialist',
          desc: 'Learn STM32/ESP32 coding, flashing neural networks, and optimizing visual models locally on microchips.',
          level: 'Advanced | 40 Hours',
        },
        robotics: {
          title: 'Autonomous Robotics & ROS2 Architect',
          desc: 'Master SLAM mapping, autonomous navigation, and decentralized CBBA swarm coordination.',
          level: 'Expert | 60 Hours',
        },
        iotCloud: {
          title: 'IoT Cloud Platform & Core Web Architect',
          desc: 'Build ingestion pipelines, WebSockets, gRPC, TimescaleDB telemetry, and Docker-orchestrated dashboards.',
          level: 'Intermediate-Advanced | 45 Hours',
        }
      }
    },
    auth: {
      loginTitle: 'GITM Portal Secure Sign In',
      registerTitle: 'Create Member Account',
      email: 'Professional Email Address',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      name: 'Full Name',
      roleSelect: 'Select Platform Role Access',
      loginBtn: 'Secure Login',
      registerBtn: 'Sign Up',
      forgotPassword: 'Forgot Password?',
      dontHaveAccount: 'Don\'t have an account? Sign up',
      alreadyHaveAccount: 'Already have an account? Login',
      roles: {
        president: 'Team President / General Director',
        teacher: 'Academy Instructor / Teacher',
        member: 'Embedded Software Engineer / Staff',
        student: 'Student / Academy Intern',
        partner: 'Strategic Partner / Sponsor',
        university: 'University Delegate / Representative',
      }
    },
    dashboards: {
      demoControl: 'System Role & Telemetry preview (Demo Controller)',
      demoDesc: 'Fly instantly between all 6 dashboard roles to test full CRUD operations without registering multiple accounts.',
      activeRoleLabel: 'Active Dashboard Preview:',
      president: {
        title: 'President & Director General Dashboard',
        subtitle: 'Strategic monitoring of project budget sheets, developer task allocation, and university collaborations.',
        stats: {
          budget: 'Allocated Project Funds',
          students: 'Enrolled Academy Students',
          tasks: 'Active Developer Tasks',
          partners: 'Affiliated Sponsors & Universities',
        },
        actions: {
          title: 'Strategic Operations',
          assignTask: 'Assign Task to Member',
          allocBudget: 'Allocate Joint University Grant',
          approveGrant: 'Approve Sponsor Funding Offer',
          taskPlaceholder: 'Type task details (e.g., Update STM32 LoRa library)...',
          targetMember: 'Target Engineer:',
          amount: 'Funding Amount (MAD):',
          successTask: 'Task successfully assigned to member board!',
          successBudget: 'Joint funding grant dispatched to University partner!',
        }
      },
      teacher: {
        title: 'Academy Instructors & Roster Dashboard',
        subtitle: 'Manage learning tracks, release code templates, and grade student submissions.',
        stats: {
          classes: 'Active Classrooms',
          graded: 'Graded Assignments',
          pending: 'Pending Code Reviews',
          score: 'Average Score',
        },
        actions: {
          title: 'Content & Gradebook Management',
          createCourse: 'Publish New Academy Lesson',
          gradeStudent: 'Grade Student Code Sandbox',
          coursePlaceholder: 'Title of the new lesson...',
          gradeScore: 'Score (out of 100):',
          successCourse: 'Lesson published successfully and available in Academy catalog!',
          successGrade: 'Grade recorded. Student notification dispatched!',
        }
      },
      member: {
        title: 'Embedded Systems Engineers & Staff Dashboard',
        subtitle: 'Track assigned board routing, view pull requests, and launch neural network training loops.',
        stats: {
          myTasks: 'My Active Tasks',
          commits: 'Code Commits Completed',
          aiJobs: 'Neural Training Jobs',
          hardwareBuilds: 'Assembled Hardware Nodes',
        },
        actions: {
          title: 'Engineering Operations',
          launchTraining: 'Launch Cloud Edge AI Training Loop',
          updateTask: 'Submit Hardware Task Progress Update',
          successTrain: 'Inference model training triggered on GPU cluster...',
          successTask: 'Task status updated. Notification sent to Team Lead!',
        }
      },
      student: {
        title: 'Students & Learners Dashboard',
        subtitle: 'Review enrolled tracks, submit C++/Python code solutions, and check test gradebooks.',
        stats: {
          myCourses: 'Enrolled tracks',
          myGrade: 'Current CGPA',
          quizPassed: 'Quizzes Completed',
          hoursSpent: 'Hands-on Labs Time',
        },
        actions: {
          title: 'Academic Activities',
          submitCode: 'Submit Code Sandbox Solution',
          takeQuiz: 'Take Quick Edge AI Quiz',
          successCode: 'Code solution pushed to instructor review pipeline!',
          successQuiz: 'Quiz submitted! Achieved 90% score!',
        }
      },
      partner: {
        title: 'Sponsors & Supporting Institutions Dashboard',
        subtitle: 'Track budget allocation efficiency, view sponsored labs telemetry, and request quarterly output audits.',
        stats: {
          funded: 'Total Capital Sponsored',
          sponsoredLabs: 'Funded Research Labs',
          papersPublished: 'Published Collaborations',
          roi: 'Sponsorship Efficiency Index',
        },
        actions: {
          title: 'Funding & Impact Actions',
          fundProject: 'Propose New Sponsorship Grant',
          requestReport: 'Request Lab Telemetry Audit Report',
          successFund: 'Grant proposal dispatched to President dashboard for authorization!',
          successReport: 'Telemetry report request sent to target lab coordinator!',
        }
      },
      university: {
        title: 'Universities & Academic Affiliates Dashboard',
        subtitle: 'Coordinate joint research papers, manage student interns, and monitor shared campus laboratory parameters.',
        stats: {
          researchers: 'Joint Researchers',
          internships: 'Active Student Interns',
          jointProjects: 'Joint R&D Labs',
          labTelemetry: 'Shared Lab Sensors',
        },
        actions: {
          title: 'Academic Synergy Actions',
          approveInternship: 'Approve Campus Student Internship',
          publishPaper: 'Upload Joint Research Abstract',
          successIntern: 'Internship contract signed and added to student records!',
          successPaper: 'Research paper abstract recorded and published!',
        }
      }
    },
    aiModal: {
      title: 'Real-time AI Language Translator Simulation',
      desc: 'Our multilingual model is currently aligning language matrices and generating localized interface vectors.',
      processing: 'Connecting to AI Inference Engine (LLM Pipeline)...',
      tokenizing: 'Tokenizing AST (Abstract Syntax Tree)...',
      translating: 'Applying neural weight translation matrices...',
      rendering: 'Rebuilding visual components dynamically...',
      success: 'AI translation completed with 99.8% accuracy!',
      close: 'Apply Language',
    },
    showcase: {
      title: 'Integrated Solutions & Systems Showcase',
      subtitle: 'Technical and architectural deep-dive into smart systems designed and deployed by GITM',
      archDiagram: 'Engineering Architecture Topology Diagram',
      problem: 'Core Problem & Technical Solution:',
      techUsed: 'Technologies & Libraries Deployed:',
      categories: {
        smartCity: 'Smart Traffic Control (Edge AI)',
        robotics: 'Swarm Robotic Navigation (ROS2)',
        platforms: 'Real-Time IoT Telemetry Stream (Cloud)',
      },
      projects: {
        smartCity: {
          title: 'Adaptive Video Processing Traffic Controller',
          description: 'Edge computing system processing high-definition video feeds with quantized YOLOv8 object detection models to optimize traffic light schedules, reducing wait times by up to 35%.',
          problemSolved: 'Dynamically optimizing traffic congestion at intersections instead of relying on static timer schedules.',
          architecture: 'Jetson Nano node -> MQTT Broker -> InfluxDB -> Node-RED control matrix',
          tech: 'YOLOv8, Python, MQTT, C++, InfluxDB',
        },
        robotics: {
          title: 'ROS2 Swarm Robotics Coordination Platform',
          description: 'Decentralized command system coordinating heterogeneous robot swarms (UAVs and UGVs) for collaborative search and rescue using SLAM mapping and task splitting.',
          problemSolved: 'Swarms mapping GPS-denied environments and dividing target search grids with zero central coordinator bottleneck.',
          architecture: 'Micro-ROS on ESP32 -> ROS2 Humble -> Zenoh DDS -> LIDAR mapping pipeline',
          tech: 'ROS2, C++, ESP32, Python, Zenoh, LiDAR',
        },
        platforms: {
          title: 'High-Throughput Real-Time IoT Telemetry Server',
          description: 'Hybrid cloud framework designed to ingest telemetry data from thousands of active hardware nodes, delivering live updates with sub-10ms latency.',
          problemSolved: 'Processing large-scale concurrent IoT updates and real-time dashboard data synchronization under peak loads.',
          architecture: 'React Client Websockets -> Node.js Cluster -> TimescaleDB -> Redis Cache',
          tech: 'React, Node.js, WebSockets, TimescaleDB, Docker, Redis',
        },
      },
    },
    methodology: {
      title: 'Our Engineering Methodology',
      subtitle: 'How we transition technical concepts from theoretical design to field-ready deployments',
      steps: [
        {
          num: '01',
          title: 'Research & System Architecture',
          desc: 'Analyzing requirements, mapping network data flows, defining electrical specifications, and drawing initial schematic designs.'
        },
        {
          num: '02',
          title: 'Firmware & PCB Fabrication',
          desc: 'Writing low-level hardware firmware, designing multi-layer PCBs, and building optimized AI models for local edge execution.'
        },
        {
          num: '03',
          title: 'Field Testing & Calibration',
          desc: 'Subjecting systems to stress and environmental simulations, calibrating sensors in actual conditions, and fine-tuning software-hardware integration.'
        },
        {
          num: '04',
          title: 'Deployment & Telemetry Stream',
          desc: 'Deploying nodes to the field, enabling secure OTA wireless updates, and connecting nodes to the cloud command center for real-time telemetry.'
        }
      ]
    },
    team: {
      title: 'Our Expert Team',
      subtitle: 'The engineering minds and researchers behind GITM projects in Morocco',
      skillsLabel: 'Core Skills & Deployed Tech:',
      members: [
        {
          name: 'Yassine El Marrakchi',
          role: 'Embedded Systems Hardware Specialist',
          bio: 'Over 8 years of experience in multi-layer PCB design (Altium/KiCad) and advanced embedded microcontrollers (STM32/ESP32). Leads hardware development.',
          skills: ['Altium Designer', 'C/C++', 'STM32 HAL', 'RTOS', 'KiCad'],
          image: '/member_yassine.png'
        },
        {
          name: 'Dr. Amine Benjelloun',
          role: 'Senior AI & Autonomous Robotics Researcher',
          bio: 'PhD in Decentralized Systems. Expert in Multi-Agent Systems, advanced Computer Vision algorithms, and training lightweight Edge AI neural networks.',
          skills: ['ROS2 Humble', 'Python', 'YOLOv8', 'TensorFlow', 'LiDAR SLAM'],
          image: '/member_amine.png'
        },
        {
          name: 'Sara El Fassi',
          role: 'Fullstack Developer & Distributed Cloud Architect',
          bio: 'Specialized in building and scaling high-performance, real-time web cloud architectures. Manages WebSocket, gRPC stream queues, and deployments.',
          skills: ['React.js', 'Node.js', 'WebSockets', 'Docker', 'TimescaleDB'],
          image: '/member_sara.png'
        }
      ]
    }
  },
  fr: {
    nav: {
      brand: 'GITM',
      home: 'Accueil',
      about: 'À Propos',
      archive: 'Galerie Photos',
      projects: 'Projets Hub',
      academy: 'Académie Technique',
      dashboard: 'Dashboards',
      login: 'Connexion',
      register: 'S\'inscrire',
      logout: 'Déconnexion',
      aiTranslator: 'Traducteur IA',
      themeLight: 'Mode Jour',
      themeDark: 'Mode Nuit',
    },
    hero: {
      tagline: 'Leader de la Révolution Technologique au Maroc',
      title: 'Nous Concevons les Systèmes Intelligents du Futur',
      subtitle: 'Groupe Innovation Technologique Maroc (GITM) développe des solutions logicielles complexes, des systèmes embarqués avancés et de la robotique autonome propulsée par l\'Edge AI.',
      ctaPrimary: 'Découvrir nos Innovations',
      ctaSecondary: 'Collaborer avec Nous',
      liveTelemetry: 'Télémétrie Edge Active au Maroc 🇲🇦',
      aiStatus: 'Statut Multi-Agent: Stable | Calcul: 45 TFLOPS',
    },
    about: {
      title: 'À Propos & Équipe d\'Ingénierie',
      subtitle: 'Les cerveaux techniques et chercheurs derrière les projets GITM au Maroc',
      divisionTitle: 'Divisions Spécialisées',
      divisionDesc: 'Nous intégrons conception électronique, cloud distribué et IA pour concevoir des solutions souveraines.',
      statsCommits: 'Commits Annuels',
      statsProjects: 'Projets Actifs',
      statsCore: 'Spécialité Clé',
      profileTitle: 'Profil Technique',
      profileClose: 'Fermer',
      githubLink: 'Profil GitHub',
      linkedinLink: 'Profil LinkedIn',
      roles: {
        yassine: 'Lead Hardware & Architecte Systèmes Embarqués',
        amine: 'Chercheur Principal en Robotique Autonome & IA',
        sara: 'Développeuse Fullstack & Architecte Infrastructure Cloud',
      },
      bios: {
        yassine: 'Plus de 8 ans d\'expérience dans le routage de PCB multicouches (Altium/KiCad) et la programmation firmware (STM32/ESP32). Supervise la fabrication matérielle des robots.',
        amine: 'Doctorat en algorithmes décentralisés. Expert en systèmes multi-agents, vision par ordinateur, et déploiement local de réseaux de neurones Edge AI.',
        sara: 'Spécialiste de la conception et de la scalabilité d\'architectures cloud en temps réel. Gère les flux WebSockets, gRPC, et l\'orchestration via Kubernetes.',
      }
    },
    archive: {
      title: 'Galerie Photos & Laboratoires',
      subtitle: 'Catalogue visuel documentant nos laboratoires électroniques, essais de robotique autonome, et ateliers',
      labElectronics: 'Laboratoire d\'Électronique & Assemblage PCB',
      labElectronicsDesc: 'Là où nos prototypes matériels sont conçus, soudés, assemblés, et testés localement.',
      fieldRobotics: 'Essais Terrains d\'Essaims Robotiques',
      fieldRoboticsDesc: 'Tests de navigation SLAM et algorithmes de consensus décentralisé en environnement réel.',
      smartCityDeploy: 'Installation des Nœuds Edge AI Smart Traffic',
      smartCityDeployDesc: 'Déploiement de caméras intelligentes et calcul local aux carrefours majeurs au Maroc.',
      cloudTelemetry: 'Centre de Commande Cloud & Télémétrie',
      cloudTelemetryDesc: 'Supervision et pilotage en temps réel avec latence milliseconde des équipements distants.',
      labAI: 'Supercalculateur & Entraînement de Modèles',
      labAIDesc: 'Briques matérielles locales pour l\'entraînement, la compression, et la quantification des modèles IA.',
      communityExpo: 'Exposition Technologique au Maroc',
      communityExpoDesc: 'Démonstrations des innovations de l\'équipe aux universités partenaires et sponsors.',
    },
    projects: {
      title: 'Bande des Projets & Répertoire Git',
      subtitle: 'Répertoire en temps réel de nos projets techniques et intégration aux dépôts GitHub',
      statusLabel: 'Statut du Projet',
      githubRepo: 'Dépôt GitHub',
      commitsCount: 'Nombre de Commits',
      pullRequests: 'Pull Requests Actives',
      activeIssues: 'Bugs Ouverts',
      viewRepository: 'Explorer le Code Source',
      status: {
        idea: 'Design & Architecture',
        development: 'Développement Actif',
        testing: 'Calibration & Essais',
        deployed: 'Déploiement Stable en Production',
      },
      list: {
        smartTraffic: {
          name: 'Gestion de Trafic Intelligent via Edge AI',
          desc: 'Régulation des feux en temps réel basée sur le traitement vidéo local à Casablanca.',
          repo: 'gitm-org/edge-ai-traffic-controller',
        },
        swarmNav: {
          name: 'Coordinateur Robotique ROS2',
          desc: 'Essaim autonome collaborant pour des missions de recherche via LiDAR.',
          repo: 'gitm-org/ros2-swarm-coordinator',
        },
        telemetryHub: {
          name: 'Superviseur de Télémétrie Cloud IoT',
          desc: 'Hub à haut débit collectant et indexant les données de centaines de nœuds physiques.',
          repo: 'gitm-org/gitm-telemetry-ingestion-core',
        },
        edgeHardware: {
          name: 'Carte Contrôleur IoT STM32 v2',
          desc: 'Circuit sur mesure fusionnant microprocesseur, modules LoRaWAN et gestion solaire.',
          repo: 'gitm-org/stm32-lora-sensor-board',
        }
      }
    },
    academy: {
      title: 'GITM Advanced Engineering Academy',
      subtitle: 'Apprentissage par projets fusionnant Hardware, IA et Cloud. Laboratoires pratiques et interactifs au lieu d\'un clone passif de Coursera',
      learningTracks: 'Parcours d\'Apprentissage Spécialisés',
      playgroundTitle: 'Simulateur Matériel Interactif & Sandbox',
      playgroundDesc: 'Compilez du code sur des cartes virtuelles ou lancez des entraînements de modèles IA.',
      terminalHeader: 'Compilateur STM32 / Exécuteur IA',
      runCodeBtn: 'Compiler & Exécuter',
      resetCodeBtn: 'Réinitialiser',
      enrolledBadge: 'Inscrit au Parcours',
      enrollBtn: 'Commencer le Parcours',
      sandboxOutput: 'Console Matérielle :',
      codePlaceholder: '// Écrivez votre firmware C/C++ ou script Python ici...',
      tracks: {
        edge: {
          title: 'Spécialiste Edge AI & Systèmes Embarqués',
          desc: 'Routage de circuits, flashage firmware STM32/ESP32, et optimisation locale de réseaux de neurones.',
          level: 'Avancé | 40 Heures',
        },
        robotics: {
          title: 'Architecte Robotique Autonome & ROS2',
          desc: 'Développement d\'algorithmes SLAM, navigation autonome, et coordination décentralisée.',
          level: 'Expert | 60 Heures',
        },
        iotCloud: {
          title: 'Architecte Cloud IoT & Plateformes Web',
          desc: 'Ingestion de données de flux, protocoles WebSockets/gRPC, base temporelle et orchestration.',
          level: 'Intermédiaire-Avancé | 45 Heures',
        }
      }
    },
    auth: {
      loginTitle: 'Accès Sécurisé au Portail GITM',
      registerTitle: 'Créer un Compte Membre',
      email: 'Adresse Email Professionnelle',
      password: 'Mot de Passe',
      confirmPassword: 'Confirmer le Mot de Passe',
      name: 'Nom Complet',
      roleSelect: 'Sélectionner le Rôle d\'Accès',
      loginBtn: 'Se Connecter',
      registerBtn: 'S\'inscrire',
      forgotPassword: 'Mot de passe oublié ?',
      dontHaveAccount: 'Pas de compte ? Inscrivez-vous',
      alreadyHaveAccount: 'Déjà un compte ? Connectez-vous',
      roles: {
        president: 'Président du Groupe / Directeur Général',
        teacher: 'Instructeur de l\'Académie / Enseignant',
        member: 'Ingénieur / Membre du Staff',
        student: 'Étudiant / Stagiaire de l\'Académie',
        partner: 'Partenaire Financier / Sponsor',
        university: 'Délégué / Représentant Universitaire',
      }
    },
    dashboards: {
      demoControl: 'Contrôleur de Rôles & Démo (Demo Controller)',
      demoDesc: 'Basculez instantanément entre les 6 profils pour tester les fonctions sans créer plusieurs comptes.',
      activeRoleLabel: 'Rôle Actif Prévisualisé :',
      president: {
        title: 'Tableau de Bord du Président & Directeur Général',
        subtitle: 'Suivi stratégique des budgets, allocation des tâches de développement, et accords académiques.',
        stats: {
          budget: 'Fonds de Projets Alloués',
          students: 'Étudiants Actifs',
          tasks: 'Tâches Techniques Actives',
          partners: 'Sponsors & Universités',
        },
        actions: {
          title: 'Opérations Stratégiques',
          assignTask: 'Attribuer une Tâche à un Ingénieur',
          allocBudget: 'Allouer une Subvention Universitaire',
          approveGrant: 'Approuver un Financement Partenaire',
          taskPlaceholder: 'Détails de la tâche (ex. Mettre à jour la librairie STM32)...',
          targetMember: 'Ingénieur Visé :',
          amount: 'Montant du Financement (MAD) :',
          successTask: 'Tâche attribuée avec succès à l\'ingénieur !',
          successBudget: 'Subvention conjointe transmise à l\'université partenaire !',
        }
      },
      teacher: {
        title: 'Tableau de Bord des Enseignants & Instructeurs',
        subtitle: 'Suivi des parcours, publication de leçons de code, et évaluation des travaux d\'étudiants.',
        stats: {
          classes: 'Classes Actives',
          graded: 'Travaux Évalués',
          pending: 'Copies en Attente',
          score: 'Moyenne Générale',
        },
        actions: {
          title: 'Gestion des Cours & Notes',
          createCourse: 'Publier une Nouvelle Leçon Pratique',
          gradeStudent: 'Noter le Code d\'un Étudiant',
          coursePlaceholder: 'Titre de la nouvelle leçon...',
          gradeScore: 'Note (sur 100) :',
          successCourse: 'Leçon publiée avec succès dans le catalogue de l\'Académie !',
          successGrade: 'Note enregistrée. Notification transmise à l\'étudiant !',
        }
      },
      member: {
        title: 'Tableau de Bord des Ingénieurs & Staff',
        subtitle: 'Suivi des circuits assignés, vérification de pull requests, et lancement d\'entraînements IA.',
        stats: {
          myTasks: 'Mes Tâches Actives',
          commits: 'Commits de Code Réalisés',
          aiJobs: 'Entraînements de Réseaux',
          hardwareBuilds: 'Nœuds Matériels Assemblés',
        },
        actions: {
          title: 'Opérations Techniques',
          launchTraining: 'Lancer un Entraînement Deep Learning',
          updateTask: 'Mettre à Jour le Statut d\'une Tâche PCB',
          successTrain: 'Entraînement de modèle Edge AI lancé sur la grappe GPU...',
          successTask: 'Statut mis à jour et validé avec succès !',
        }
      },
      student: {
        title: 'Tableau de Bord des Étudiants & Apprenants',
        subtitle: 'Suivi des cours, soumission de solutions C++/Python, et carnet de notes.',
        stats: {
          myCourses: 'Parcours suivis',
          myGrade: 'Moyenne Actuelle',
          quizPassed: 'Quiz Réussis',
          hoursSpent: 'Heures de Travaux Pratiques',
        },
        actions: {
          title: 'Zone d\'Activités Académiques',
          submitCode: 'Soumettre une Solution de Code (TP)',
          takeQuiz: 'Passer le Quiz Edge AI Rapide',
          successCode: 'Solution envoyée avec succès à l\'instructeur pour évaluation !',
          successQuiz: 'Quiz soumis ! Note obtenue : 90% !',
        }
      },
      partner: {
        title: 'Tableau de Bord des Sponsors & Partenaires',
        subtitle: 'Suivi des fonds déployés, télémétrie des laboratoires financés, et rapports d\'impact.',
        stats: {
          funded: 'Total des Fonds Sponsorisés',
          sponsoredLabs: 'Labos de Recherche Financés',
          papersPublished: 'Publications Académiques',
          roi: 'Index d\'Efficience Technique',
        },
        actions: {
          title: 'Actions d\'Investissement',
          fundProject: 'Proposer un Nouveau Financement',
          requestReport: 'Demander un Rapport de Télémétrie',
          successFund: 'Proposition envoyée au Président pour validation !',
          successReport: 'Demande de rapport envoyée au coordonnateur du laboratoire !',
        }
      },
      university: {
        title: 'Tableau de Bord des Universités Affiliées',
        subtitle: 'Coordination des articles conjoints, gestion des stagiaires universitaires, et monitoring des capteurs.',
        stats: {
          researchers: 'Chercheurs Associés',
          internships: 'Stagiaires Actifs',
          jointProjects: 'Projets R&D Communs',
          labTelemetry: 'Capteurs de Campus',
        },
        actions: {
          title: 'Actions de Synergie Académique',
          approveInternship: 'Approuver un Stage Étudiant',
          publishPaper: 'Soumettre un Article Scientifique Conjoint',
          successIntern: 'Contrat de stage signé et ajouté au dossier étudiant !',
          successPaper: 'Résumé de l\'article scientifique validé et publié !',
        }
      }
    },
    aiModal: {
      title: 'Real-time AI Language Translator Simulation',
      desc: 'Our multilingual model is currently aligning language matrices and generating localized interface vectors.',
      processing: 'Connecting to AI Inference Engine (LLM Pipeline)...',
      tokenizing: 'Tokenizing AST (Abstract Syntax Tree)...',
      translating: 'Applying neural weight translation matrices...',
      rendering: 'Rebuilding visual components dynamically...',
      success: 'AI translation completed with 99.8% accuracy!',
      close: 'Apply Language',
    },
    showcase: {
      title: 'Vitrine des Solutions & Systèmes Intégrés',
      subtitle: 'Analyse technique et architecturale des projets intelligents déployés par GITM',
      archDiagram: 'Diagramme Topologique de l\'Architecture',
      problem: 'Problème Clé & Solution Technique :',
      techUsed: 'Technologies & Bibliothèques Utilisées :',
      categories: {
        smartCity: 'Gestion du Trafic Intelligent (Edge AI)',
        robotics: 'Navigation d\'Essaim Robotique (ROS2)',
        platforms: 'Télémétrie Cloud IoT en Temps Réel',
      },
      projects: {
        smartCity: {
          title: 'Contrôleur de Trafic Adaptatif via Edge AI',
          description: 'Système de calcul Edge traitant des flux vidéo HD avec des modèles YOLOv8 pour optimiser la synchronisation des feux de signalisation, réduisant le temps d\'attente de 35%.',
          problemSolved: 'Optimisation dynamique de la congestion routière aux intersections plutôt que des horaires fixes.',
          architecture: 'Jetson Nano node -> MQTT Broker -> InfluxDB -> Node-RED control matrix',
          tech: 'YOLOv8, Python, MQTT, C++, InfluxDB',
        },
        robotics: {
          title: 'Plateforme de Coordination d\'Essaims ROS2',
          description: 'Système décentralisé coordonnant des essaims de robots (drones et véhicules terrestres) pour la recherche collective sans coordinateur central.',
          problemSolved: 'Navigation d\'essaims dans des zones privées de GPS et division de grille de recherche.',
          architecture: 'Micro-ROS on ESP32 -> ROS2 Humble -> Zenoh DDS -> LIDAR mapping pipeline',
          tech: 'ROS2, C++, ESP32, Python, Zenoh, LiDAR',
        },
        platforms: {
          title: 'Serveur de Télémétrie IoT Temps Réel à Haut Débit',
          description: 'Framework cloud hybride conçu pour ingérer la télémétrie de milliers de nœuds physiques, offrant des mises à jour en direct sous la barre des 10ms.',
          problemSolved: 'Traitement de données IoT simultanées massives et synchronisation des tableaux de bord en temps réel.',
          architecture: 'React Client Websockets -> Node.js Cluster -> TimescaleDB -> Redis Cache',
          tech: 'React, Node.js, WebSockets, TimescaleDB, Docker, Redis',
        },
      },
    },
    methodology: {
      title: 'Notre Méthodologie d\'Ingénierie',
      subtitle: 'Comment nous transférons les concepts techniques du design théorique aux déploiements sur le terrain',
      steps: [
        {
          num: '01',
          title: 'Recherche & Architecture Système',
          desc: 'Analyse des exigences, cartographie des flux de données réseau, spécification des composants et schémas initiaux.'
        },
        {
          num: '02',
          title: 'Firmware & Fabrication de PCB',
          desc: 'Écriture du code embarqué de bas niveau, conception de circuits imprimés multicouches et modèles IA pour exécution locale.'
        },
        {
          num: '03',
          title: 'Essais Physiques & Étalonnage',
          desc: 'Tests de contrainte thermique et mécanique, calibration des capteurs sur site réel et ajustement de l\'intégration matérielle.'
        },
        {
          num: '04',
          title: 'Déploiement & Télémétrie Directe',
          desc: 'Installation sur le terrain, activation des mises à jour sans fil sécurisées (OTA) et liaison télémétrique en temps réel avec le cloud.'
        }
      ]
    },
    team: {
      title: 'Notre Équipe de Spécialistes',
      subtitle: 'Les cerveaux techniques et chercheurs derrière les projets GITM au Maroc',
      skillsLabel: 'Compétences & Technologies :',
      members: [
        {
          name: 'Yassine El Marrakchi',
          role: 'Lead Hardware & Architecte Embarqué',
          bio: 'Plus de 8 ans d\'expérience dans le routage de PCB multicouches (Altium/KiCad) et la programmation firmware (STM32/ESP32). Supervise la fabrication.',
          skills: ['Altium Designer', 'C/C++', 'STM32 HAL', 'RTOS', 'KiCad'],
          image: '/member_yassine.png'
        },
        {
          name: 'Dr. Amine Benjelloun',
          role: 'Chercheur Principal en Robotique & IA',
          bio: 'Doctorat en algorithmes décentralisés. Expert en systèmes multi-agents, vision par ordinateur, et déploiement local de réseaux de neurones Edge AI.',
          skills: ['ROS2 Humble', 'Python', 'YOLOv8', 'TensorFlow', 'LiDAR SLAM'],
          image: '/member_amine.png'
        },
        {
          name: 'Sara El Fassi',
          role: 'Développeuse Fullstack & Cloud',
          bio: 'Spécialiste de la conception et de la scalabilité d\'architectures cloud en temps réel. Gère les flux WebSockets, gRPC, et l\'orchestration via Kubernetes.',
          skills: ['React.js', 'Node.js', 'WebSockets', 'Docker', 'TimescaleDB'],
          image: '/member_sara.png'
        }
      ]
    }
  },
  es: {
    showcase: {
      title: 'Vitrina de Soluciones y Sistemas Integrados',
      subtitle: 'Inmersión técnica y arquitectónica en sistemas inteligentes diseñados y desplegados por GITM',
      archDiagram: 'Diagramma de Topología de Arquitectura de Ingeniería',
      problem: 'Problema Principal y Solución Técnica:',
      techUsed: 'Tecnologías y Bibliotecas Desplegadas:',
      categories: {
        smartCity: 'Control de Tráfico Inteligente (Edge AI)',
        robotics: 'Navegación Robótica de Enjambre (ROS2)',
        platforms: 'Flujo de Telemetría IoT en Tiempo Real (Nube)',
      },
      projects: {
        smartCity: {
          title: 'Controlador de Tráfico Adaptativo por Procesamiento de Video',
          description: 'Sistema de computación de borde que procesa transmisiones de video HD con modelos YOLOv8 para optimizar semáforos, reduciendo los tiempos de espera en un 35%.',
          problemSolved: 'Optimización dinámica de la congestión del tráfico en intersecciones en lugar de horarios fijos.',
          architecture: 'Jetson Nano node -> MQTT Broker -> InfluxDB -> Node-RED control matrix',
          tech: 'YOLOv8, Python, MQTT, C++, InfluxDB',
        },
        robotics: {
          title: 'Plataforma de Coordinación de Robótica de Enjambre ROS2',
          description: 'Sistema de comando descentralizado que coordina enjambres de robots para búsqueda y rescate colaborativos usando mapeo SLAM sin cuello de botella central.',
          problemSolved: 'Navegación de enjambres en entornos sin GPS y división de tareas cooperativas sin servidor central.',
          architecture: 'Micro-ROS on ESP32 -> ROS2 Humble -> Zenoh DDS -> LIDAR mapping pipeline',
          tech: 'ROS2, C++, ESP32, Python, Zenoh, LiDAR',
        },
        platforms: {
          title: 'Servidor de Telemetría IoT en Tiempo Real de Alto Rendimiento',
          description: 'Estructura de nube híbrida para ingerir datos de telemetría de miles de nodos activos, entregando actualizaciones en vivo con latencia menor a 10ms.',
          problemSolved: 'Procesamiento masivo de actualizaciones concurrentes de IoT y sincronización de paneles bajo carga máxima.',
          architecture: 'React Client Websockets -> Node.js Cluster -> TimescaleDB -> Redis Cache',
          tech: 'React, Node.js, WebSockets, TimescaleDB, Docker, Redis',
        },
      },
    },
    methodology: {
      title: 'Nuestra Metodología de Ingeniería',
      subtitle: 'Cómo transitamos los conceptos técnicos desde el diseño teórico hasta los despliegues de campo',
      steps: [
        {
          num: '01',
          title: 'Investigación y Arquitectura del Sistema',
          desc: 'Análisis de requerimientos, diseño de flujos de datos de red, definición de especificaciones y diagramas esquemáticos iniciales.'
        },
        {
          num: '02',
          title: 'Firmware y Fabricación de PCB',
          desc: 'Escritura de firmware para microcontroladores, diseño de PCB multicapa y entrenamiento de modelos de IA de borde.'
        },
        {
          num: '03',
          title: 'Pruebas de Campo y Calibración',
          desc: 'Sometimiento de sistemas a simulación de estrés, calibración de sensores en condiciones reales y ajuste de integración física.'
        },
        {
          num: '04',
          title: 'Despliegue y Telemetría en Nube',
          desc: 'Instalación física de nodos, habilitación de actualizaciones inalámbricas OTA y sincronización de telemetría en tiempo real.'
        }
      ]
    }
  },
  de: {
    showcase: {
      title: 'Integrierte Lösungen & Systempräsentation',
      subtitle: 'Technischer und architektonischer tiefer Einblick in intelligente Systeme von GITM',
      archDiagram: 'Topologiediagramm der Systemarchitektur',
      problem: 'Kernproblem & Technische Lösung:',
      techUsed: 'Eingesetzte Technologien & Bibliotheken:',
      categories: {
        smartCity: 'Intelligente Verkehrssteuerung (Edge AI)',
        robotics: 'Schwarmroboter-Navigation (ROS2)',
        platforms: 'Echtzeit-IoT-Telemetriestrom (Cloud)',
      },
      projects: {
        smartCity: {
          title: 'Adaptiver verkehrsabhängiger Signalregler',
          description: 'Edge-Computing-System, das HD-Videoströme mit YOLOv8-Objekterkennungsmodellen verarbeitet, um Verkehrsampelpläne zu optimieren und Wartezeiten um 35 % zu verkürzen.',
          problemSolved: 'Dynamische Verkehrsoptimierung an Kreuzungen statt starrer Ampelphasen.',
          architecture: 'Jetson Nano node -> MQTT Broker -> InfluxDB -> Node-RED control matrix',
          tech: 'YOLOv8, Python, MQTT, C++, InfluxDB',
        },
        robotics: {
          title: 'ROS2 Schwarmrobotik-Koordinationsplattform',
          description: 'Dezentrales Steuerungssystem zur Koordination von Roboter-Schwärmen für Suche und Rettung mittels SLAM-Kartierung ohne zentralen Koordinator.',
          problemSolved: 'Schwarmnavigation in Umgebungen ohne GPS-Empfang und kooperative Aufteilung der Suchgebiete.',
          architecture: 'Micro-ROS on ESP32 -> ROS2 Humble -> Zenoh DDS -> LIDAR mapping pipeline',
          tech: 'ROS2, C++, ESP32, Python, Zenoh, LiDAR',
        },
        platforms: {
          title: 'Hochleistungs-Echtzeit-IoT-Telemetrieserver',
          description: 'Hybrid-Cloud-Framework zur Erfassung von Telemetriedaten von Tausenden aktiven Knoten mit Live-Aktualisierung unter 10 ms Latenz.',
          problemSolved: 'Verarbeitung extrem vieler gleichzeitiger IoT-Updates und Echtzeit-Synchronisation unter Spitzenlast.',
          architecture: 'React Client Websockets -> Node.js Cluster -> TimescaleDB -> Redis Cache',
          tech: 'React, Node.js, WebSockets, TimescaleDB, Docker, Redis',
        },
      },
    },
    methodology: {
      title: 'Unsere Engineering-Methodik',
      subtitle: 'Wie wir technische Konzepte vom theoretischen Entwurf zur einsatzbereiten Bereitstellung führen',
      steps: [
        {
          num: '01',
          title: 'Forschung & Systemarchitektur',
          desc: 'Analyse der Anforderungen, Abbildung von Datenflüssen, Definition elektrischer Spezifikationen und Entwurf von Schaltplänen.'
        },
        {
          num: '02',
          title: 'Firmware & PCB-Fertigung',
          desc: 'Schreiben von Low-Level-Hardware-Firmware, Entwurf von Multilayer-PCBs und Optimierung von Edge-AI-Modellen.'
        },
        {
          num: '03',
          title: 'Feldtests & Kalibrierung',
          desc: 'Belastungssimulationen der Systeme, Kalibrierung der Sensoren unter realen Bedingungen und Feinabstimmung der Systemintegration.'
        },
        {
          num: '04',
          title: 'Inbetriebnahme & Telemetrie',
          desc: 'Physische Installation vor Ort, Aktivierung sicherer OTA-Funk-Updates und Anbindung an das Cloud-Command-Center für Live-Daten.'
        }
      ]
    }
  },
  ja: {
    showcase: {
      title: '統合ソリューション＆システムショーケース',
      subtitle: 'GITMが設計・展開するスマートシステムの技術的およびアーキテクチャ的なディープダイブ',
      archDiagram: 'エンジニアリングアーキテクチャトポロジ図',
      problem: '主な課題と技術的解決策:',
      techUsed: '使用された技術とライブラリ:',
      categories: {
        smartCity: 'スマート交通制御 (Edge AI)',
        robotics: '群ロボットナビゲーション (ROS2)',
        platforms: 'リアルタイムIoTテレメトリストリーム (Cloud)',
      },
      projects: {
        smartCity: {
          title: '適応型ビデオ処理交通コントローラー',
          description: 'エッジコンピューティングシステムでHDビデオフィードをYOLOv8物体検出モデルで処理し、信号制御スケジュールを最適化して待ち時間を35%削減。',
          problemSolved: '静的なタイマースケジュールに頼る代わりに、交差点の交通渋滞を動的に最適化。',
          architecture: 'Jetson Nano node -> MQTT Broker -> InfluxDB -> Node-RED control matrix',
          tech: 'YOLOv8, Python, MQTT, C++, InfluxDB',
        },
        robotics: {
          title: 'ROS2群ロボティクス協調プラットフォーム',
          description: '分散型コマンドシステムで、SLAMマッピングとタスク分割を使用し、捜索救助用のロボット群を中央のボトルネックなしに調整。',
          problemSolved: 'GPSの届かない環境でロボット群がマッピングを行い、中央コーディネーターなしでタスクを分散実行。',
          architecture: 'Micro-ROS on ESP32 -> ROS2 Humble -> Zenoh DDS -> LIDAR mapping pipeline',
          tech: 'ROS2, C++, ESP32, Python, Zenoh, LiDAR',
        },
        platforms: {
          title: '高スループットリアルタイムIoTテレメトリサーバー',
          description: 'ハイブリッドクラウドフレームワークで、数千のアクティブな物理ノードからテレメトリデータを取り込み、10ms未満の低レイテンシでライブアップデートを提供。',
          problemSolved: '大量の同時IoT更新の処理とピークロード下でのリアルタイムダッシュボード同期。',
          architecture: 'React Client Websockets -> Node.js Cluster -> TimescaleDB -> Redis Cache',
          tech: 'React, Node.js, WebSockets, TimescaleDB, Docker, Redis',
        },
      },
    },
    methodology: {
      title: 'エンジニアリング手法',
      subtitle: '技術コンセプトを理論設計から現場対応の展開へと移行させるプロセス',
      steps: [
        {
          num: '01',
          title: '研究とシステムアーキテクチャ',
          desc: '要件の分析、ネットワークデータフローの設計、電気的仕様の定義、初期の回路設計図の作成。'
        },
        {
          num: '02',
          title: 'ファームウェアとPCBの製造',
          desc: '低レベルのハードウェアファームウェア作成、多層PCBの設計、ローカルエッジ実行用の最適化されたAIモデルの構築。'
        },
        {
          num: '03',
          title: 'フィールドテストと校正',
          desc: 'システムにストレス環境シミュレーションを適用し、実際の条件下でセンサーを校正し、ソフトウェアとハードウェアの統合を微調整。'
        },
        {
          num: '04',
          title: '展開とクラウドテレメトリ',
          desc: '現場へのノードの物理的な展開、安全なOTAワイヤレスアップデートの有効化、リアルタイム遠隔測定用のクラウド管理センターへの接続。'
        }
      ]
    }
  }
};
