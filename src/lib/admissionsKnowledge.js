export const COUNTRIES = [
  {
    id: 'usa',
    name: 'США',
    shortName: 'США',
    philosophy: 'Холистический отбор (Holistic Review)',
    summary:
      'Американские вузы оценивают личность целиком: академическую строгость, сильный профиль («Spike») в одном направлении, лидерство, создание реальных проектов и вклад в сообщество.',
    whatMattersMost: [
      'Глубина и измеримый результат проектов (MVP, пользователи, призовые места, публикации)',
      'Инициатива и лидерство: организация клубов, tech-волонтёрство, менторство',
      'Сильные эссе (Common App) и рекомендательные письма с конкретными примерами'
    ],
    admissionsTests: 'SAT / ACT (по политике вуза), TOEFL / IELTS / Duolingo English Test',
    financialAidNote:
      'Для поступающих на бакалавриат из СНГ главные источники — Need-Based Financial Aid вузов (CSS Profile) и программа EducationUSA Opportunity Funds для покрытия расходов на поступление.',
    checklist: [
      'Определить основной «Spike» (1–2 ключевые области, где есть измеримые достижения)',
      'Собрать 6–10 сильных активностей для Common App Activities List с конкретными цифрами',
      'Подготовить SAT/ACT и IELTS/TOEFL за 8–12 месяцев до дедлайна (Early: ноябрь, Regular: январь)',
      'Проверить условия CSS Profile и обратиться в местный центр EducationUSA (Opportunity Funds)'
    ]
  },
  {
    id: 'uk',
    name: 'Великобритания',
    shortName: 'Великобритания',
    philosophy: 'Академический и предметный отбор (Supercurriculars)',
    summary:
      'В системе UCAS важна не «разносторонность», а глубокая академическая одержимость выбранным предметом (Supercurriculars): олимпиады, научное чтение, исследования и профильные вступительные тесты.',
    whatMattersMost: [
      'Строго предметные активности (Supercurriculars) по выбранному Major (80%+ Personal Statement)',
      'Олимпиады, вступительные тесты (TMUA, MAT, PAT, UCAT, LNAT) и высокие оценки',
      'Аналитический разбор прочитанных книг, лекций и собственных технических/научных задач'
    ],
    admissionsTests: 'IELTS UKVI/Academic, а также профильные тесты: TMUA, MAT, PAT, UCAT, LNAT',
    financialAidNote:
      'Бакалавриат в Британии чаще финансируется через именные стипендии вузов (Reach Oxford, Think Big, Warwick) или национальные гранты, а для магистратуры действует полная стипендия Chevening.',
    checklist: [
      'Сфокусировать 80% активностей строго на выбранной специальности без «лишних» кружков',
      'Участвовать в профильных олимпиадах и научных конкурсах международного уровня',
      'Зарегистрироваться на вступительные тесты UCAS (обычно сдача осенью до дедлайна 15 октября / январь)',
      'Вести список академических книг, курсов и проектов с выводами для Personal Statement'
    ]
  },
  {
    id: 'europe',
    name: 'Европа (ЕС)',
    shortName: 'Европа',
    philosophy: 'Академический порог, экзамены и госсхемы стипендий',
    summary:
      'Государственные вузы Германии, Нидерландов, Италии, Венгрии и Франции смотрят прежде всего на соответствие аттестата/диплома, профильные оценки по математике/наукам и вступительные экзамены.',
    whatMattersMost: [
      'Высокий средний балл (GPA) и профильные предметы (математика, физика, биология)',
      'Успешная сдача вступительных экзаменов (ETH, TU Delft, Bocconi, IMAT, Studienkolleg)',
      'Мотивационное письмо и профильный опыт для стипендиальных комиссий (DAAD, Erasmus, Hungary)'
    ],
    admissionsTests: 'IELTS / TOEFL, TestDaF / Goethe (Германия), SAT / Bocconi Test / IMAT',
    financialAidNote:
      'В Европе сильнейшая поддержка через государственные стипендии: бесплатное обучение в Германии + DAAD, полная квота Stipendium Hungaricum (Венгрия), DSU (Италия) и Erasmus Mundus для магистратуры.',
    checklist: [
      'Проверить эквивалентность аттестата/диплома (например, Anabin для Германии или 12 лет образования)',
      'Вывести оценки по математике и профильным наукам на максимум',
      'Подготовить документы для государственных квот и стипендий (Stipendium Hungaricum до 15 января)',
      'Сдать языковые экзамены и профильный вступительный тест конкретного вуза'
    ]
  },
  {
    id: 'asia',
    name: 'Азия и Турция',
    shortName: 'Азия / Турция',
    philosophy: 'STEM-достижения и государственные квоты',
    summary:
      'Южная Корея (KAIST, GKS), Япония (MEXT), Сингапур (NUS/NTU) и Турция (Türkiye Bursları) активно привлекают таланты из СНГ через полные гранты, встроенные в поступление или через посольства.',
    whatMattersMost: [
      'Сильный STEM/академический бэкграунд, олимпиады, научные проекты и хакатоны',
      'Убедительная мотивация к обучению в выбранной стране и межкультурная адаптивность',
      'Раннее попадание в посольские или университетские треки отбора'
    ],
    admissionsTests: 'SAT / AP / IB (особенно KAIST, NUS), IELTS / TOEFL, при необходимости TOPIK / JLPT',
    financialAidNote:
      'KAIST автоматически рассматривает принятых студентов на полное покрытие обучения со стипендией; GKS, MEXT и Türkiye Bursları покрывают обучение, перелёт, жильё и ежемесячные расходы.',
    checklist: [
      'Выбрать трек: университетский (KAIST, NUS) или посольский (GKS, MEXT, Türkiye Bursları)',
      'Подтвердить академический уровень (SAT/AP, олимпиады, портфолио проектов)',
      'Следить за окнами подачи: Türkiye Bursları (январь–февраль), GKS (февраль–март), MEXT (весна)',
      'Подготовить рекомендации от преподавателей и план обучения (Study Plan)'
    ]
  },
  {
    id: 'canada',
    name: 'Канада',
    shortName: 'Канада',
    philosophy: 'Академические оценки + профильный портфель (AIF)',
    summary:
      'Ведущие университеты Канады (Waterloo, UofT, UBC) сочетают высокий проходной балл с дополнительными анкетами (AIF / Personal Profile), где ценятся олимпиады, хакатоны и устойчивое участие.',
    whatMattersMost: [
      'Стабильно высокие оценки по профильным предметам за последние 2 года школы',
      'Профильные конкурсы и олимпиады (например, Waterloo CCC / Euclid для CS и инженерии)',
      'Реальный опыт в проектах, волонтёрстве или работе для раздела Supplemental Application'
    ],
    admissionsTests: 'IELTS / TOEFL / Duolingo, конкурсы Waterloo (CCC, Euclid) как сильный плюс',
    financialAidNote:
      'Полное финансирование для бакалавров в Канаде высококонкурентно (Lester B. Pearson в UofT, UBC IMES) и требует отдельной номинации от школы или ранней заявки.',
    checklist: [
      'Узнать про школьную номинацию на стипендии (например, Lester B. Pearson до осени выпускного года)',
      'Зарегистрироваться на профильные конкурсы (Waterloo CCC / Euclid / Fermat)',
      'Собрать 3–5 качественных описаний активностей с ролями и результатами для Personal Profile',
      'Подготовить IELTS (обычно 6.5–7.0+) и подать документы до января'
    ]
  },
  {
    id: 'cis',
    name: 'Топ-вузы СНГ',
    shortName: 'Топ-вузы СНГ',
    philosophy: 'Олимпиадные льготы и грантовые конкурсы',
    summary:
      'Ведущие вузы региона (Назарбаев Университет, Университет Иннополис, ВШЭ, ИТМО, КБТУ) дают прямые гранты, фаст-треки и стипендии победителям профильных олимпиад, хакатонов и конкурсов.',
    whatMattersMost: [
      'Победы и призовые места в перечневых олимпиадах и международных хакатонах',
      'Результаты вступительных экзаменов (NUET, SAT, ЕГЭ/ЕНТ, внутренние тесты)',
      'Технические/исследовательские проекты и мотивационное собеседование (как в Иннополисе)'
    ],
    admissionsTests: 'NUET / SAT, IELTS (для англоязычных программ), профильные олимпиады',
    financialAidNote:
      'Доступны полные образовательные гранты самих университетов, государственные квоты и программы вроде «Болашак» (Казахстан) или «Эл-юрт умиди» (Узбекистан).',
    checklist: [
      'Составить календарь перечневых олимпиад и грантовых конкурсов вузов (осень–весна)',
      'Подготовить портфолио проектов (GitHub, научные работы, победы на хакатонах)',
      'Проверить требования к IELTS и SAT/NUET для англоязычных программ',
      'Подать заявки на внутренние гранты вузов до весенних дедлайнов'
    ]
  }
];

export const MAJORS = [
  {
    id: 'cs',
    name: 'Computer Science & AI',
    shortName: 'Computer Science',
    description: 'Разработка ПО, алгоритмы, машинное обучение, кибербезопасность и геймдев.',
    preferredCategories: ['Хакатон', 'Game Jam', 'Tech-ивент', 'Олимпиада', 'Исследование', 'Стажировка'],
    keywords: [
      'ai', 'ml', 'it', 'tech', 'game jam', 'gamedev', 'хакатон', 'hackathon', 'код', 'программир',
      'информатик', 'алгоритм', 'разработ', 'frontend', 'backend', 'python', 'data', 'кибер',
      'software', 'open source', 'app', 'digital', 'стартап', 'техно'
    ],
    blueprints: [
      {
        title: 'Хакатоны с готовым MVP',
        category: 'Хакатон',
        whyItMatters: 'Доказывает умение быстро собирать рабочий продукт в команде, интегрировать API/AI и защищать решение перед жюри.',
        targetOutcome: 'Деплой рабочего проекта, репозиторий на GitHub и призовое место или спецноминация.',
        countryNuance: {
          usa: 'В США особенно ценят реальных пользователей и социальный импакт проекта после хакатона.',
          uk: 'В UK акцентируйте внимание на алгоритмической сложности и архитектуре решения.'
        }
      },
      {
        title: 'Game Jams (разработка игр за 48–72 часа)',
        category: 'Game Jam',
        whyItMatters: 'Демонстрирует системное программирование, компьютерную графику, математику физики и креативность под жёстким дедлайном.',
        targetOutcome: 'Опубликованный билд на itch.io / GitHub и разбор технических вызовов.',
        countryNuance: {
          usa: 'Отлично выделяет профиль среди однотипных веб-приложений в Common App.',
          uk: 'Увяжите физику игры, рендеринг или ИИ-поведение NPC с теорией CS.'
        }
      },
      {
        title: 'Tech-ивенты, конференции и Open Source',
        category: 'Tech-ивент',
        whyItMatters: 'Погружает в индустрию, даёт нетворкинг с инженерами и первые контрибьюты в реальные проекты.',
        targetOutcome: 'Выступление с lightning talk, организация школьного tech-митапа или принятые Pull Requests.',
        countryNuance: {
          usa: 'Организация собственного локального tech-ивента или воркшопа — сильный сигнал лидерства.'
        }
      },
      {
        title: 'Олимпиады по информатике и математике',
        category: 'Олимпиада',
        whyItMatters: 'Даёт бесспорное подтверждение алгоритмического мышления (USACO, IOI, ICPC, Waterloo CCC).',
        targetOutcome: 'Выход в старший дивизион (Silver/Gold+) или призёрство на республиканском/международном этапе.',
        countryNuance: {
          uk: 'Ключевой аргумент для Оксфорда, Кембриджа и Imperial College.',
          europe: 'Решающий плюс при поступлении в технические вузы уровня ETH и TU Delft.'
        }
      }
    ]
  },
  {
    id: 'engineering',
    name: 'Engineering & Robotics',
    shortName: 'Инженерия',
    description: 'Механика, робототехника, электроника, энергетика и прикладная физика.',
    preferredCategories: ['Хакатон', 'Олимпиада', 'Исследование', 'Конкурс', 'Стажировка', 'Tech-ивент'],
    keywords: [
      'инженер', 'робот', 'robotics', 'физик', 'hardware', 'arduino', 'cad', '3d', 'электроник',
      'энерг', 'аэро', 'механ', 'инновац', 'изобрет', 'isef', 'хакатон', 'maker'
    ],
    blueprints: [
      {
        title: 'Соревнования по робототехнике и Hardware-хакатоны',
        category: 'Хакатон',
        whyItMatters: 'Показывает работу с реальными прототипами, датчиками, CAD-моделированием и командным инженерингом.',
        targetOutcome: 'Собранный прототип, техническая документация и участие в FIRST / WRO / профильных хакатонах.',
        countryNuance: {
          usa: 'Опишите свою роль (капитан, CAD-инженер, программист контроллеров) и преодоление сбоев.'
        }
      },
      {
        title: 'Олимпиады по физике и математике',
        category: 'Олимпиада',
        whyItMatters: 'Базовый фильтр для инженерных факультетов мира — подтверждает математическую выносливость.',
        targetOutcome: 'Призёрство в Физтех, IPhO, региональных и университетских олимпиадах.',
        countryNuance: {
          uk: 'Обязательная база перед подготовкой к PAT (Oxford) или ESAT (Cambridge/Imperial).'
        }
      },
      {
        title: 'Инженерные исследования и научные ярмарки',
        category: 'Исследование',
        whyItMatters: 'Проекты уровня Regeneron ISEF показывают способность доводить гипотезу до экспериментальной установки.',
        targetOutcome: 'Постер/статья с замерами, графиками и тестами прототипа.'
      },
      {
        title: 'Профильные стажировки и конструкторские бюро',
        category: 'Стажировка',
        whyItMatters: 'Практика на производстве или в университетской лаборатории отличает от чисто теоретических кандидатов.'
      }
    ]
  },
  {
    id: 'business',
    name: 'Business, Finance & Economics',
    shortName: 'Бизнес и экономика',
    description: 'Предпринимательство, финансы, менеджмент, маркетинг и экономический анализ.',
    preferredCategories: ['Конкурс', 'Стажировка', 'Форум', 'Хакатон', 'Олимпиада', 'Конференция'],
    keywords: [
      'бизнес', 'стартап', 'startup', 'эконом', 'финанс', 'маркетинг', 'менеджмент', 'кейс',
      'предприним', 'инвест', 'лидер', 'проект', 'форум', 'аналит', 'продукт', 'product'
    ],
    blueprints: [
      {
        title: 'Стартап-конкурсы и кейс-чемпионаты',
        category: 'Конкурс',
        whyItMatters: 'Подтверждает умение анализировать рынок, считать unit-экономику и защищать бизнес-идею.',
        targetOutcome: 'Финал кейс-чемпионата, участие в Diamond Challenge / DECA или запуск микро-проекта с выручкой.',
        countryNuance: {
          usa: 'Показывайте цифры: охват, выручка, количество клиентов или привлечённый мини-грант.'
        }
      },
      {
        title: 'Бизнес- и продуктовые стажировки',
        category: 'Стажировка',
        whyItMatters: 'Реальный опыт в компании, стартапе или финансовой команде даёт мощные рекомендательные письма.',
        targetOutcome: 'Конкретный вклад: проведённое исследование рынка, рост метрик, оптимизация процессов.'
      },
      {
        title: 'Экономические олимпиады и конкурсы эссе',
        category: 'Олимпиада',
        whyItMatters: 'Для ведущих экономических школ (LSE, Bocconi, Wharton) критична математика и аналитика.',
        targetOutcome: 'Участие в экономических олимпиадах и эссе-конкурсах (John Locke, Marshall Society).'
      },
      {
        title: 'Международные форумы и социальное предпринимательство',
        category: 'Форум',
        whyItMatters: 'Развивает публичные выступления, нетворкинг и умение вести социальные инициативы.'
      }
    ]
  },
  {
    id: 'medicine',
    name: 'Medicine, Biotech & Life Sciences',
    shortName: 'Медицина и биотех',
    description: 'Медицина, биоинженерия, генетика, нейронауки и общественное здравоохранение.',
    preferredCategories: ['Волонтерство', 'Исследование', 'Олимпиада', 'Стажировка', 'Конференция'],
    keywords: [
      'мед', 'био', 'хим', 'здоров', 'наук', 'лаборатор', 'исслед', 'волонт', 'эколог',
      'нейро', 'генет', 'клиник', 'врач', 'biotech', 'life', 'health'
    ],
    blueprints: [
      {
        title: 'Медицинское и социальное волонтёрство',
        category: 'Волонтерство',
        whyItMatters: 'Демонстрирует эмпатию, устойчивость и понимание реальной работы системы здравоохранения.',
        targetOutcome: 'Регулярные часы в клиниках, донорских проектах или просветительских инициативах (от 3–6 месяцев).',
        countryNuance: {
          uk: 'Для медицины в UK (UCAS + MMI) обязателен осознанный опыт наблюдения/волонтёрства.'
        }
      },
      {
        title: 'Лабораторные исследования и научные конференции',
        category: 'Исследование',
        whyItMatters: 'Работа с биоданными, экспериментами и научными публикациями выделяет на pre-med и biotech треках.',
        targetOutcome: 'Научный тезис, участие в био-ярмарках (ISEF) или совместное исследование с наставником.'
      },
      {
        title: 'Олимпиады по биологии и химии',
        category: 'Олимпиада',
        whyItMatters: 'Подтверждает фундаментальное знание естественных наук для жёстких вступительных порогов.',
        targetOutcome: 'Призёрство на национальных отборах IBO / IChO или профильных вузовских олимпиадах.'
      }
    ]
  },
  {
    id: 'law',
    name: 'Law, IR & Public Policy',
    shortName: 'Право и МО',
    description: 'Международные отношения, право, политология, государственное управление и дипломатия.',
    preferredCategories: ['Форум', 'Волонтерство', 'Конкурс', 'Конференция', 'Стажировка', 'Олимпиада'],
    keywords: [
      'прав', 'юрид', 'дипломат', 'международ', 'политик', 'дебат', 'оон', 'mun', 'форум',
      'общест', 'истор', 'журналист', 'лидер', 'волонт', 'policy', 'law', 'debate', 'граждан'
    ],
    blueprints: [
      {
        title: 'Модели ООН (MUN), дебаты и дипломатические форумы',
        category: 'Форум',
        whyItMatters: 'Развивает аргументацию на английском, переговоры, написание резолюций и лидерство.',
        targetOutcome: 'Роль Best Delegate / Chair, организация собственной школьной или городской конференции MUN.'
      },
      {
        title: 'Волонтёрство в НКО и общественные инициативы',
        category: 'Волонтерство',
        whyItMatters: 'Показывает реальное влияние на местное сообщество, защиту прав или образовательные проекты.',
        targetOutcome: 'Запуск локальной кампании, юридической/языковой помощи или медиа-блога.'
      },
      {
        title: 'Конкурсы аналитических эссе и олимпиады по истории/праву',
        category: 'Конкурс',
        whyItMatters: 'Критически важно для британского LNAT и американских гуманитарных программ.',
        targetOutcome: 'Публикация аналитических статей или шорт-лист в John Locke Essay Competition.'
      }
    ]
  },
  {
    id: 'design',
    name: 'Design, Architecture & Media',
    shortName: 'Дизайн и медиа',
    description: 'Product/UX дизайн, архитектура, графический дизайн, медиа-продакшн и Game Art.',
    preferredCategories: ['Game Jam', 'Хакатон', 'Конкурс', 'Стажировка', 'Курс', 'Форум'],
    keywords: [
      'дизайн', 'design', 'ux', 'ui', 'архитектур', 'медиа', 'креатив', 'арт', 'видео', 'контент',
      'game jam', 'хакатон', 'бренд', 'график', 'иллюстр', 'фото', 'product'
    ],
    blueprints: [
      {
        title: 'Game Jams и продуктовые хакатоны (в роли UI/UX или Art)',
        category: 'Game Jam',
        whyItMatters: 'Показывает работу в кросс-функциональной команде и доведение визуальной концепции до реального продукта.',
        targetOutcome: 'Кейс в портфолио: прототип интерфейса, визуальный стиль игры, user flow.'
      },
      {
        title: 'Архитектурные и дизайн-конкурсы',
        category: 'Конкурс',
        whyItMatters: 'Даёт внешнюю экспертную оценку работ для творческого портфолио.',
        targetOutcome: 'Проекты с подробным описанием концепции, эскизов и итераций (Behance / PDF-портфолио).'
      },
      {
        title: 'Стажировки в дизайн-студиях и медиа',
        category: 'Стажировка',
        whyItMatters: 'Опыт работы по реальному брифу клиента ценится выше учебных упражнений.'
      }
    ]
  },
  {
    id: 'science',
    name: 'Mathematics & Natural Sciences',
    shortName: 'Математика и науки',
    description: 'Чистая и прикладная математика, физика, химия, астрономия и науки о Земле.',
    preferredCategories: ['Олимпиада', 'Исследование', 'Конференция', 'Курс', 'Конкурс'],
    keywords: [
      'математ', 'физик', 'хим', 'астроном', 'науч', 'исслед', 'олимпиад', 'теорет', 'лабор',
      'math', 'physics', 'science', 'research', 'stem'
    ],
    blueprints: [
      {
        title: 'Международные и перечневые олимпиады',
        category: 'Олимпиада',
        whyItMatters: 'Самый прозрачный маркер математической и научной подготовки для приёмных комиссий.',
        targetOutcome: 'Участие и дипломы IMO, IPhO, IChO, Жаутыковской или университетских олимпиад.'
      },
      {
        title: 'Исследовательские школы и научные конференции',
        category: 'Исследование',
        whyItMatters: 'Учит формулировать гипотезу, оформлять научный текст и выступать перед учёными.',
        targetOutcome: 'Исследовательский проект, летняя научная школа или выступление на студенческой конференции.'
      },
      {
        title: 'Научное менторство и кружки',
        category: 'Волонтерство',
        whyItMatters: 'Преподавание олимпиадной математики/физики младшим школьникам усиливает лидерский блок заявки.'
      }
    ]
  }
];

export const STAGE_OPTIONS = [
  { id: 'school_junior', label: '8–10 класс (14–16 лет)', description: 'Время пробовать разные форматы и собирать первые проекты' },
  { id: 'school_senior', label: '11 класс / выпускник (17–18 лет)', description: 'Финальная сборка портфолио, дедлайны вузов и олимпиады' },
  { id: 'undergrad', label: 'Студент бакалавриата (18–22 года)', description: 'Стажировки, хакатоны, исследования и подготовка к магистратуре' },
  { id: 'grad', label: 'Выпускник вуза / специалист (22+)', description: 'Магистратура, PhD, гранты DAAD / Chevening / Fulbright / Erasmus' }
];

export const GOAL_OPTIONS = [
  { id: 'projects', label: 'Собрать сильные проекты и MVP', description: 'Хакатоны, Game Jams, реальные продукты и кейсы для портфолио' },
  { id: 'academic', label: 'Повысить академический вес', description: 'Олимпиады, научные исследования, конференции и конкурсы' },
  { id: 'leadership', label: 'Показать лидерство и вклад в общество', description: 'Волонтёрство, форумы, организация мероприятий и НКО' },
  { id: 'career', label: 'Получить практику и стажировку', description: 'Стажировки в компаниях, tech-ивенты и профессиональный нетворкинг' },
  { id: 'funding', label: 'Найти гранты и стипендии', description: 'Стипендиальные программы, олимпиады с квотами и гранты на обучение' }
];

export const FORMAT_OPTIONS = [
  { id: 'Любой', label: 'Любой формат' },
  { id: 'Онлайн', label: 'Онлайн (из любой страны)' },
  { id: 'Очно', label: 'Очно (кампусы и форумы)' },
  { id: 'Гибрид', label: 'Гибрид' }
];

export const SCHOLARSHIPS = [
  {
    id: 'eduusa-opp',
    name: 'EducationUSA Opportunity Funds & Need-Based Aid',
    countryId: 'usa',
    regionLabel: 'США',
    level: 'Бакалавриат',
    coverage: 'Opportunity Funds: расходы на тесты (SAT/TOEFL), заявки и перелёт. Вузы США: до 100% стоимости обучения (Need-Based Aid).',
    deadlineWindow: 'Opportunity Funds: весна–лето; подача в вузы: ноябрь–январь',
    cisNote: 'Действует через локальные офисы EducationUSA в странах СНГ для талантливых абитуриентов с высокой финансовой потребностью.',
    link: 'https://educationusa.state.gov'
  },
  {
    id: 'fulbright',
    name: 'Fulbright Foreign Student Program',
    countryId: 'usa',
    regionLabel: 'США',
    level: 'Магистратура / Исследования',
    coverage: 'Полное покрытие обучения, ежемесячная стипендия, страховка, перелёт и бюджет на учебники.',
    deadlineWindow: 'Февраль – октябрь (зависит от страны СНГ)',
    cisNote: 'Администрируется посольствами США в странах СНГ; нужен диплом бакалавра и уверенный английский.',
    link: 'https://foreign.fulbrightonline.org'
  },
  {
    id: 'chevening',
    name: 'Chevening Scholarships',
    countryId: 'uk',
    regionLabel: 'Великобритания',
    level: 'Магистратура',
    coverage: '100% оплаты обучения в любом вузе Великобритании, ежемесячная стипендия, перелёт и визовые сборы.',
    deadlineWindow: 'Август – ноябрь каждого года',
    cisNote: 'Требуется от 2 лет опыта работы (включая стажировки и волонтёрство) и чёткий карьерный план.',
    link: 'https://www.chevening.org'
  },
  {
    id: 'uk-merit',
    name: 'Reach Oxford / Gates Cambridge / University Merit',
    countryId: 'uk',
    regionLabel: 'Великобритания',
    level: 'Бакалавриат и магистратура',
    coverage: 'Полное или частичное покрытие обучения; для Reach Oxford также проживание и перелёт.',
    deadlineWindow: 'Октябрь (UCAS Oxbridge) – февраль',
    cisNote: 'Высокая конкуренция: критичны олимпиады, supercurricular-достижения и вступительные тесты.',
    link: 'https://www.ox.ac.uk/admissions/undergraduate/fees-and-funding/oxford-support/reach-oxford-scholarship'
  },
  {
    id: 'daad',
    name: 'DAAD Study Scholarships & EPOS',
    countryId: 'europe',
    regionLabel: 'Германия / ЕС',
    level: 'Магистратура / Исследования',
    coverage: 'Ежемесячная стипендия около €992+, медицинская страховка и транспортный грант; обучение в госвузах Германии преимущественно бесплатное.',
    deadlineWindow: 'Август – ноябрь',
    cisNote: 'Открыто для всех стран СНГ на программах на английском и немецком языках.',
    link: 'https://www.daad.de/en/'
  },
  {
    id: 'hungaricum',
    name: 'Stipendium Hungaricum',
    countryId: 'europe',
    regionLabel: 'Венгрия / ЕС',
    level: 'Бакалавриат и магистратура',
    coverage: 'Бесплатное обучение на английском, общежитие или компенсация жилья, ежемесячная стипендия и медстраховка.',
    deadlineWindow: 'Ноябрь – 15 января',
    cisNote: 'Одна из самых доступных полных стипендий для СНГ благодаря двусторонним квотам с Казахстаном, Узбекистаном, Азербайджаном, Кыргызстаном и др.',
    link: 'https://stipendiumhungaricum.hu'
  },
  {
    id: 'erasmus',
    name: 'Erasmus Mundus Joint Masters (EMJM)',
    countryId: 'europe',
    regionLabel: 'Европа (2–3 страны)',
    level: 'Магистратура',
    coverage: '100% оплаты обучения, визы, переезды между странами и стипендия от €1,400/мес.',
    deadlineWindow: 'Октябрь – январь',
    cisNote: 'Граждане стран СНГ подаются напрямую в консорциум выбранной программы без обязательной квоты министерства.',
    link: 'https://www.eacea.ec.europa.eu/scholarships/erasmus-mundus-catalogue_en'
  },
  {
    id: 'kaist',
    name: 'KAIST International Undergraduate Scholarship',
    countryId: 'asia',
    regionLabel: 'Южная Корея',
    level: 'Бакалавриат',
    coverage: 'Полная оплата обучения на 8 семестров, ежемесячная стипендия (~350,000 KRW) и медстраховка.',
    deadlineWindow: 'Осень – январь (Early / Regular треки)',
    cisNote: 'Стипендия привязана к самому факту зачисления; особенно ценятся SAT, олимпиады, хакатоны и STEM-исследования.',
    link: 'https://admission.kaist.ac.kr/intl-undergraduate'
  },
  {
    id: 'gks',
    name: 'Global Korea Scholarship (GKS)',
    countryId: 'asia',
    regionLabel: 'Южная Корея',
    level: 'Бакалавриат и магистратура',
    coverage: 'Полное обучение, 1 год корейского языка, авиабилеты, ежемесячное пособие и медстраховка.',
    deadlineWindow: 'Бакалавриат: сентябрь–октябрь; магистратура: февраль–март',
    cisNote: 'Есть посольский трек (Embassy Track) и университетский трек.',
    link: 'https://www.studyinkorea.go.kr'
  },
  {
    id: 'mext',
    name: 'MEXT (Monbukagakusho)',
    countryId: 'asia',
    regionLabel: 'Япония',
    level: 'Бакалавриат и магистратура',
    coverage: '100% обучения, ежемесячная стипендия (от ~117,000 JPY) и перелёт туда-обратно.',
    deadlineWindow: 'Апрель – май (посольский отбор)',
    cisNote: 'Подача через посольство Японии в вашей стране СНГ; включает языковой отбор или экзамены по математике/наукам.',
    link: 'https://www.studyinjapan.go.jp'
  },
  {
    id: 'turkiye',
    name: 'Türkiye Bursları',
    countryId: 'asia',
    regionLabel: 'Турция',
    level: 'Бакалавриат и магистратура',
    coverage: 'Бесплатное обучение, общежитие, стипендия, курс турецкого языка, медстраховка и авиабилет.',
    deadlineWindow: '10 января – 20 февраля',
    cisNote: 'Принимают аттестаты/дипломы с высоким баллом (обычно от 70%+, для медицины 90%+); важный плюс — волонтёрство и олимпиады.',
    link: 'https://www.turkiyeburslari.gov.tr'
  },
  {
    id: 'canada-awards',
    name: 'Lester B. Pearson (UofT) & UBC IMES',
    countryId: 'canada',
    regionLabel: 'Канада',
    level: 'Бакалавриат',
    coverage: 'Lester B. Pearson покрывает 4 года обучения, книги, проживание и сборы в University of Toronto.',
    deadlineWindow: 'Номинация школой осенью, подача до января',
    cisNote: 'Требуется выдающееся лидерство и номинация от вашей школы.',
    link: 'https://future.utoronto.ca/pearson'
  },
  {
    id: 'cis-grants',
    name: 'Гранты Назарбаев Университета, Иннополис, Болашак и Эл-юрт умиди',
    countryId: 'cis',
    regionLabel: 'СНГ',
    level: 'Бакалавриат и магистратура',
    coverage: 'Полное обучение и стипендии в ведущих вузах региона или государственные программы обучения за рубежом.',
    deadlineWindow: 'Осень – весна (зависит от университета и госпрограммы)',
    cisNote: 'Олимпиады, хакатоны и высокий IELTS/SAT значительно повышают шанс получения 100% гранта.',
    link: 'https://nu.edu.kz'
  }
];

export function getCountryById(id) {
  return COUNTRIES.find(c => c.id === id) || COUNTRIES[0];
}

export function getMajorById(id) {
  return MAJORS.find(m => m.id === id) || MAJORS[0];
}

function parseAgeRange(ageText) {
  const numbers = String(ageText || '').match(/\d{1,2}/g)?.map(Number) || [];
  if (numbers.length === 0) return null;
  if (numbers.length === 1) return { min: numbers[0], max: numbers[0] + 10 };
  return { min: Math.min(numbers[0], numbers[1]), max: Math.max(numbers[0], numbers[1]) };
}

function stageAgeBounds(stageId) {
  switch (stageId) {
    case 'school_junior':
      return { min: 14, max: 16 };
    case 'school_senior':
      return { min: 17, max: 18 };
    case 'undergrad':
      return { min: 18, max: 22 };
    case 'grad':
      return { min: 22, max: 35 };
    default:
      return null;
  }
}

function goalPreferredCategories(goalId) {
  switch (goalId) {
    case 'projects':
      return ['Хакатон', 'Game Jam', 'Tech-ивент', 'Конкурс'];
    case 'academic':
      return ['Олимпиада', 'Исследование', 'Конференция', 'Курс'];
    case 'leadership':
      return ['Волонтерство', 'Форум', 'Конференция'];
    case 'career':
      return ['Стажировка', 'Tech-ивент', 'Хакатон'];
    case 'funding':
      return ['Грант / стипендия', 'Олимпиада', 'Конкурс'];
    default:
      return [];
  }
}

export function matchActivitiesToProfile(activities = [], profile) {
  if (!profile) return [];

  const major = getMajorById(profile.major);
  const country = getCountryById(profile.country);
  const stageBounds = stageAgeBounds(profile.stage);
  const goalCategories = goalPreferredCategories(profile.goal);

  const scored = activities
    .filter(item => item && item.active !== false)
    .map(activity => {
      let score = 0;
      const reasons = [];
      const haystack = `${activity.title || ''} ${activity.description || ''} ${activity.category || ''} ${activity.location || ''}`.toLowerCase();

      // 1. Major preferred category match
      const catIndex = major.preferredCategories.indexOf(activity.category);
      if (catIndex !== -1) {
        score += 38 - catIndex * 4;
        reasons.push(`Формат «${activity.category}» рекомендован для ${major.shortName}`);
      }

      // 2. Keyword match against major domain
      const matchedKeywords = major.keywords.filter(kw => haystack.includes(kw));
      if (matchedKeywords.length > 0) {
        score += Math.min(30, matchedKeywords.length * 10);
        reasons.push(`Тематика совпадает с ${major.shortName}`);
      }

      // 3. Goal alignment
      if (goalCategories.includes(activity.category)) {
        score += 18;
        const goalObj = GOAL_OPTIONS.find(g => g.id === profile.goal);
        if (goalObj) reasons.push(`Работает на цель: ${goalObj.label.toLowerCase()}`);
      }

      // 4. Country admissions philosophy boost
      if (country.id === 'uk' && ['Олимпиада', 'Исследование', 'Конференция'].includes(activity.category)) {
        score += 12;
        reasons.push('Ценится как Supercurricular в Великобритании');
      } else if (country.id === 'usa' && ['Хакатон', 'Game Jam', 'Волонтерство', 'Исследование', 'Tech-ивент'].includes(activity.category)) {
        score += 12;
        reasons.push('Усиливает «Spike» и портфолио для США');
      } else if (country.id === 'asia' && ['Олимпиада', 'Хакатон', 'Исследование', 'Грант / стипендия'].includes(activity.category)) {
        score += 10;
        reasons.push(`Релевантно для ${country.shortName}`);
      }

      // 5. Format compatibility
      if (profile.format && profile.format !== 'Любой') {
        const fmt = (activity.format || '').toLowerCase();
        if (fmt.includes(profile.format.toLowerCase()) || fmt.includes('онлайн / очно') || fmt.includes('гибрид')) {
          score += 10;
          reasons.push(`Подходит формат (${activity.format})`);
        } else if (fmt) {
          score -= 10;
        }
      }

      // 6. Age compatibility
      const actAge = parseAgeRange(activity.age);
      if (stageBounds && actAge) {
        const overlaps = actAge.min <= stageBounds.max && actAge.max >= stageBounds.min;
        if (overlaps) {
          score += 8;
        } else {
          score -= 22;
        }
      }

      return {
        activity,
        score,
        reasons: [...new Set(reasons)].slice(0, 3)
      };
    })
    .filter(entry => entry.score >= 15)
    .sort((a, b) => b.score - a.score);

  return scored;
}

export function buildRecommendationPlan(profile) {
  const country = getCountryById(profile?.country);
  const major = getMajorById(profile?.major);
  const stage = STAGE_OPTIONS.find(s => s.id === profile?.stage) || STAGE_OPTIONS[1];
  const goal = GOAL_OPTIONS.find(g => g.id === profile?.goal) || GOAL_OPTIONS[0];
  const relevantScholarships = SCHOLARSHIPS.filter(s => s.countryId === country.id);

  const blueprints = major.blueprints.map(bp => ({
    ...bp,
    countryTip: bp.countryNuance?.[country.id] || ''
  }));

  const checklist = [
    ...country.checklist,
    `Закрыть минимум 1–2 ключевых формата под ${major.shortName}: ${blueprints.slice(0, 2).map(b => b.category).join(', ')}`
  ];

  return {
    country,
    major,
    stage,
    goal,
    blueprints,
    relevantScholarships,
    checklist
  };
}
