'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './setup.module.css';

export default function SetupPage() {
  const [formData, setFormData] = useState({
    adminUsername: '',
    adminPassword: '',
    confirmPassword: '',
    supabaseUrl: '',
    supabaseAnonKey: '',
    supabaseServiceKey: ''
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  const [showPasswords, setShowPasswords] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkSetupStatus();
  }, []);

  const checkSetupStatus = async () => {
    try {
      const res = await fetch('/api/admin/setup/check');
      const data = await res.json();
      
      if (data.isConfigured) {
        // Already configured, redirect to login
        router.push('/admin/login');
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Error checking setup:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (formData.adminPassword !== formData.confirmPassword) {
      setError('كلمات المرور غير متطابقة');
      return;
    }

    // Validate password strength
    if (formData.adminPassword.length < 8) {
      setError('كلمة المرور يجب أن تكون 8 أحرف على الأقل');
      return;
    }

    // Step 1: Admin credentials only
    if (step === 1) {
      if (!formData.adminUsername || !formData.adminPassword) {
        setError('الرجاء ملء جميع الحقول');
        return;
      }
      setStep(2);
      return;
    }

    // Step 2: Complete setup
    setSubmitting(true);

    try {
      const res = await fetch('/api/admin/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminUsername: formData.adminUsername,
          adminPassword: formData.adminPassword,
          supabaseUrl: formData.supabaseUrl || undefined,
          supabaseAnonKey: formData.supabaseAnonKey || undefined,
          supabaseServiceKey: formData.supabaseServiceKey || undefined
        })
      });

      const data = await res.json();

      if (res.ok) {
        // Setup successful, redirect to login
        setTimeout(() => {
          router.push('/admin/login?setup=success');
        }, 1500);
      } else {
        setError(data.error || 'حدث خطأ في الإعداد');
        setSubmitting(false);
      }
    } catch (error) {
      setError('خطأ في الاتصال: ' + error.message);
      setSubmitting(false);
    }
  };

  const skipDatabaseSetup = async () => {
    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/admin/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminUsername: formData.adminUsername,
          adminPassword: formData.adminPassword
        })
      });

      const data = await res.json();

      if (res.ok) {
        setTimeout(() => {
          router.push('/admin/login?setup=success');
        }, 1500);
      } else {
        setError(data.error || 'حدث خطأ في الإعداد');
        setSubmitting(false);
      }
    } catch (error) {
      setError('خطأ في الاتصال: ' + error.message);
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingBox}>
          <div className={styles.spinner}></div>
          <p>جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.setupBox}>
        <div className={styles.header}>
          <h1>🎉 مرحباً في Atayb</h1>
          <p>الإعداد الأولي للنظام</p>
        </div>

        {submitting && (
          <div className={styles.successMessage}>
            <div className={styles.checkmark}>✓</div>
            <p>تم الإعداد بنجاح! جاري التحويل...</p>
          </div>
        )}

        {!submitting && (
          <>
            <div className={styles.progressBar}>
              <div className={`${styles.progressStep} ${step >= 1 ? styles.active : ''}`}>
                <div className={styles.stepNumber}>1</div>
                <span>حساب الأدمن</span>
              </div>
              <div className={styles.progressLine}></div>
              <div className={`${styles.progressStep} ${step >= 2 ? styles.active : ''}`}>
                <div className={styles.stepNumber}>2</div>
                <span>قاعدة البيانات</span>
              </div>
            </div>

            {error && (
              <div className={styles.error}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className={styles.form}>
              {step === 1 && (
                <div className={styles.step}>
                  <h2>إنشاء حساب المدير</h2>
                  <p className={styles.stepDescription}>
                    أنشئ حساب المدير للوصول إلى لوحة التحكم
                  </p>

                  <div className={styles.field}>
                    <label>اسم المستخدم *</label>
                    <input
                      type="text"
                      value={formData.adminUsername}
                      onChange={(e) => setFormData({...formData, adminUsername: e.target.value})}
                      placeholder="admin"
                      required
                      autoFocus
                    />
                  </div>

                  <div className={styles.field}>
                    <label>كلمة المرور *</label>
                    <input
                      type={showPasswords ? "text" : "password"}
                      value={formData.adminPassword}
                      onChange={(e) => setFormData({...formData, adminPassword: e.target.value})}
                      placeholder="••••••••"
                      required
                      minLength={8}
                    />
                    <small>يجب أن تكون 8 أحرف على الأقل</small>
                  </div>

                  <div className={styles.field}>
                    <label>تأكيد كلمة المرور *</label>
                    <input
                      type={showPasswords ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                      placeholder="••••••••"
                      required
                    />
                  </div>

                  <div className={styles.checkboxField}>
                    <label>
                      <input
                        type="checkbox"
                        checked={showPasswords}
                        onChange={(e) => setShowPasswords(e.target.checked)}
                      />
                      <span>إظهار كلمة المرور</span>
                    </label>
                  </div>

                  <button type="submit" className={styles.primaryButton}>
                    التالي ← إعداد قاعدة البيانات
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className={styles.step}>
                  <h2>إعداد قاعدة البيانات (اختياري)</h2>
                  <p className={styles.stepDescription}>
                    يمكنك إعداد قاعدة البيانات الآن أو تخطي هذه الخطوة وإعدادها لاحقاً من لوحة التحكم
                  </p>

                  <div className={styles.field}>
                    <label>رابط Supabase (Project URL)</label>
                    <input
                      type="text"
                      value={formData.supabaseUrl}
                      onChange={(e) => setFormData({...formData, supabaseUrl: e.target.value})}
                      placeholder="https://xxxxx.supabase.co"
                      dir="ltr"
                    />
                  </div>

                  <div className={styles.field}>
                    <label>Anon Key</label>
                    <input
                      type={showPasswords ? "text" : "password"}
                      value={formData.supabaseAnonKey}
                      onChange={(e) => setFormData({...formData, supabaseAnonKey: e.target.value})}
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                      dir="ltr"
                    />
                  </div>

                  <div className={styles.field}>
                    <label>Service Role Key</label>
                    <input
                      type={showPasswords ? "text" : "password"}
                      value={formData.supabaseServiceKey}
                      onChange={(e) => setFormData({...formData, supabaseServiceKey: e.target.value})}
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                      dir="ltr"
                    />
                  </div>

                  <div className={styles.buttonGroup}>
                    <button type="button" onClick={() => setStep(1)} className={styles.secondaryButton}>
                      ← رجوع
                    </button>
                    <button type="button" onClick={skipDatabaseSetup} className={styles.skipButton}>
                      تخطي (إعداد لاحقاً)
                    </button>
                    <button type="submit" className={styles.primaryButton}>
                      إكمال الإعداد
                    </button>
                  </div>

                  <div className={styles.infoBox}>
                    <strong>💡 نصيحة:</strong> يمكنك تخطي هذه الخطوة وإعداد قاعدة البيانات لاحقاً من:
                    <br/>
                    لوحة التحكم → الإعدادات
                  </div>
                </div>
              )}
            </form>
          </>
        )}
      </div>
    </div>
  );
}
