"use client";

import { useSearchParams } from 'next/navigation';
import { Download, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';
import styles from './viewer.module.css';

function ViewerContent() {
    const searchParams = useSearchParams();
    const url = searchParams.get('url');

    if (!url) return <div className={styles.error}>لم يتم تحديد ملف للعرض</div>;

    return (
        <>
            <header className={styles.header}>
                <Link href="/" className={styles.backBtn}>
                    <ArrowLeft size={20} />
                    عودة
                </Link>
                <div className={styles.title}>عرض الملف</div>
                <a href={url} download className={styles.downloadBtn}>
                    <Download size={20} />
                    تحميل
                </a>
            </header>
            <div className={styles.frameContainer}>
                <object
                    data={url}
                    type="application/pdf"
                    className={styles.object}
                    title="PDF Viewer"
                >
                    <embed
                        src={url}
                        type="application/pdf"
                        className={styles.embed}
                    />
                </object>
            </div>
        </>
    );
}

export default function PdfViewer() {
    return (
        <div className={styles.container}>
            <Suspense fallback={<div className={styles.loading}>جاري التحميل...</div>}>
                <ViewerContent />
            </Suspense>
        </div>
    );
}
