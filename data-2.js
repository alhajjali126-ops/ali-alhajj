/* المرحلتان 3 و 4 — يعتمد على الثابت r = String.raw المعرّف في data-1.js */
window.PHASES.push(
{
  id: 'phase3', num: 3, icon: '', short: 'PHP والهندسة',
  title: 'لغة PHP والهندسة البرمجية',
  desc: 'OOP، الفرق بين اللغة والإطار، مبادئ SOLID، وأنماط التصميم.',
  topics: [
    {
      id: 'p3t1', title: 'أساسيات PHP',
      explain: `PHP لغة تعمل على **السيرفر**. المتغيرات تبدأ بـ [[$]]، والمصفوفات تخزّن قوائم، والدوال تنظّم الكود. استخدم [[declare(strict_types=1)]] لتجبر PHP على احترام أنواع البيانات وتتجنب أخطاء خفية.`,
      lang: 'php',
      code: r`<?php
declare(strict_types=1);

$name   = "Ali";
$skills = ["PHP", "SQL", "Laravel"];
$user   = ['name' => $name, 'year' => 2];   // مصفوفة ترابطية

function greet(string $name): string {
    return "Hello, $name!";
}

echo greet($name) . "\n";
foreach ($skills as $i => $skill) {
    echo ($i + 1) . ". $skill\n";
}`,
      task: `اكتب دالة [[average(array $nums): float]] تعيد متوسط مصفوفة أرقام.`,
      answer: `[[return array_sum($nums) / count($nums);]] (انتبه لحالة المصفوفة الفارغة).`
    },
    {
      id: 'p3t2', title: 'البرمجة كائنية التوجّه (OOP)',
      explain: `الـ **Class** قالب، والـ **Object** نسخة منه. أربعة أعمدة:

**التغليف (Encapsulation)**: إخفاء البيانات بـ [[private]] وإتاحتها عبر دوال.

**الوراثة (Inheritance)**: صنف يرث من آخر بـ [[extends]].

**الواجهة (Interface)**: عقد يحدد الدوال المطلوبة دون تنفيذها.

**تعدد الأشكال (Polymorphism)**: نتعامل مع كائنات مختلفة بنفس الواجهة.`,
      lang: 'php',
      code: r`<?php
interface Payable {
    public function pay(float $amount): string;
}

class User {
    public function __construct(
        protected string $name,
        private string $email
    ) {}
    public function getName(): string { return $this->name; }
}

class Student extends User implements Payable {
    public function pay(float $amount): string {
        return "{$this->name} paid $amount";
    }
}

$s = new Student("Ali", "ali@mail.com");
echo $s->pay(150.0);`,
      task: `أنشئ صنف [[Teacher]] يرث [[User]] ويضيف خاصية [[subject]] ودالة [[introduce()]].`,
      answer: `يستخدم [[extends User]] ويستدعي [[parent::__construct()]] في الباني أو يمرّر الخصائص عبر باني الأب.`
    },
    {
      id: 'p3t3', title: 'اللغة مقابل الإطار (Language vs Framework)',
      explain: `**PHP لغة**: أدوات أساسية فقط (متغيرات، دوال، حلقات). تبني كل شيء بيدك.

**Laravel إطار (Framework)**: مجموعة جاهزة من الأدوات (توجيه، مصادقة، قاعدة بيانات) مكتوبة بلغة PHP وتفرض **بنية منظّمة**.

الفرق الجوهري: في **المكتبة** أنت من يستدعي كودها، وفي **الإطار** الإطار هو من يستدعي كودك (**Inversion of Control**). لذلك تحتاج أن تتقن PHP أولاً ثم Laravel.`,
      lang: 'php',
      code: r`// PHP خام: أنت تكتب التوجيه بنفسك
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
if ($path === '/students' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    // ... اتصل بقاعدة البيانات واطبع النتيجة
}

// Laravel: تصرّح فقط، والإطار ينفّذ
Route::get('/students', [StudentController::class, 'index']);`,
      task: `اذكر 3 أشياء يقدّمها Laravel جاهزة ولا تأتي مع PHP الخام.`,
      answer: `مثلاً: التوجيه (Routing)، ORM للتعامل مع القاعدة، المصادقة (Auth)، التحقق (Validation)، الـ Migrations.`
    },
    {
      id: 'p3t4', title: 'Composer و Namespaces و Autoload',
      explain: `**Composer** مدير حزم PHP: يثبّت المكتبات ويحدّثها. ملف [[composer.json]] يسجّل ما تحتاجه، ومجلد [[vendor/]] يحوي الحزم، والملف [[vendor/autoload.php]] يحمّل الأصناف تلقائياً.

**Namespace** يمنع تضارب أسماء الأصناف، وهو سبب العبارات مثل [[App\\Models\\User]] في Laravel.`,
      lang: 'bash + php',
      code: r`composer init
composer require nesbot/carbon

<?php
// index.php
require __DIR__ . '/vendor/autoload.php';

use Carbon\Carbon;

echo Carbon::now()->addDays(3)->format('Y-m-d');

// composer.json  (تحميل أصنافك تلقائياً PSR-4)
"autoload": { "psr-4": { "App\\": "src/" } }`,
      task: `ثبّت مكتبة Carbon واطبع تاريخ نهاية الأسبوع القادم.`,
      answer: `مثلاً: [[Carbon::now()->next('Sunday')->format('Y-m-d')]]`
    },
    {
      id: 'p3t5', title: 'مبادئ SOLID',
      explain: `خمسة مبادئ لكتابة كود نظيف قابل للتطوير:

**S – المسؤولية الواحدة**: الصنف له سبب واحد للتغيير.

**O – مفتوح/مغلق**: نضيف سلوكاً جديداً دون تعديل الكود القديم.

**L – ليسكوف**: الصنف الابن يعمل أينما عمل الأب.

**I – فصل الواجهات**: واجهات صغيرة بدل واجهة ضخمة.

**D – عكس الاعتماد**: نعتمد على الواجهات وليس على الأصناف الملموسة.`,
      lang: 'php',
      code: r`<?php
// ينتهك S: صنف واحد يفعل كل شيء
class OrderService {
    function create() {} function sendEmail() {} function printPdf() {}
}

// S + D: نمرّر الاعتماد عبر واجهة
interface Notifier { public function send(string $msg): void; }

class OrderService {
    public function __construct(private Notifier $notifier) {}

    public function create(array $data): void {
        // حفظ الطلب
        $this->notifier->send("Order created");
    }
}
// يمكنك تمرير EmailNotifier أو SmsNotifier دون تعديل OrderService`,
      task: `لماذا يسهّل مبدأ D كتابة الاختبارات (Tests)؟`,
      answer: `لأنك تمرّر **كائناً وهمياً (Mock)** بدل الحقيقي، فتختبر الصنف دون إرسال بريد فعلي.`
    },
    {
      id: 'p3t6', title: 'نمط Factory (المصنع)',
      explain: `**المشكلة**: الكود مليء بـ [[new EmailNotification()]] و[[new SmsNotification()]] موزّعة في كل مكان.

**الحل**: صنف واحد (مصنع) مسؤول عن إنشاء الكائن المناسب حسب النوع. إذا أضفت نوعاً جديداً تعدّل المصنع فقط.`,
      lang: 'php',
      code: r`<?php
interface Notification { public function send(string $to, string $msg): void; }

class EmailNotification implements Notification {
    public function send(string $to, string $msg): void { echo "Email to $to: $msg\n"; }
}
class SmsNotification implements Notification {
    public function send(string $to, string $msg): void { echo "SMS to $to: $msg\n"; }
}

class NotificationFactory {
    public static function make(string $type): Notification {
        return match ($type) {
            'email' => new EmailNotification(),
            'sms'   => new SmsNotification(),
            default => throw new InvalidArgumentException("Unknown type: $type"),
        };
    }
}

NotificationFactory::make('sms')->send('0999', 'Hi');`,
      task: `أضف نوعاً ثالثاً [[push]] بدون لمس الكود الذي يستخدم المصنع.`,
      answer: `أنشئ [[PushNotification implements Notification]] وأضف سطراً [[ 'push' => ... ]] في [[match]] داخل المصنع فقط.`
    },
    {
      id: 'p3t7', title: 'نمط Strategy (الاستراتيجية)',
      explain: `نمط يسمح **بتبديل الخوارزمية أثناء التشغيل**. بدل سلسلة [[if/else]] طويلة لحساب الخصم، نعرّف لكل طريقة صنفاً مستقلاً بنفس الواجهة، ونحقن المناسب.`,
      lang: 'php',
      code: r`<?php
interface DiscountStrategy { public function apply(float $price): float; }

class NoDiscount implements DiscountStrategy {
    public function apply(float $price): float { return $price; }
}
class StudentDiscount implements DiscountStrategy {
    public function apply(float $price): float { return $price * 0.8; }
}

class Cart {
    public function __construct(private DiscountStrategy $strategy) {}
    public function total(float $price): float { return $this->strategy->apply($price); }
}

echo (new Cart(new StudentDiscount()))->total(100);  // 80`,
      task: `أضف استراتيجية [[BlackFriday]] بخصم 50%.`,
      answer: `صنف جديد يطبّق [[DiscountStrategy]] ويعيد [[$price * 0.5]].`
    },
    {
      id: 'p3t8', title: 'نمط Observer (المراقب)',
      explain: `عندما يحدث شيء في كائن (Subject) تُبلَّغ كائنات أخرى (Observers) تلقائياً. مثال: بعد تسجيل مستخدم جديد → إرسال بريد ترحيب + تسجيل Log.

هذا بالضبط ما تفعله **Events & Listeners** في Laravel.`,
      lang: 'php',
      code: r`<?php
interface Observer { public function update(string $event, array $data): void; }

class Subject {
    private array $observers = [];
    public function attach(Observer $o): void { $this->observers[] = $o; }
    public function notify(string $event, array $data): void {
        foreach ($this->observers as $o) { $o->update($event, $data); }
    }
}

class WelcomeMailer implements Observer {
    public function update(string $event, array $data): void {
        echo "Mail sent to {$data['email']}\n";
    }
}
class Logger implements Observer {
    public function update(string $event, array $data): void { echo "LOG: $event\n"; }
}

$users = new Subject();
$users->attach(new WelcomeMailer());
$users->attach(new Logger());
$users->notify('registered', ['email' => 'ali@mail.com']);`,
      task: `أضف مراقباً ثالثاً يعدّ عدد المسجّلين.`,
      answer: `صنف [[Counter implements Observer]] يزيد خاصية عدّاد داخل [[update()]].`
    }
  ]
},
{
  id: 'phase4', num: 4, icon: '', short: 'Laravel',
  title: 'إطار العمل Laravel',
  desc: 'MVC، التوجيه، Eloquent، المصادقة، وبناء الـ APIs.',
  topics: [
    {
      id: 'p4t1', title: 'نمط MVC',
      explain: `Laravel مبني على **MVC**:

**Model**: يمثّل جدولاً ويتعامل مع البيانات.

**View**: ما يراه المستخدم (قوالب Blade أو JSON في الـ API).

**Controller**: يستقبل الطلب، يطلب البيانات من Model، ويرسل الرد.

الفائدة: فصل المسؤوليات، فيسهل العمل الجماعي والصيانة.`,
      lang: 'text',
      code: r`Request ─▶ Route ─▶ Controller ─▶ Model ─▶ Database
                          │
                          ▼
Response ◀──────────── View / JSON

app/Models/Student.php                    ← Model
app/Http/Controllers/StudentController.php ← Controller
resources/views/students/index.blade.php   ← View`,
      task: `أين تضع كود «حساب معدل الطالب»: في الـ Controller أم Model؟ ولماذا؟`,
      answer: `الأفضل في **Model** (أو Service)، فالـ Controller دوره التنسيق فقط (Thin Controller).`
    },
    {
      id: 'p4t2', title: 'التثبيت وبنية المشروع',
      explain: `يلزمك PHP و Composer وقاعدة بيانات (MySQL). ثم تنشئ المشروع بأمر واحد.

أهم المجلدات: [[app/]] كودك، [[routes/]] المسارات، [[database/]] الـ migrations، [[resources/views/]] القوالب. وملف [[.env]] فيه إعدادات القاعدة والأسرار، **ولا يُرفع إلى GitHub أبداً**.`,
      lang: 'bash + .env',
      code: r`composer create-project laravel/laravel graduation-api
cd graduation-api
php artisan serve          # http://127.0.0.1:8000

# .env  (أنشئ القاعدة أولاً من MySQL)
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=graduation
DB_USERNAME=root
DB_PASSWORD=`,
      task: `أنشئ المشروع، شغّله، واربطه بقاعدة بيانات اسمها [[graduation]]، ثم نفّذ [[php artisan migrate]].`,
      answer: `نجاح الأمر يعني ظهور جداول [[users]] و[[migrations]] وغيرها في MySQL.`
    },
    {
      id: 'p4t3', title: 'التوجيه (Routing)',
      explain: `الملف [[routes/web.php]] لصفحات الويب، و[[routes/api.php]] للـ API (يضيف تلقائياً البادئة [[/api]]). كل مسار يربط **طريقة HTTP + عنوان** بدالة في Controller.

[[Route::resource]] ينشئ مسارات CRUD الخمسة دفعة واحدة.`,
      lang: 'php',
      code: r`<?php
use App\Http\Controllers\StudentController;
use Illuminate\Support\Facades\Route;

Route::get('/hello', fn () => 'Hello Laravel');

Route::get('/students/{id}', [StudentController::class, 'show'])->whereNumber('id');

Route::apiResource('courses', CourseController::class);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/students', [StudentController::class, 'store']);
});

// اعرض كل المسارات:  php artisan route:list`,
      task: `عرّف مسار [[GET /api/ping]] يعيد JSON فيه [[status: ok]].`,
      answer: `[[Route::get('/ping', fn () => response()->json(['status' => 'ok']));]] داخل [[routes/api.php]].`
    },
    {
      id: 'p4t4', title: 'Migrations و Models',
      explain: `الـ **Migration** كود PHP يصف بنية الجدول، فيتشاركه الفريق كله عبر Git بدل تبادل ملفات SQL. أمر واحد ينشئ الموديل والـ migration معاً.

في الموديل نحدد [[$fillable]]: الحقول المسموح تعبئتها جماعياً (حماية من Mass Assignment).`,
      lang: 'php',
      code: r`# php artisan make:model Student -m
# php artisan migrate

// database/migrations/xxxx_create_students_table.php
public function up(): void
{
    Schema::create('students', function (Blueprint $table) {
        $table->id();
        $table->string('name');
        $table->string('email')->unique();
        $table->foreignId('department_id')->constrained()->cascadeOnDelete();
        $table->timestamps();
    });
}

// app/Models/Student.php
class Student extends Model
{
    protected $fillable = ['name', 'email', 'department_id'];
}`,
      task: `أنشئ موديل [[Course]] مع migration فيه [[title]] و[[hours]]، ثم نفّذ الهجرة.`,
      answer: `[[php artisan make:model Course -m]] ثم عدّل [[up()]] وأضف الأعمدة ثم [[php artisan migrate]].`
    },
    {
      id: 'p4t5', title: 'Eloquent ORM والعلاقات',
      explain: `**Eloquent** يتيح لك التعامل مع الجداول ككائنات PHP بدل كتابة SQL يدوياً. العلاقات تُعرَّف كدوال: [[hasMany]] و[[belongsTo]] و[[belongsToMany]].

مشكلة **N+1**: جلب 100 طالب ثم استعلام لكل قسم = 101 استعلاماً. الحل [[with()]] (Eager Loading).`,
      lang: 'php',
      code: r`// Student.php
public function department() { return $this->belongsTo(Department::class); }
public function courses()    { return $this->belongsToMany(Course::class, 'enrollments')->withPivot('grade'); }

// Department.php
public function students()   { return $this->hasMany(Student::class); }

// الاستخدام
$s = Student::create(['name' => 'Ali', 'email' => 'a@mail.com', 'department_id' => 1]);

$students = Student::with('department')        // يمنع N+1
    ->where('name', 'like', 'A%')
    ->orderBy('name')
    ->paginate(15);

$s->courses()->attach($courseId, ['grade' => 85]);`,
      task: `اجلب كل الأقسام مع عدد طلاب كل قسم.`,
      answer: `[[Department::withCount('students')->get();]] ويظهر العدد في [[students_count]].`
    },
    {
      id: 'p4t6', title: 'Controllers والتحقق (Validation)',
      explain: `لا تثق أبداً بمدخلات المستخدم. استخدم [[validate()]] للتحقق قبل الحفظ؛ إذا فشل التحقق يرجّع Laravel تلقائياً رمز [[422]] مع الأخطاء.

القاعدة: **Thin Controller** — المتحكم يستقبل ويتحقق ويرد، والمنطق المعقد يذهب إلى Model أو Service.`,
      lang: 'php',
      code: r`// php artisan make:controller StudentController --api
class StudentController extends Controller
{
    public function index()
    {
        return Student::with('department')->paginate(15);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'          => 'required|string|max:100',
            'email'         => 'required|email|unique:students,email',
            'department_id' => 'required|exists:departments,id',
        ]);

        $student = Student::create($data);
        return response()->json($student, 201);
    }

    public function destroy(Student $student)
    {
        $student->delete();
        return response()->noContent();   // 204
    }
}`,
      task: `أرسل طلب POST ببريد إلكتروني غير صالح. ما رمز الحالة الذي سيعود؟`,
      answer: `الرمز [[422 Unprocessable Content]] مع رسائل أخطاء التحقق بصيغة JSON.`
    },
    {
      id: 'p4t7', title: 'المصادقة (Authentication) بـ Sanctum',
      explain: `**المصادقة**: من أنت؟ **التفويض**: ماذا يحق لك؟ للتطبيقات والـ APIs نستخدم **Laravel Sanctum**: المستخدم يسجّل الدخول فيستلم **Token**، ويرسله مع كل طلب في ترويسة [[Authorization: Bearer ...]].

لا تخزّن كلمة المرور نصاً أبداً؛ استخدم [[Hash::make]] (وLaravel يفعلها تلقائياً مع الحقل المخفي).`,
      lang: 'php',
      code: r`# php artisan install:api     (يثبّت Sanctum ويجهّز routes/api.php)

// User.php  →  use HasApiTokens;

// AuthController
public function login(Request $request)
{
    $cred = $request->validate(['email' => 'required|email', 'password' => 'required']);

    $user = User::where('email', $cred['email'])->first();
    if (! $user || ! Hash::check($cred['password'], $user->password)) {
        return response()->json(['message' => 'Invalid credentials'], 401);
    }
    return ['token' => $user->createToken('api')->plainTextToken];
}

// routes/api.php
Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->get('/me', fn (Request $r) => $r->user());

# التجربة
curl -H "Authorization: Bearer YOUR_TOKEN" http://127.0.0.1:8000/api/me`,
      task: `ما الرمز الذي يعيده [[/api/me]] إذا لم ترسل Token؟`,
      answer: `الرمز [[401 Unauthorized]].`
    },
    {
      id: 'p4t8', title: 'بناء REST API و API Resources',
      explain: `الـ **REST API** يتبع قواعد واضحة: عناوين بصيغة أسماء جمع ([[/api/students]])، وطرق HTTP للأفعال: GET للقراءة، POST للإنشاء، PUT/PATCH للتعديل، DELETE للحذف، وترجع JSON.

[[API Resource]] يتحكم بشكل الـ JSON فلا تكشف حقولاً حساسة.`,
      lang: 'php',
      code: r`# php artisan make:resource StudentResource

class StudentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'         => $this->id,
            'name'       => $this->name,
            'department' => $this->department?->name,
            'courses'    => $this->whenLoaded('courses'),
        ];
    }
}

// في الـ Controller
return StudentResource::collection(Student::with('department')->paginate(10));

// routes/api.php
Route::apiResource('students', StudentController::class)->middleware('auth:sanctum');`,
      task: `ابنِ CRUD كاملاً لمورد واحد من مشروع تخرجك واختبره في Postman.`,
      answer: `تحقق من 5 مسارات: index, store, show, update, destroy، ومن رموز الحالة 200/201/404/422/401.`
    }
  ]
}
);
