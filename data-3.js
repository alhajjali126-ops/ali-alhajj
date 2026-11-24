/* المرحلة 5 + قائمة مهام مشروع التخرج */
window.PHASES.push({
  id: 'phase5', num: 5, icon: '', short: 'أدوات الفريق',
  title: 'أدوات الفريق وسوق العمل',
  desc: 'Git و GitHub لمشروع التخرج، ومقدمة في Docker.',
  topics: [
    {
      id: 'p5t1', title: 'Git: التحكم بالإصدارات',
      explain: `**Git** يسجّل تاريخ مشروعك: كل **Commit** لقطة يمكنك الرجوع إليها. يحميك من ضياع الكود ويسمح لعدة أشخاص بالعمل معاً.

الدورة الأساسية: عدّل ملفات ← [[git add]] (جهّزها) ← [[git commit]] (احفظ اللقطة).

ملف [[.gitignore]] يمنع رفع ملفات مثل [[.env]] و[[vendor/]] و[[node_modules/]].`,
      lang: 'bash',
      code: r`git config --global user.name  "Ali Al-Hajj"
git config --global user.email "ali@mail.com"

git init
printf ".env\nvendor/\nnode_modules/\n" > .gitignore

git status
git add .
git commit -m "feat: initial Laravel project"
git log --oneline`,
      task: `أنشئ مستودعاً محلياً، أضف 3 commits بمعانٍ واضحة، ثم اعرض السجل بـ [[git log --oneline]].`,
      answer: `رسالة Commit الجيدة تصف **ماذا تغيّر**، مثل [[feat: add student migration]] وليس [[update]].`
    },
    {
      id: 'p5t2', title: 'GitHub والفروع (Branches)',
      explain: `**GitHub** يستضيف مستودعك على الإنترنت ليتشارك الفريق. أما **الفرع (Branch)** فنسخة موازية تعمل عليها دون إفساد الفرع الرئيسي [[main]].

قاعدة ذهبية: لا أحد يكتب مباشرة على [[main]]. كل ميزة في فرع مستقل، ثم تُدمج عبر **Pull Request (PR)** بعد مراجعة زميل.`,
      lang: 'bash',
      code: r`git remote add origin https://github.com/USERNAME/graduation-api.git
git push -u origin main

git switch -c feature/student-api     # فرع جديد لميزتك
# ... اعمل وcommit ...
git push -u origin feature/student-api
# ثم افتح Pull Request من موقع GitHub

git switch main && git pull           # حدّث نسختك بعد الدمج`,
      task: `أنشئ مستودعاً على GitHub، وارفع فرعاً [[feature/test]]، وافتح Pull Request منه إلى [[main]].`,
      answer: `سترى زر «Compare & pull request» بعد رفع الفرع؛ ادمجه بعد المراجعة ثم احذف الفرع.`
    },
    {
      id: 'p5t3', title: 'العمل الجماعي وحل التعارضات (Conflicts)',
      explain: `التعارض يحدث عندما يعدّل شخصان **نفس السطر**. Git لا يعرف أيهما يختار، فيطلب منك الحل يدوياً.

للتقليل منها: اسحب آخر تحديثات [[main]] بشكل متكرر، واجعل الفروع قصيرة العمر، ووزّع الملفات بين الأعضاء قدر الإمكان.`,
      lang: 'bash',
      code: r`git switch feature/student-api
git pull origin main            # قد يظهر تعارض

# Git يضع علامات داخل الملف:
<<<<<<< HEAD
$table->string('name');
=======
$table->string('full_name');
>>>>>>> main

# 1) احذف العلامات واترك النسخة الصحيحة
# 2) ثم:
git add .
git commit -m "fix: resolve merge conflict in students migration"`,
      task: `مع زميل: عدّلا نفس السطر في فرعين مختلفين، وادمجاهما، ثم حلّا التعارض.`,
      answer: `بعد حل التعارض تُنفَّذ [[git add]] ثم [[git commit]] لإتمام الدمج.`
    },
    {
      id: 'p5t4', title: 'مقدمة في Docker',
      explain: `المشكلة المشهورة: «يعمل على جهازي فقط!». **Docker** يغلّف تطبيقك مع كل ما يحتاجه (PHP والإضافات) داخل **حاوية (Container)** تعمل بنفس الطريقة على أي جهاز.

**Image** هي الوصفة (القالب)، و**Container** هي النسخة التي تعمل منها.`,
      lang: 'bash',
      code: r`docker --version
docker run hello-world

# شغّل MySQL بأمر واحد دون تثبيته على جهازك
docker run -d --name mysql-dev -p 3306:3306 \
  -e MYSQL_ROOT_PASSWORD=secret -e MYSQL_DATABASE=graduation mysql:8

docker ps            # الحاويات العاملة
docker stop mysql-dev`,
      task: `شغّل حاوية MySQL كما في المثال واتصل بها من مشروع Laravel عبر [[.env]].`,
      answer: `اجعل [[DB_HOST=127.0.0.1]] و[[DB_PASSWORD=secret]] و[[DB_DATABASE=graduation]].`
    },
    {
      id: 'p5t5', title: 'Dockerfile و docker-compose (تعريف عام)',
      explain: `**Dockerfile** يصف كيف تبني صورة تطبيقك. و**docker-compose** يشغّل عدة خدمات معاً (التطبيق + القاعدة) بأمر واحد: [[docker compose up -d]].

هذا مثال مبسّط للفهم؛ فالإعداد الكامل لـ Laravel أكثر تفصيلاً (يمكنك لاحقاً استخدام Laravel Sail الجاهز).`,
      lang: 'yaml',
      code: r`# docker-compose.yml
services:
  app:
    image: php:8.3-apache
    ports:
      - "8080:80"
    volumes:
      - ./:/var/www/html
    depends_on:
      - db

  db:
    image: mysql:8
    environment:
      MYSQL_ROOT_PASSWORD: secret
      MYSQL_DATABASE: graduation
    volumes:
      - dbdata:/var/lib/mysql

volumes:
  dbdata:

# docker compose up -d
# docker compose down`,
      task: `لماذا نضع [[volumes]] مع قاعدة البيانات؟`,
      answer: `لتبقى البيانات محفوظة حتى لو حُذفت الحاوية، فالحاوية بحد ذاتها مؤقتة.`
    }
  ]
});

window.PROJECT = [
  {
    id: 'g1', icon: '', title: 'تصميم قاعدة البيانات',
    sub: 'الأساس الذي يبني عليه كل الفريق؛ أخطاؤه مكلفة لاحقاً.',
    items: [
      { id: 'g1a', text: 'تحديد الكيانات (Entities) والمتطلبات مع الفريق والمشرف' },
      { id: 'g1b', text: 'رسم مخطط ERD وتحديد العلاقات (1:N / N:M)', hint: 'مثلاً على draw.io أو dbdiagram.io' },
      { id: 'g1c', text: 'مراجعة التطبيع حتى الشكل الثالث (3NF)' },
      { id: 'g1d', text: 'كتابة الـ Migrations والموديلات مع المفاتيح الأجنبية' },
      { id: 'g1e', text: 'إنشاء Seeders و Factories ببيانات تجريبية', hint: 'php artisan make:seeder' },
      { id: 'g1f', text: 'اعتماد التصميم من كل أعضاء الفريق قبل البدء بالـ API' }
    ]
  },
  {
    id: 'g2', icon: '', title: 'تنظيم العمل على GitHub',
    sub: 'تقسيم المهام ومنع تضارب عمل الأعضاء.',
    items: [
      { id: 'g2a', text: 'إنشاء المستودع وإضافة README ووصف المشروع' },
      { id: 'g2b', text: 'إضافة .gitignore و .env.example (دون أسرار)', hint: 'لا يُرفع ملف .env أبداً' },
      { id: 'g2c', text: 'دعوة أعضاء الفريق والمشرف كمتعاونين (Collaborators)' },
      { id: 'g2d', text: 'حماية فرع main: منع الكتابة المباشرة واشتراط Pull Request' },
      { id: 'g2e', text: 'اعتماد تسمية الفروع: feature/… و fix/…' },
      { id: 'g2f', text: 'إنشاء Issues لكل مهمة ولوحة مهام (Projects Board)', hint: 'To Do / In Progress / Done' },
      { id: 'g2g', text: 'توزيع المهام على الأعضاء وربط كل PR بـ Issue' },
      { id: 'g2h', text: 'الاتفاق على مراجعة (Code Review) من زميل قبل كل دمج' }
    ]
  },
  {
    id: 'g3', icon: '', title: 'بناء الـ API',
    sub: 'قلب الـ Backend في مشروعك.',
    items: [
      { id: 'g3a', text: 'تثبيت Laravel وربط قاعدة البيانات وتجربة الاتصال' },
      { id: 'g3b', text: 'تعريف المسارات في routes/api.php بإصدار /api/v1' },
      { id: 'g3c', text: 'كتابة Controllers مع التحقق (Form Requests)' },
      { id: 'g3d', text: 'إضافة API Resources لتنسيق الـ JSON' },
      { id: 'g3e', text: 'المصادقة بـ Sanctum وحماية المسارات (Login / Logout / Me)' },
      { id: 'g3f', text: 'الصلاحيات والأدوار (Admin / User) عبر Policies أو Gates' },
      { id: 'g3g', text: 'التصفح الصفحي (Pagination) والبحث والفلترة' },
      { id: 'g3h', text: 'توحيد شكل الأخطاء ورموز الحالة (401 / 403 / 404 / 422)' },
      { id: 'g3i', text: 'اختبار كل المسارات في Postman وحفظ الـ Collection في المستودع' },
      { id: 'g3j', text: 'كتابة اختبارات Feature أساسية', hint: 'php artisan test' }
    ]
  },
  {
    id: 'g4', icon: '', title: 'التوثيق والتسليم',
    sub: 'ما يراه لجنة المناقشة أولاً.',
    items: [
      { id: 'g4a', text: 'توثيق الـ API (قائمة المسارات وأمثلة الطلبات)' },
      { id: 'g4b', text: 'كتابة شرح تشغيل المشروع في README خطوة بخطوة' },
      { id: 'g4c', text: 'مراجعة أمنية: لا أسرار في الكود، التحقق من المدخلات، كلمات المرور مشفّرة' },
      { id: 'g4d', text: 'رفع المشروع على استضافة تجريبية أو تشغيله بـ Docker' },
      { id: 'g4e', text: 'تحضير العرض التقديمي وتجربة عرض حي (Demo)' }
    ]
  }
];
