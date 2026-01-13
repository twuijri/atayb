"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn } from 'lucide-react';
import styles from './login.module.css';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            console.log('Sending login request...');
            
            // Call API endpoint to set cookie server-side
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                console.log('Login successful, redirecting...');
                // Small delay to ensure cookie is set
                setTimeout(() => {
                    router.push('/admin/dashboard');
                }, 200);
            } else {
                setError(data.message || 'اسم المستخدم أو كلمة المرور غير صحيحة');
                setIsLoading(false);
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('حدث خطأ في الاتصال');
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.loginBox}>
                <div className={styles.header}>
                    <h1>Admin Panel</h1>
                    <p>Link Management System v2.0 ✓</p>
                </div>

                <form onSubmit={handleLogin} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="username">اسم المستخدم</label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className={styles.input}
                            disabled={isLoading}
                            autoFocus
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="password">كلمة المرور</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={styles.input}
                            disabled={isLoading}
                        />
                    </div>

                    {error && <div className={styles.error}>{error}</div>}

                    <button 
                        type="submit" 
                        className={styles.button}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span className={styles.loading}>جاري الدخول...</span>
                        ) : (
                            <>
                                <LogIn size={18} />
                                تسجيل الدخول
                            </>
                        )}
                    </button>
                </form>

                <div className={styles.footer}>
                    <p>Link Manager © 2026</p>
                </div>
            </div>
        </div>
    );
}
