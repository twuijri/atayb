# دليل النشر السريع - Portainer Stack

## ✅ قائمة المراجعة السريعة

- [ ] حساب Supabase جاهز
- [ ] تنفيذ `SUPABASE_MIGRATION.sql` في Supabase
- [ ] بناء صورة Docker
- [ ] نسخ المتغيرات البيئية من `.env.portainer`
- [ ] إنشاء Stack في Portainer

---

## 🚀 خطوات النشر (5 دقائق)

### 1️⃣ إعداد Supabase (مرة واحدة فقط)

```bash
# 1. سجل على https://supabase.com
# 2. أنشئ مشروع جديد
# 3. في SQL Editor، نفذ محتوى ملف SUPABASE_MIGRATION.sql
# 4. من Settings > API، انسخ:
#    - Project URL
#    - anon public key
#    - service_role key (اضغط reveal)
```

### 2️⃣ بناء الصورة

```bash
# الطريقة الأولى: استخدام السكريبت
./build-and-deploy.sh

# الطريقة الثانية: يدوياً
docker build -t atayb-app:latest .
```

### 3️⃣ النشر على Portainer

#### في Portainer:
1. **Stacks** → **+ Add stack**
2. **Name**: `atayb`
3. **Web editor**: انسخ محتوى `docker-compose.yml`
4. **Environment variables**: اضغط **Advanced mode** والصق:

```env
SUPABASE_URL=https://qxhsywktcdhsmdkcdyor.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4aHN5d2t0Y2Roc21ka2NkeW9yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwNTU3MDMsImV4cCI6MjA4MzYzMTcwM30.RYwpn4Kun43eU_JvNrBtVYGimpXu5DB1O8VeM_IinA8
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4aHN5d2t0Y2Roc21ka2NkeW9yIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODA1NTcwMywiZXhwIjoyMDgzNjMxNzAzfQ.F8X0CNojmUs3p2ia6Wr3gV4JE74jUYqOIJj7Ies1Sm0
ADMIN_USERNAME=admin
ADMIN_PASSWORD=YourSecurePassword123!
```

5. **Deploy the stack**
6. انتظر حتى يصبح الـ Container **running** (30-60 ثانية)

### 4️⃣ الوصول للتطبيق

```
الموقع: http://your-server-ip:3000
الإدارة: http://your-server-ip:3000/admin
```

---

## 🔧 المتغيرات المطلوبة

افتح `.env.portainer` وانسخ القيم إلى Portainer:

| المتغير | أين تجده |
|---------|----------|
| `SUPABASE_URL` | Supabase → Settings → API → Project URL |
| `SUPABASE_ANON_KEY` | Supabase → Settings → API → anon public |
| `SUPABASE_SERVICE_KEY` | Supabase → Settings → API → service_role |
| `ADMIN_USERNAME` | اختر اسم المستخدم |
| `ADMIN_PASSWORD` | اختر كلمة مرور قوية |

---

## 📦 الملفات المهمة

| الملف | الغرض |
|------|-------|
| `docker-compose.yml` | تعريف الـ Stack للـ Portainer |
| `Dockerfile` | تعريف صورة Docker |
| `.env.portainer` | المتغيرات البيئية (انسخها للـ Portainer) |
| `SUPABASE_MIGRATION.sql` | جدول قاعدة البيانات |
| `build-and-deploy.sh` | سكريبت البناء التلقائي |
| `PORTAINER_DEPLOY.md` | دليل مفصل |

---

## ⚡ أوامر سريعة

```bash
# بناء الصورة
docker build -t atayb-app:latest .

# تشغيل محلي للتجربة
docker run -p 3000:3000 \
  -e SUPABASE_URL="your-url" \
  -e SUPABASE_ANON_KEY="your-key" \
  -e SUPABASE_SERVICE_KEY="your-key" \
  -e ADMIN_USERNAME="admin" \
  -e ADMIN_PASSWORD="password" \
  atayb-app:latest

# عرض اللوجات
docker logs atayb-app

# إيقاف وحذف
docker stop atayb-app && docker rm atayb-app
```

---

## ❓ حل المشاكل الشائعة

### المشكلة: التطبيق لا يعمل
```bash
# عرض اللوجات
docker logs atayb-app

# التحقق من الـ health
docker ps
```

### المشكلة: خطأ في الاتصال بقاعدة البيانات
- [ ] تأكد من تنفيذ `SUPABASE_MIGRATION.sql`
- [ ] تحقق من صحة `SUPABASE_URL` و `SUPABASE_ANON_KEY`
- [ ] راجع الـ logs: `docker logs atayb-app`

### المشكلة: لا يمكن الدخول للوحة الإدارة
- [ ] تحقق من `ADMIN_USERNAME` و `ADMIN_PASSWORD` في المتغيرات البيئية
- [ ] حاول إعادة تشغيل الـ Stack

---

## 🔄 التحديث

```bash
# 1. بناء صورة جديدة
docker build -t atayb-app:latest .

# 2. في Portainer: Stack → Update → Pull latest image → Update
```

---

## 💾 النسخ الاحتياطي

### الملفات المرفوعة
```bash
docker run --rm -v atayb-uploads:/data -v $(pwd):/backup \
  alpine tar czf /backup/uploads-backup.tar.gz /data
```

### قاعدة البيانات
Supabase يحتفظ بنسخ احتياطية تلقائية، لكن يمكنك:
- Supabase Dashboard → Database → Backups

---

## 📞 الدعم

للمزيد من التفاصيل، راجع:
- `PORTAINER_DEPLOY.md` - دليل شامل
- `README.md` - وثائق المشروع
- `SUPABASE_MIGRATION.sql` - جدول قاعدة البيانات
