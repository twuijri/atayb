# أطايب التمور - Atayeb Altomor

موقع QR code generator احترافي بتصميم أطايب التمور

## المتطلبات

- Docker و Docker Compose
- Git

## التثبيت والتشغيل على السيرفر

### 1. استنساخ المشروع من GitHub

```bash
git clone https://github.com/YOUR_USERNAME/atayb.git
cd atayb
```

### 2. تشغيل مع Docker Compose

```bash
docker-compose up -d
```

الموقع سيكون متاح على: `http://YOUR_SERVER_IP:3000`

## البيانات والملفات المهمة

### Volumes (المجلدات المهمة):
```yaml
volumes:
  - ./data:/app/data              # ملفات البيانات (الروابط، الإحصائيات، الإعدادات)
  - ./public/uploads:/app/public/uploads  # الصور والشعارات المرفوعة
```

**المجلدات التي تُحفظ خارج الـ Container:**
- `./data/` - جميع البيانات (links.json, stats.json, config.json)
- `./public/uploads/` - جميع الصور والملفات المرفوعة

### Ports:
```yaml
ports:
  - "3000:3000"  # الموقع الرئيسي
```

## لوحة التحكم

**رابط لوحة التحكم:** `http://YOUR_SERVER_IP:3000/admin/login`

**بيانات الدخول الافتراضية:**
- Username: `admin`
- Password: `atayb2025`

## التحكم الأساسي

### بدء التطبيق:
```bash
docker-compose up -d
```

### إيقاف التطبيق:
```bash
docker-compose down
```

### عرض السجلات:
```bash
docker-compose logs -f atayb-app
```

### إعادة التشغيل:
```bash
docker-compose restart
```

## الملفات الهامة

- `docker-compose.yml` - إعدادات Docker
- `Dockerfile` - تعريف صورة Docker
- `next.config.mjs` - إعدادات Next.js
- `package.json` - المتطلبات والـ Scripts

## البيانات المحفوظة

عند حذف الـ Container، **جميع البيانات محفوظة** في:
- `./data/` - الروابط والإحصائيات
- `./public/uploads/` - الصور والشعارات

## النسخ الاحتياطية

للقيام بنسخة احتياطية:
```bash
# نسخ مجلد البيانات
tar -czf backup-$(date +%Y%m%d).tar.gz data/ public/uploads/
```

## استكشاف الأخطاء

### الـ Container لا يبدأ:
```bash
docker-compose logs atayb-app
```

### Port 3000 مستخدم:
غيّر الـ port في `docker-compose.yml`:
```yaml
ports:
  - "8080:3000"  # سيكون متاح على 8080 بدلاً من 3000
```

## المتغيرات البيئية

```env
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

---

**تم الإنشاء:** 2026
**الإصدار:** 1.0.0
