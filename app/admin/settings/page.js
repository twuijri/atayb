'use client';
import { useState, useEffect } from 'react';
import styles from './settings.module.css';

export default function SettingsPage() {
  const [config, setConfig] = useState({
    supabaseUrl: '',
    supabaseAnonKey: '',
    supabaseServiceKey: '',
    adminUsername: '',
    adminPassword: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const res = await fetch('/api/admin/settings');
      if (res.ok) {
        const data = await res.json();
        setConfig(data);
      }
    } catch (error) {
      console.error('Error fetching config:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });

      const data = await res.json();
      
      if (res.ok) {
        setMessage('✅ تم حفظ الإعدادات بنجاح! سيتم تطبيق التغييرات عند إعادة تشغيل التطبيق.');
      } else {
        setMessage('❌ ' + (data.error || 'حدث خطأ في الحفظ'));
      }
    } catch (error) {
      setMessage('❌ خطأ في الاتصال: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const testConnection = async () => {
    setMessage('🔍 جاري اختبار الاتصال...');
    try {
      const res = await fetch('/api/admin/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          supabaseUrl: config.supabaseUrl,
          supabaseAnonKey: config.supabaseAnonKey
        })
      });

      const data = await res.json();
      
      if (res.ok) {
        setMessage('✅ الاتصال بقاعدة البيانات ناجح!');
      } else {
        setMessage('❌ فشل الاتصال: ' + (data.error || 'تحقق من البيانات'));
      }
    } catch (error) {
      setMessage('❌ خطأ في الاتصال: ' + error.message);
    }
  };

  if (loading) {
    return <div className={styles.container}>جاري التحميل...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>⚙️ إعدادات النظام</h1>
        <p>إدارة اتصال قاعدة البيانات ومعلومات الدخول</p>
      </div>

      {message && (
        <div className={`${styles.message} ${message.includes('❌') ? styles.error : styles.success}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.section}>
          <h2>🗄️ إعدادات Supabase</h2>
          
          <div className={styles.field}>
            <label>رابط المشروع (Project URL)</label>
            <input
              type="text"
              value={config.supabaseUrl}
              onChange={(e) => setConfig({...config, supabaseUrl: e.target.value})}
              placeholder="https://xxxxx.supabase.co"
              required
            />
            <small>مثال: https://qxhsywktcdhsmdkcdyor.supabase.co</small>
          </div>

          <div className={styles.field}>
            <label>Anon Key</label>
            <div className={styles.passwordField}>
              <input
                type={showPasswords ? "text" : "password"}
                value={config.supabaseAnonKey}
                onChange={(e) => setConfig({...config, supabaseAnonKey: e.target.value})}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                required
              />
            </div>
            <small>من Settings → API → anon public</small>
          </div>

          <div className={styles.field}>
            <label>Service Role Key</label>
            <div className={styles.passwordField}>
              <input
                type={showPasswords ? "text" : "password"}
                value={config.supabaseServiceKey}
                onChange={(e) => setConfig({...config, supabaseServiceKey: e.target.value})}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                required
              />
            </div>
            <small>من Settings → API → service_role (اضغط reveal)</small>
          </div>

          <div className={styles.checkboxField}>
            <label>
              <input
                type="checkbox"
                checked={showPasswords}
                onChange={(e) => setShowPasswords(e.target.checked)}
              />
              <span>إظهار المفاتيح</span>
            </label>
          </div>

          <button type="button" onClick={testConnection} className={styles.testButton}>
            🔍 اختبار الاتصال
          </button>
        </div>

        <div className={styles.section}>
          <h2>🔐 معلومات تسجيل الدخول</h2>
          
          <div className={styles.field}>
            <label>اسم المستخدم</label>
            <input
              type="text"
              value={config.adminUsername}
              onChange={(e) => setConfig({...config, adminUsername: e.target.value})}
              placeholder="admin"
              required
            />
          </div>

          <div className={styles.field}>
            <label>كلمة المرور</label>
            <input
              type={showPasswords ? "text" : "password"}
              value={config.adminPassword}
              onChange={(e) => setConfig({...config, adminPassword: e.target.value})}
              placeholder="••••••••"
              required
            />
            <small>⚠️ استخدم كلمة مرور قوية</small>
          </div>
        </div>

        <div className={styles.actions}>
          <button type="submit" disabled={saving} className={styles.saveButton}>
            {saving ? '⏳ جاري الحفظ...' : '💾 حفظ التغييرات'}
          </button>
        </div>

        <div className={styles.warning}>
          <strong>⚠️ تنبيه:</strong> بعد حفظ التغييرات، يجب إعادة تشغيل التطبيق لتطبيق الإعدادات الجديدة.
        </div>
      </form>
    </div>
  );
}
