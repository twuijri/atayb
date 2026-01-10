"use client";

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { BookOpen, MapPin, ShoppingBag, MessageCircle, Link as LinkIcon, Download, ArrowLeft } from 'lucide-react';
import styles from './LinkItem.module.css';

const IconMap = {
    'book-open': BookOpen,
    'map-pin': MapPin,
    'shopping-bag': ShoppingBag,
    'message-circle': MessageCircle,
    'link': LinkIcon,
};

export default function LinkItem({ link }) {
    const { id, title, type, url, icon, image, display_style, description } = link;
    const router = useRouter();
    const IconComponent = IconMap[icon] || LinkIcon;

    const showTitle = !!title && title.trim().length > 0;
    const isCatalog = type === 'pdf';
    const isShoppingLink = type === 'link';
    
    // If link has display_style = 'horizontal', show as horizontal card
    const showHorizontal = display_style === 'horizontal';

    const handleClick = (e) => {
        // Track the click reliably
        const data = JSON.stringify({ type: 'click', linkId: id });
        if (navigator.sendBeacon) {
            navigator.sendBeacon('/api/track', data);
        } else {
            fetch('/api/track', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: data,
                keepalive: true
            });
        }

        // Handle routing logic based on type
        if (type === 'pdf') {
            e.preventDefault();
            
            // Detect if on Android
            const isAndroid = /Android/i.test(navigator.userAgent);
            
            if (isAndroid) {
                // Android: open in new tab (native PDF viewer)
                window.open(url, '_blank');
            } else {
                // iOS/Desktop: use viewer page with controls
                router.push(`/viewer?url=${encodeURIComponent(url)}`);
            }
        }
        // Normal links and whatsapp handle themselves via <a> default behavior
    };

    // Catalog card - full width with text and optional image
    if (isCatalog && !showHorizontal) {
        return (
            <a
                href={url}
                onClick={handleClick}
                target="_self"
                rel="noopener noreferrer"
                className={styles.catalogCard}
                title={title}
            >
                <div className={styles.catalogContent}>
                    <div className={styles.catalogIcon}>
                        {image ? (
                            <div style={{ position: 'relative', width: '56px', height: '56px' }}>
                                <Image
                                    src={image}
                                    alt={title || 'catalog'}
                                    fill
                                    style={{ objectFit: 'contain' }}
                                />
                            </div>
                        ) : (
                            icon === 'book-open' && <BookOpen size={32} color="#C6A87C" strokeWidth={1.5} />
                        )}
                    </div>
                    <div className={styles.catalogText}>
                        <h2 className={styles.catalogTitle}>{title}</h2>
                        <p className={styles.catalogDesc}>اطلع على قائمة منتجاتنا الكاملة</p>
                    </div>
                    <div className={styles.catalogArrow}>
                        <ArrowLeft size={20} color="#C6A87C" />
                    </div>
                </div>
            </a>
        );
    }

    // Horizontal card - for links with display_style = 'horizontal'
    if (showHorizontal) {
        return (
            <a
                href={url}
                onClick={handleClick}
                target={type === 'pdf' ? '_self' : '_blank'}
                rel="noopener noreferrer"
                className={`${styles.catalogCard} ${styles.horizontalCard}`}
                title={title}
            >
                <div className={styles.catalogContent}>
                    <div className={styles.catalogIcon}>
                        {image ? (
                            <div style={{ position: 'relative', width: '56px', height: '56px' }}>
                                <Image
                                    src={image}
                                    alt={title || 'link'}
                                    fill
                                    style={{ objectFit: 'contain' }}
                                />
                            </div>
                        ) : (
                            <IconComponent size={32} color="#C6A87C" strokeWidth={1.5} />
                        )}
                    </div>
                    <div className={styles.catalogText}>
                        <h2 className={styles.catalogTitle}>{title}</h2>
                        <p className={styles.catalogDesc}>{description || (type === 'whatsapp' ? 'تواصل معنا' : 'عرض المزيد')}</p>
                    </div>
                    <div className={styles.catalogArrow}>
                        <ArrowLeft size={20} color="#C6A87C" />
                    </div>
                </div>
            </a>
        );
    }

    // Shopping links - icon only (no text)
    if (isShoppingLink) {
        return (
            <a
                href={url}
                onClick={handleClick}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.iconOnlyCard}
                title={title}
            >
                <div className={styles.iconOnlyContent}>
                    {image ? (
                        <div className={styles.iconImageContainer}>
                            <Image
                                src={image}
                                alt={title || 'icon'}
                                fill
                                style={{ objectFit: 'contain' }}
                                className={styles.iconLogo}
                            />
                        </div>
                    ) : (
                        <IconComponent size={40} color="#C6A87C" />
                    )}
                </div>
            </a>
        );
    }

    // WhatsApp and other links - icon only
    return (
        <a
            href={url}
            onClick={handleClick}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.iconOnlyCard}
            title={title}
        >
            <div className={styles.iconOnlyContent}>
                {image ? (
                    <div className={styles.iconImageContainer}>
                        <Image
                            src={image}
                            alt={title || 'icon'}
                            fill
                            style={{ objectFit: 'contain' }}
                            className={styles.iconLogo}
                        />
                    </div>
                ) : (
                    <IconComponent size={40} color="#C6A87C" />
                )}
            </div>
        </a>
    );
}
