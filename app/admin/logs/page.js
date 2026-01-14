"use client";

import { useState, useEffect } from 'react';
import { RefreshCw, Trash2, AlertCircle, Info, AlertTriangle, CheckCircle } from 'lucide-react';
import styles from './logs.module.css';

export default function LogsPage() {
    const [logs, setLogs] = useState([]);
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [autoRefresh, setAutoRefresh] = useState(false);

    const fetchLogs = async () => {
        try {
            const url = filter === 'all' 
                ? '/api/admin/logs?limit=200' 
                : `/api/admin/logs?limit=200&level=${filter}`;
            
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.success) {
                setLogs(data.logs);
            }
        } catch (error) {
            console.error('Failed to fetch logs:', error);
        } finally {
            setLoading(false);
        }
    };

    const clearLogs = async () => {
        if (!confirm('هل أنت متأكد من مسح جميع السجلات؟')) return;
        
        try {
            const response = await fetch('/api/admin/logs', { method: 'DELETE' });
            const data = await response.json();
            
            if (data.success) {
                setLogs([]);
                alert('تم مسح السجلات بنجاح');
            }
        } catch (error) {
            alert('فشل مسح السجلات');
        }
    };

    useEffect(() => {
        fetchLogs();
    }, [filter]);

    useEffect(() => {
        if (autoRefresh) {
            const interval = setInterval(fetchLogs, 3000);
            return () => clearInterval(interval);
        }
    }, [autoRefresh, filter]);

    const getLevelIcon = (level) => {
        switch (level) {
            case 'error': return <AlertCircle className={styles.iconError} />;
            case 'warning': return <AlertTriangle className={styles.iconWarning} />;
            case 'success': return <CheckCircle className={styles.iconSuccess} />;
            default: return <Info className={styles.iconInfo} />;
        }
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleString('ar-SA', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>سجلات النظام</h1>
                <div className={styles.actions}>
                    <label className={styles.autoRefresh}>
                        <input
                            type="checkbox"
                            checked={autoRefresh}
                            onChange={(e) => setAutoRefresh(e.target.checked)}
                        />
                        تحديث تلقائي
                    </label>
                    <button onClick={fetchLogs} className={styles.btnRefresh}>
                        <RefreshCw size={18} />
                        تحديث
                    </button>
                    <button onClick={clearLogs} className={styles.btnClear}>
                        <Trash2 size={18} />
                        مسح الكل
                    </button>
                </div>
            </div>

            <div className={styles.filters}>
                <button 
                    className={filter === 'all' ? styles.active : ''}
                    onClick={() => setFilter('all')}
                >
                    الكل ({logs.length})
                </button>
                <button 
                    className={filter === 'error' ? styles.active : ''}
                    onClick={() => setFilter('error')}
                >
                    أخطاء
                </button>
                <button 
                    className={filter === 'warning' ? styles.active : ''}
                    onClick={() => setFilter('warning')}
                >
                    تحذيرات
                </button>
                <button 
                    className={filter === 'info' ? styles.active : ''}
                    onClick={() => setFilter('info')}
                >
                    معلومات
                </button>
                <button 
                    className={filter === 'success' ? styles.active : ''}
                    onClick={() => setFilter('success')}
                >
                    نجاح
                </button>
            </div>

            {loading ? (
                <div className={styles.loading}>جاري التحميل...</div>
            ) : logs.length === 0 ? (
                <div className={styles.empty}>لا توجد سجلات</div>
            ) : (
                <div className={styles.logs}>
                    {logs.map((log, index) => (
                        <div key={index} className={`${styles.logEntry} ${styles[log.level]}`}>
                            <div className={styles.logHeader}>
                                {getLevelIcon(log.level)}
                                <span className={styles.logLevel}>{log.level}</span>
                                <span className={styles.logTime}>{formatTime(log.timestamp)}</span>
                            </div>
                            <div className={styles.logMessage}>{log.message}</div>
                            {log.data && (
                                <pre className={styles.logData}>
                                    {JSON.stringify(log.data, null, 2)}
                                </pre>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
