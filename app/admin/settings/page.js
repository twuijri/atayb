'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import styles from './settings.module.css';

export default function SettingsPage() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [siteTitle, setSiteTitle] = useState('');
  const [siteDescription, setSiteDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings');
      if (res.ok) {
        const data = await res.json();
        setSiteTitle(data.siteTitle || '');
        setSiteDescription(data.siteDescription || '');
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    
    if (!currentPassword) {
      setMessage('❌ يرجى إدخال كلمة المرور الحالية');
      return;
    }
    
    if (newPassword && newPassword !== confirmPassword) {
      setMessage('❌ كلمة المرور الجديدة غير متطابقة');
      return;
    }
    
    if (newPassword && newPassword.length < 4) {
      setMessage('❌ كلمة المرور يجب أن تكون 4 أحرف على الأقل');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newUsername: newUsername || undefined,
          newPassword: newPassword || undefined,
          siteTitle,
          siteDescription
        })
      });

      const data = await res.json();
      
      if (res.ok) {
        setMessage('✅ تم تحديث الإعدادات بنجاح!');
        setCurrentPassword('');
        setNewUsername('');
        setNewPassword('');
        setConfirmPassword('');
        
        if (newPassword) {
          setTimeout(async () => {
            await fetch('/api/auth/logout', { method: 'POST' });
            router.push('/admin/login');
          }, 1500);
        }
      } else {
        setMessage('❌ ' + (data.error || 'كلمة المرور الحالية غير صحيحة'));
      }
    } catch (error) {
      setMessage('❌ خطأ في الاتصال: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={() => router.push('/admin/dashboard')} className={styles.backBtn}>
          <ArrowLeft size={20} /> رجوع
        </button>
        <h1>⚙️ إعدادات الحساب</h1>
        <p>تغيير اسم المستخدم وكلمة المرور</p>
      </div>

      {message && (
        <div className={`${styles.message} ${message.includes('❌') ? styles.error : styles.success}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.section}>
          <h2>🌐 معلومات الموقع</h2>
          <p className={styles.sectionDesc}>تظهر عند مشاركة الرابط في واتساب، تيليجرام، وغيرها</p>
          
          <div className={styles.field}>
            <label>عنوان الموقع</label>
            <input
              type="text"
              value={siteTitle}
              onChange={(e) => setSiteTitle(e.target.value)}
              placeholder="مثال: متجري الإلكتروني"
            />
          </div>

          <div className={styles.field}>
            <label>وصف الموقع</label>
            <textarea
              value={siteDescription}
              onChange={(e) => setSiteDescription(e.target.value)}
              placeholder="مثال: أفضل المنتجات بأسعار منافسة"
              rows={3}
            />
          </div>
        </div>

        <div className={styles.section}>
          <h2>🔐 كلمة المرور الحالية</h2>
          <p className={styles.sectionDesc}>يجب إدخال كلمة المرور الحالية للتأكيد</p>
          
          <div className={styles.field}>
            <label>كلمة المرور الحالية *</label>
            <div className={styles.passwordField}>
              <input
                type={showPasswords ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
              <button 
                type="button" 
                onClick={() => setShowPasswords(!showPasswords)}
                className={styles.toggleBtn}
              >
                {showPasswords ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2>👤 اسم المستخدم الجديد (اختياري)</h2>
          <p className={styles.sectionDesc}>اترك الحقل فارغاً إذا لم ترغب بالتغيير</p>
          
          <div className={styles.field}>
            <label>اسم المستخدم الجديد</label>
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="اترك فارغاً للإبقاء على الحالي"
            />
          </div>
        </div>

        <div className={styles.section}>
          <h2>🔑 كلمة المرور الجديدة (اختياري)</h2>
          <p className={styles.sectionDesc}>اترك الحقول فارغة إذا لم ترغب بالتغيير</p>
          
          <div className={styles.field}>
            <label>كلمة المرور الجديدة</label>
            <input
              type={showPasswords ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="اترك فارغاً للإبقاء على الحالي"
            />
            <small>يجب أن تكون 4 أحرف على الأقل</small>
          </div>

          <div className={styles.field}>
            <label>تأكيد كلمة المرور الجديدة</label>
            <input
              type={showPasswords ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="أعد إدخال كلمة المرور"
            />
          </div>
        </div>

        <div className={styles.actions}>
          <button type="submit" disabled={loading} className={styles.saveButton}>
            <Save size={18} />
            {loading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
          </button>
        </div>

        <div className={styles.warning}>
          <strong>⚠️ تنبيه:</strong> إذا قمت بتغيير كلمة المرور، سيتم تسجيل خروجك تلقائياً.
        </div>
      </form>
    </div>
  );
}
