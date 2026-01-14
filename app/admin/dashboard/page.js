"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, ArrowUp, ArrowDown, Plus, Save, LogOut, BarChart2, Eye, MousePointer, QrCode as QrIcon, X, Image as ImageIcon, Settings } from 'lucide-react';
import QRCode from 'qrcode';
import styles from './dashboard.module.css';

export default function Dashboard() {
    const [links, setLinks] = useState([]);
    const [stats, setStats] = useState({ page_views: 0, link_clicks: 0 });
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({});
    const [showQr, setShowQr] = useState(false);
    const [qrUrl, setQrUrl] = useState('');
    const [logoUpload, setLogoUpload] = useState(null);
    const [uploading, setUploading] = useState(false);

    const router = useRouter();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [linksRes, statsRes] = await Promise.all([
                fetch('/api/links'),
                fetch('/api/track')
            ]);
            
            if (!linksRes.ok || !statsRes.ok) {
                console.error('API error:', linksRes.status, statsRes.status);
                setLoading(false);
                return;
            }

            const linksData = await linksRes.json();
            const statsData = await statsRes.json();

            setLinks(Array.isArray(linksData) ? linksData.sort((a, b) => (a.order || 0) - (b.order || 0)) : []);
            setStats(statsData || { page_views: 0, link_clicks: 0 });
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch data:', error);
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            // Call logout API
            await fetch('/api/auth/logout', { method: 'POST' });
            router.push('/admin/login');
        } catch (err) {
            console.error('Logout error:', err);
            router.push('/admin/login');
        }
    };

    const handleCreate = () => {
        const newId = Date.now().toString();
        const newLink = {
            id: newId,
            title: 'رابط جديد',
            type: 'link',
            url: 'https://',
            icon: 'link',
            order: links.length,
        };
        setLinks([...links, newLink]);
        setEditingId(newId);
        setFormData(newLink);
    };

    const handleEdit = (link) => {
        setEditingId(link.id);
        setFormData(link);
    };

    const handleDelete = async (id) => {
        if (!confirm('هل أنت متأكد من الحذف؟')) return;
        
        try {
            const response = await fetch('/api/links', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });

            if (!response.ok) {
                alert('فشل الحذف');
                return;
            }

            const newLinks = links.filter(l => l.id !== id);
            setLinks(newLinks);
            fetchData();
        } catch (error) {
            console.error('Error deleting:', error);
            alert('حدث خطأ في الحذف');
        }
    };

    const handleMove = async (index, direction) => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === links.length - 1) return;

        const newLinks = [...links];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        // Swap order values
        const tempOrder = newLinks[index].order;
        newLinks[index].order = newLinks[targetIndex].order;
        newLinks[targetIndex].order = tempOrder;

        // Swap positions in array
        [newLinks[index], newLinks[targetIndex]] = [newLinks[targetIndex], newLinks[index]];

        setLinks(newLinks);
        await saveLinks(newLinks);
    };

    const saveLinks = async (data) => {
        await fetch('/api/links', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
    };

    const handleFormChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            console.log('📤 بدء رفع الصورة:', file.name);
            
            const formDataUpload = new FormData();
            formDataUpload.append('file', file);

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formDataUpload,
            });
            
            console.log('📡 Response status:', res.status);
            console.log('📡 Response ok:', res.ok);
            
            const data = await res.json();
            console.log('📦 Response data:', data);
            
            if (res.ok && data.success && data.url) {
                console.log('✅ تم رفع الصورة بنجاح:', data.url);
                handleFormChange('image', data.url);
            } else {
                console.error('❌ فشل رفع الصورة:', data);
                alert('فشل رفع الصورة: ' + (data.error || 'خطأ غير معروف'));
            }
        } catch (error) {
            console.error('💥 خطأ في رفع الصورة:', error);
            alert('حدث خطأ أثناء رفع الصورة: ' + error.message);
        }
    };

    const handleLogoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const formDataUpload = new FormData();
        formDataUpload.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formDataUpload,
            });
            const data = await res.json();
            if (data.success) {
                setLogoUpload(data.url);
                // Save to config
                await fetch('/api/config', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ logo: data.url }),
                });
            }
        } catch (error) {
            console.error('Error uploading logo:', error);
        } finally {
            setUploading(false);
        }
    };

    const handleSaveForm = async () => {
        const newLinks = links.map(l => l.id === editingId ? formData : l);
        setLinks(newLinks);
        await saveLinks(newLinks);
        setEditingId(null);
    };

    const handleCancel = () => {
        fetchData();
        setEditingId(null);
    };

    const generateQr = async () => {
        try {
            // Use current window location origin
            const url = window.location.origin;
            const dataUrl = await QRCode.toDataURL(url, { width: 400, margin: 2 });
            setQrUrl(dataUrl);
            setShowQr(true);
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1>لوحة التحكم</h1>
                </div>
                <div className={styles.loadingContainer}>
                    <div className={styles.spinner}></div>
                    <p>جاري تحميل البيانات...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>إدارة الروابط</h1>
                <div className={styles.headerActions}>
                    <button onClick={generateQr} className={styles.qrBtn}><QrIcon size={16} /> QR Code</button>
                    <button onClick={() => router.push('/admin/settings')} className={styles.settingsBtn}><Settings size={16} /> الإعدادات</button>
                    <button onClick={handleLogout} className={styles.logoutBtn}><LogOut size={16} /> خروج</button>
                </div>
            </header>

            {/* Header Image Upload Section */}
            <div className={styles.logoSection}>
                <h2>إعدادات الموقع</h2>
                <p className={styles.logoDescription}>تخصيص مظهر الموقع وعنوان الصفحة الرئيسية</p>
                
                {/* Site Title */}
                <div className={styles.siteTitleSection}>
                    <label>عنوان الموقع</label>
                    <input 
                        type="text"
                        placeholder="Link Manager"
                        defaultValue="Link Manager"
                        onBlur={async (e) => {
                            try {
                                await fetch('/api/config', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ siteTitle: e.target.value })
                                });
                            } catch (error) {
                                console.error('Error saving site title:', error);
                            }
                        }}
                        className={styles.siteTitleInput}
                    />
                </div>

                {/* Header Image */}
                <div className={styles.logoUploadContainer}>
                    <label className={styles.logoUploadLabel}>
                        <ImageIcon size={32} />
                        <span>{uploading ? 'جاري الرفع...' : 'رفع صورة الهيدر (1920x900)'}</span>
                        <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleLogoUpload}
                            disabled={uploading}
                            style={{ display: 'none' }}
                        />
                    </label>
                    {logoUpload && (
                        <div className={styles.logoPreview}>
                            <img src={logoUpload} alt="Uploaded Header" />
                            <p>✓ تم رفع الهيدر بنجاح</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Stats Section */}
            <div className={styles.statsContainer}>
                <div className={styles.statCard}>
                    <Eye size={24} className={styles.statIcon} />
                    <div>
                        <div className={styles.statLabel}>عدد الزيارات</div>
                        <div className={styles.statValue}>{stats.page_views || 0}</div>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <MousePointer size={24} className={styles.statIcon} />
                    <div>
                        <div className={styles.statLabel}>إجمالي النقرات</div>
                        <div className={styles.statValue}>{stats.link_clicks || 0}</div>
                    </div>
                </div>
            </div>

            <div className={styles.list}>
                {links.map((link, index) => (
                    <div key={link.id} className={styles.item}>
                        {editingId === link.id ? (
                            <div className={styles.form}>
                                <div className={styles.formGroup}>
                                    <label>العنوان</label>
                                    <input
                                        value={formData.title}
                                        onChange={e => handleFormChange('title', e.target.value)}
                                        placeholder="مثال: الكتالوج"
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>النوع</label>
                                    <select value={formData.type} onChange={e => handleFormChange('type', e.target.value)}>
                                        <option value="link">رابط</option>
                                        <option value="pdf">ملف PDF</option>
                                        <option value="whatsapp">واتس اب</option>
                                    </select>
                                </div>
                                <div className={styles.formGroup}>
                                    <label>الرابط</label>
                                    <div className={styles.urlInputGroup}>
                                        <input className={styles.urlInput} value={formData.url} onChange={e => handleFormChange('url', e.target.value)} />
                                        <label className={styles.uploadLabel}>
                                            رفع ملف/PDF
                                            <input type="file" hidden onChange={async (e) => {
                                                const file = e.target.files[0];
                                                if (!file) return;
                                                const fd = new FormData();
                                                fd.append('file', file);
                                                const res = await fetch('/api/upload', { method: 'POST', body: fd });
                                                const data = await res.json();
                                                if (data.success) handleFormChange('url', data.url);
                                            }} />
                                        </label>
                                    </div>
                                </div>
                                <div className={styles.formGroup}>
                                    <label>الأيقونة</label>
                                    <select value={formData.icon} onChange={e => handleFormChange('icon', e.target.value)}>
                                        <option value="link">Link</option>
                                        <option value="book-open">Catalog</option>
                                        <option value="shopping-bag">Shopping Bag</option>
                                        <option value="message-circle">WhatsApp</option>
                                        <option value="map-pin">Map Pin</option>
                                    </select>
                                </div>
                                <div className={styles.formGroup}>
                                    <label>طريقة العرض</label>
                                    <select value={formData.display_style || 'icon'} onChange={e => handleFormChange('display_style', e.target.value)}>
                                        <option value="icon">مربع صغير (بدون اسم)</option>
                                        <option value="horizontal">مستطيل طويل (مع اسم)</option>
                                    </select>
                                </div>
                                {(formData.display_style === 'horizontal') && (
                                    <div className={styles.formGroup}>
                                        <label>وصف أو نص إضافي</label>
                                        <input
                                            type="text"
                                            value={formData.description || ''}
                                            onChange={e => handleFormChange('description', e.target.value)}
                                            placeholder="مثال: اطلع على قائمة منتجاتنا الكاملة"
                                        />
                                    </div>
                                )}
                                {formData.type === 'pdf' && (
                                    <div className={styles.formGroup}>
                                        <label>صورة الكاتلوج (اختياري)</label>
                                        <input type="file" accept="image/*" onChange={handleImageUpload} />
                                        {formData.image && (
                                            <div className={styles.imagePreview}>
                                                <img src={formData.image} alt="Preview" className={styles.preview} />
                                                <button 
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, image: null })}
                                                    className={styles.removeImageBtn}
                                                >
                                                    <X size={16} /> حذف
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                                {formData.type !== 'pdf' && (
                                    <div className={styles.formGroup}>
                                        <label>صورة الشعار (اختياري)</label>
                                        <input type="file" accept="image/*" onChange={handleImageUpload} />
                                        {formData.image && (
                                            <div className={styles.imagePreview}>
                                                <img src={formData.image} alt="Preview" className={styles.preview} />
                                                <button 
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, image: null })}
                                                    className={styles.removeImageBtn}
                                                >
                                                    <X size={16} /> حذف
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                                <div className={styles.actions}>
                                    <button onClick={handleSaveForm} className={styles.saveBtn}><Save size={16} /> حفظ</button>
                                    <button onClick={handleCancel} className={styles.cancelBtn}>إلغاء</button>
                                </div>
                            </div>
                        ) : (
                            <div className={styles.viewMode}>
                                <div className={styles.info}>
                                    <span className={styles.linkTitle}>{link.title || '(بدون عنوان)'}</span>
                                    <span className={styles.linkType}>
                                        {link.type} • {link.clicks || 0} نقرات
                                    </span>
                                </div>
                                <div className={styles.controls}>
                                    <button onClick={() => handleMove(index, 'up')} disabled={index === 0}><ArrowUp size={16} /></button>
                                    <button onClick={() => handleMove(index, 'down')} disabled={index === links.length - 1}><ArrowDown size={16} /></button>
                                    <button onClick={() => handleEdit(link)} className={styles.editBtn}>تعديل</button>
                                    <button onClick={() => handleDelete(link.id)} className={styles.deleteBtn}><Trash2 size={16} /></button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <button onClick={handleCreate} className={styles.addBtn}>
                <Plus size={20} /> إضافة رابط جديد
            </button>

            {showQr && (
                <div className={styles.modalOverlay} onClick={() => setShowQr(false)}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <button className={styles.closeBtn} onClick={() => setShowQr(false)}><X size={20} /></button>
                        <h3>QR Code للموقع</h3>
                        <img src={qrUrl} alt="QR Code" className={styles.qrImage} />
                        <a href={qrUrl} download="qr-code.png" className={styles.downloadBtn}>تنزيل الصورة</a>
                    </div>
                </div>
            )}
        </div>
    );
}
