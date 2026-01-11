# دليل النشر على Portainer

## المتطلبات الأساسية

1. **حساب Supabase** (قاعدة بيانات خارجية)
   - سجل دخول على https://supabase.com
   - أنشئ مشروع جديد
   - نفذ السكريبت `SUPABASE_MIGRATION.sql` في SQL Editor
   - احصل على:
     - Project URL
     - Anon Key
     - Service Role Key

2. **صورة Docker** للتطبيق
   - يجب بناء الصورة أولاً

---

## خطوات البناء والنشر

### 1. بناء صورة Docker

```bash
# بناء الصورة
docker build -t atayb-app:latest .

# (اختياري) رفع الصورة إلى Docker Hub
docker tag atayb-app:latest your-dockerhub-username/atayb-app:latest
docker push your-dockerhub-username/atayb-app:latest
```

---

### 2. النشر على Portainer

#### الطريقة الأولى: استخدام Portainer Stack

1. افتح Portainer
2. اذهب إلى **Stacks**
3. اضغط على **+ Add Stack**
4. اختر اسم للـ Stack: `atayb`
5. الصق محتوى ملف `docker-compose.yml`
6. اضغط على **Environment variables** وأضف المتغيرات التالية:

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-role-key
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-password
```

7. اضغط على **Deploy the stack**

---

#### الطريقة الثانية: استخدام Git Repository

1. في Portainer، اذهب إلى **Stacks**
2. اضغط على **+ Add Stack**
3. اختر **Git Repository**
4. أدخل معلومات المستودع:
   - Repository URL
   - Reference: `main` أو `master`
   - Compose path: `docker-compose.yml`
5. أضف المتغيرات البيئية كما في الطريقة الأولى
6. اضغط على **Deploy the stack**

---

## المتغيرات البيئية المطلوبة

| المتغير | الوصف | مثال |
|---------|-------|------|
| `SUPABASE_URL` | رابط مشروع Supabase | `https://xxx.supabase.co` |
| `SUPABASE_ANON_KEY` | Anon Key من Supabase | `eyJhbGc...` |
| `SUPABASE_SERVICE_KEY` | Service Role Key من Supabase | `eyJhbGc...` |
| `ADMIN_USERNAME` | اسم مستخدم الأدمن | `admin` |
| `ADMIN_PASSWORD` | كلمة مرور الأدمن | `SecurePassword123!` |

---

## التحقق من النشر

1. بعد النشر، انتظر حتى يصبح الكونتينر **Running**
2. افتح `http://server-ip:3000`
3. للدخول للوحة التحكم: `http://server-ip:3000/admin`

---

## الصيانة

### عرض اللوجات
```bash
docker logs atayb-app
```

### إعادة تشغيل التطبيق
في Portainer، اذهب إلى Container وأعد تشغيله

### تحديث التطبيق
1. بناء صورة جديدة
2. في Portainer Stack، اضغط على **Update the stack**
3. اضغط على **Pull latest image** ثم **Update**

---

## النسخ الاحتياطي

### Volumes
التطبيق يستخدم volumes للبيانات:
- `atayb-uploads`: الملفات المرفوعة
- `atayb-data`: بيانات التطبيق

لعمل نسخة احتياطية:
```bash
docker run --rm -v atayb-uploads:/data -v $(pwd):/backup alpine tar czf /backup/uploads-backup.tar.gz /data
docker run --rm -v atayb-data:/data -v $(pwd):/backup alpine tar czf /backup/data-backup.tar.gz /data
```

### قاعدة البيانات
قاعدة البيانات في Supabase تحتفظ بنسخ احتياطية تلقائية، لكن يمكنك عمل نسخة يدوية من لوحة التحكم Supabase.

---

## استكشاف الأخطاء

### التطبيق لا يعمل
1. تحقق من اللوجات: `docker logs atayb-app`
2. تأكد من صحة المتغيرات البيئية
3. تأكد من الاتصال بـ Supabase

### خطأ في الاتصال بقاعدة البيانات
- تحقق من `SUPABASE_URL` و `SUPABASE_ANON_KEY`
- تأكد من تنفيذ `SUPABASE_MIGRATION.sql`
- تحقق من إعدادات الـ Firewall في Supabase

### لا يمكن الدخول للإدارة
- تحقق من `ADMIN_USERNAME` و `ADMIN_PASSWORD`
- تأكد من أنهما متطابقان في المتغيرات البيئية
