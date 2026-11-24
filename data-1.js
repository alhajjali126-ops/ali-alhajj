/* المرحلتان 1 و 2 — String.raw للحفاظ على الشرطات المائلة في الكود */
const r = String.raw;
window.PHASES = [
{
  id: 'phase1', num: 1, icon: '', short: 'كيف يعمل الويب',
  title: 'كيف يعمل الويب',
  desc: 'السيرفر، قاعدة البيانات، DNS، الدومين، وطلب/استجابة HTTP.',
  topics: [
    {
      id: 'p1t1', title: 'السيرفر (Server) ونموذج Client-Server',
      explain: `السيرفر هو **حاسوب يعمل على مدار الساعة** وينتظر طلبات الناس. المتصفح (أو تطبيق الجوال) هو **العميل (Client)**: يرسل طلباً، والسيرفر يرد.

الـ **Backend** هو الكود الذي يعمل على السيرفر: يستقبل الطلب، يقرأ من قاعدة البيانات، ويرجّع النتيجة. أما ما تراه في المتصفح فهو الـ Frontend.

مثال من الحياة: أنت الزبون، النادل هو الـ Backend، والمطبخ هو قاعدة البيانات.`,
      lang: 'bash + php',
      code: r`# 1) أنشئ ملف index.php فيه:
<?php
echo "Hello from the server! الوقت: " . date('H:i:s');

# 2) شغّل سيرفر PHP المدمج داخل نفس المجلد:
php -S localhost:8000

# 3) افتح المتصفح على:  http://localhost:8000`,
      task: `شغّل السيرفر المحلي وافتح الصفحة، ثم حدّثها (Refresh) عدة مرات. ماذا يحدث للوقت؟ ولماذا؟`,
      answer: `الوقت يتغيّر مع كل تحديث لأن السيرفر **ينفّذ كود PHP من جديد عند كل طلب** ويرسل نتيجة جديدة.`
    },
    {
      id: 'p1t2', title: 'DNS: دفتر هاتف الإنترنت',
      explain: `الحواسيب تتعامل مع **عناوين IP** (مثل 142.250.74.14) وليس مع الأسماء. الـ **DNS** هو النظام الذي يحوّل اسم الموقع إلى عنوان IP.

الخطوات: المتصفح يسأل الـ DNS «ما عنوان google.com؟» ← يأتي الجواب IP ← المتصفح يتصل بالسيرفر مباشرة بالـ IP.`,
      lang: 'bash',
      code: r`# اعرف عنوان IP لأي موقع (Windows / Linux / Mac)
nslookup google.com

# على Linux/Mac يعطي تفاصيل أكثر:
dig google.com +short`,
      task: `نفّذ [[nslookup]] على موقعين مختلفين. هل يعيد كل موقع عنوان IP واحد فقط أم أكثر؟`,
      answer: `غالباً يعيد المواقع الكبيرة **عدة عناوين IP** لتوزيع الضغط (Load Balancing).`
    },
    {
      id: 'p1t3', title: 'الدومين (Domain) والاستضافة (Hosting)',
      explain: `**الدومين** هو اسم الموقع الذي تشتريه سنوياً. يتكوّن من أجزاء، نقرأها من اليمين: [[com]] هو الامتداد (TLD)، [[example]] هو الاسم، وما قبله **نطاقات فرعية (Subdomains)**.

**الاستضافة** هي المكان (السيرفر) الذي تضع عليه ملفات موقعك. وسجل **A Record** في إعدادات الدومين هو الذي يربط الاسم بعنوان IP سيرفرك.

أنواع الاستضافة: مشتركة (رخيصة)، VPS (سيرفر افتراضي لك)، وسحابية (Cloud) مثل AWS و DigitalOcean.`,
      lang: 'text',
      code: r`api.shop.example.com
 │   │     │      └── TLD (الامتداد)
 │   │     └───────── الاسم الأساسي (Domain)
 │   └─────────────── subdomain
 └─────────────────── subdomain

سجل DNS:
Type  Name  Value
A     @     203.0.113.10     ← يربط example.com بسيرفرك
A     api   203.0.113.10     ← يربط api.example.com`,
      task: `حلّل العنوان [[blog.my-app.dev]] إلى أجزائه: الامتداد، الاسم، والنطاق الفرعي.`,
      answer: `الامتداد [[dev]]، الاسم [[my-app]]، والنطاق الفرعي [[blog]].`
    },
    {
      id: 'p1t4', title: 'طلب واستجابة HTTP (Request / Response)',
      explain: `HTTP هو **لغة الكلام** بين المتصفح والسيرفر. كل طلب فيه: **الطريقة (Method)** مثل GET لجلب بيانات و POST لإرسال بيانات، و**المسار (Path)**، و**الترويسات (Headers)**، وأحياناً **جسم (Body)**.

السيرفر يرد برمز حالة **Status Code**: [[200]] نجاح، [[201]] تم الإنشاء، [[404]] غير موجود، [[422]] بيانات خاطئة، [[500]] خطأ في السيرفر.`,
      lang: 'http',
      code: r`GET /students/5 HTTP/1.1
Host: example.com
Accept: application/json

--------- الرد ---------
HTTP/1.1 200 OK
Content-Type: application/json

{"id": 5, "name": "Ali"}

# جرّبها فعلياً من الطرفية:
curl -i https://example.com`,
      task: `نفّذ [[curl -i https://example.com]] وحدّد: رمز الحالة، ونوع المحتوى (Content-Type).`,
      answer: `رمز الحالة [[200 OK]] ونوع المحتوى [[text/html]].`
    },
    {
      id: 'p1t5', title: 'مكان قاعدة البيانات في الصورة الكاملة',
      explain: `التطبيق الحقيقي له **3 طبقات**: المتصفح (العرض)، ثم السيرفر الذي يشغّل PHP/Laravel (المنطق)، ثم قاعدة البيانات (التخزين) مثل MySQL.

المتصفح **لا يتصل بقاعدة البيانات أبداً**. السيرفر وحده يتكلم معها بلغة SQL، وهذا يحمي بياناتك.`,
      lang: 'text',
      code: r`المتصفح ──HTTP──▶ سيرفر (PHP/Laravel) ──SQL──▶ MySQL
   ▲                          │                      │
   └────── HTML / JSON ◀──────┴──────── صفوف ◀───────┘`,
      task: `اكتب على ورقة 6 خطوات تصف ما يحدث عندما تفتح صفحة «قائمة المنتجات» في متجر إلكتروني.`,
      answer: `المتصفح يحوّل الدومين عبر DNS ← يرسل GET للسيرفر ← PHP يستقبل الطلب ← يرسل SELECT لقاعدة البيانات ← تعود الصفوف ← السيرفر يرجّع HTML أو JSON.`
    }
  ]
},
{
  id: 'phase2', num: 2, icon: '', short: 'قواعد البيانات',
  title: 'قواعد البيانات (SQL)',
  desc: 'الجداول، العلاقات، والاستعلامات من الصفر.',
  topics: [
    {
      id: 'p2t1', title: 'الجداول وأنواع البيانات',
      explain: `قاعدة البيانات العلائقية تخزّن البيانات في **جداول**؛ كل جدول له **أعمدة** (الحقول) و**صفوف** (السجلات). لكل جدول **مفتاح أساسي (Primary Key)** يميّز كل صف.

أنواع شائعة: [[INT]] أرقام، [[VARCHAR(100)]] نص قصير، [[TEXT]] نص طويل، [[DATE]] / [[TIMESTAMP]] وقت، [[BOOLEAN]] صح/خطأ.`,
      lang: 'sql',
      code: r`CREATE DATABASE university CHARACTER SET utf8mb4;
USE university;

CREATE TABLE students (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(150) NOT NULL UNIQUE,
  year_level TINYINT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`,
      task: `أنشئ جدول [[courses]] فيه: id، title (نص، إجباري)، hours (رقم).`,
      answer: `[[CREATE TABLE courses (id INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(120) NOT NULL, hours INT);]]`
    },
    {
      id: 'p2t2', title: 'عمليات CRUD: إضافة، قراءة، تعديل، حذف',
      explain: `أربع عمليات تبني عليها كل التطبيقات: **INSERT** إضافة، **SELECT** قراءة، **UPDATE** تعديل، **DELETE** حذف.

تنبيه مهم: لا تنفّذ [[UPDATE]] أو [[DELETE]] **بدون WHERE** وإلا ستعدّل أو تحذف كل الصفوف!`,
      lang: 'sql',
      code: r`INSERT INTO students (name, email) VALUES ('Ali', 'ali@mail.com');

SELECT id, name FROM students WHERE year_level = 2 ORDER BY name LIMIT 10;

UPDATE students SET year_level = 3 WHERE id = 1;

DELETE FROM students WHERE id = 1;`,
      task: `أضف 3 طلاب، ثم اعرض فقط من اسمه يبدأ بحرف A، ثم عدّل سنة أحدهم.`,
      answer: `للبحث بالحرف: [[SELECT * FROM students WHERE name LIKE 'A%';]]`
    },
    {
      id: 'p2t3', title: 'العلاقات: واحد لمتعدد، ومتعدد لمتعدد',
      explain: `**واحد لمتعدد (1:N)**: قسم فيه عدة طلاب. نضع في جدول الطلاب عموداً [[department_id]] هو **مفتاح أجنبي (Foreign Key)** يشير إلى جدول الأقسام.

**متعدد لمتعدد (N:M)**: طالب يسجّل عدة مواد، والمادة فيها عدة طلاب. نحتاج **جدولاً وسيطاً** (Pivot) يحمل مفتاحي الطرفين.`,
      lang: 'sql',
      code: r`CREATE TABLE departments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

ALTER TABLE students
  ADD department_id INT,
  ADD FOREIGN KEY (department_id) REFERENCES departments(id);

-- N:M عبر جدول وسيط
CREATE TABLE enrollments (
  student_id INT,
  course_id  INT,
  grade      DECIMAL(5,2),
  PRIMARY KEY (student_id, course_id),
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id)  REFERENCES courses(id)  ON DELETE CASCADE
);`,
      task: `ما نوع العلاقة بين «المدرّس» و«المادة» إذا كان المدرّس يدرّس عدة مواد والمادة قد يدرّسها عدة مدرّسين؟ وماذا تحتاج؟`,
      answer: `علاقة **متعدد لمتعدد**، وتحتاج جدولاً وسيطاً مثل [[teacher_course]].`
    },
    {
      id: 'p2t4', title: 'الربط بين الجداول: JOIN',
      explain: `الـ **JOIN** يجمع بيانات من عدة جداول في نتيجة واحدة.

[[INNER JOIN]] يعيد الصفوف المتطابقة فقط. [[LEFT JOIN]] يعيد كل صفوف الجدول الأيسر حتى لو لم يكن لها مقابل (يظهر [[NULL]]).`,
      lang: 'sql',
      code: r`SELECT s.name AS student, c.title AS course, e.grade
FROM students s
INNER JOIN enrollments e ON e.student_id = s.id
INNER JOIN courses c     ON c.id = e.course_id
WHERE e.grade >= 60;

-- طلاب بدون أي تسجيل:
SELECT s.name
FROM students s
LEFT JOIN enrollments e ON e.student_id = s.id
WHERE e.student_id IS NULL;`,
      task: `اكتب استعلاماً يعرض اسم الطالب واسم قسمه.`,
      answer: `[[SELECT s.name, d.name FROM students s JOIN departments d ON d.id = s.department_id;]]`
    },
    {
      id: 'p2t5', title: 'التجميع: COUNT, AVG, GROUP BY',
      explain: `دوال التجميع تحسب على مجموعة صفوف: [[COUNT]] العدد، [[SUM]] المجموع، [[AVG]] المتوسط، [[MAX]] / [[MIN]].

[[GROUP BY]] يقسّم الصفوف إلى مجموعات، و[[HAVING]] يفلتر المجموعات (بينما [[WHERE]] يفلتر الصفوف قبل التجميع).`,
      lang: 'sql',
      code: r`SELECT c.title, COUNT(*) AS students, ROUND(AVG(e.grade),1) AS avg_grade
FROM enrollments e
JOIN courses c ON c.id = e.course_id
GROUP BY c.id, c.title
HAVING COUNT(*) >= 5
ORDER BY avg_grade DESC;`,
      task: `اعرض عدد الطلاب في كل قسم.`,
      answer: `[[SELECT department_id, COUNT(*) FROM students GROUP BY department_id;]]`
    },
    {
      id: 'p2t6', title: 'الفهارس (Index) والتطبيع (Normalization)',
      explain: `**الفهرس** مثل فهرس الكتاب: يسرّع البحث في عمود، لكنه يبطّئ الإضافة قليلاً؛ فاستخدمه للأعمدة التي تبحث بها كثيراً.

**التطبيع**: لا تكرّر نفس المعلومة في أكثر من مكان. بدل أن تكتب اسم القسم في كل صف طالب، ضعه في جدول أقسام واربطه بمفتاح أجنبي.

أمان: لا تدمج مدخلات المستخدم داخل نص SQL مباشرة (خطر **SQL Injection**)، بل استخدم **الاستعلامات المحضّرة**.`,
      lang: 'sql + php',
      code: r`CREATE INDEX idx_students_email ON students(email);

-- PHP: استعلام محضّر آمن بـ PDO
$stmt = $pdo->prepare('SELECT * FROM students WHERE email = :email');
$stmt->execute(['email' => $_POST['email']]);
$student = $stmt->fetch(PDO::FETCH_ASSOC);`,
      task: `جدول طلاب فيه عمود [[department_name]] مكرّر في كل صف. كيف تصلحه؟`,
      answer: `أنشئ جدول [[departments]] وضع في الطلاب [[department_id]] كمفتاح أجنبي.`
    }
  ]
},
];
