"use client";

import styles from './Header.module.css';
import { useEffect, useState } from 'react';

export default function Header() {
  const [logoUrl, setLogoUrl] = useState(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch('/api/config');
        const config = await res.json();
        if (config.logo) {
          setLogoUrl(config.logo);
        }
      } catch (error) {
        console.error('Error fetching config:', error);
      }
    };
    fetchConfig();
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.logoContainer}>
          <div className={styles.logoIcon}>
            {logoUrl ? (
              <img src={logoUrl} alt="أطايب التمور" style={{ width: '70px', height: '70px', objectFit: 'contain' }} />
            ) : (
              <svg width="70" height="70" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Outer circle - Light beige */}
                <circle cx="50" cy="50" r="48" fill="#E8DDD1"/>
                
                {/* Middle circle - Lighter beige */}
                <circle cx="50" cy="50" r="40" fill="#F0E8E0"/>
                
                {/* Top diamond - Light brown */}
                <path d="M50 25 L65 40 L50 45 L35 40 Z" fill="#A89080"/>
                
                {/* Bottom diamond - Dark brown */}
                <path d="M50 55 L65 60 L50 75 L35 60 Z" fill="#3D3D3D"/>
                
                {/* Left circle dot */}
                <circle cx="25" cy="50" r="4" fill="#8B7D75"/>
                
                {/* Right circle dot */}
                <circle cx="75" cy="50" r="4" fill="#8B7D75"/>
              </svg>
            )}
          </div>
          
          <div className={styles.logoText}>
            <span className={styles.brandName}>أطايب التمور</span>
            <span className={styles.brandSub}>Atayeb Altomor</span>
          </div>
        </div>

        <div className={styles.decorativeLine}></div>

        <div className={styles.taglineContainer}>
          <p className={styles.mainTagline}>وصرنا بين أهلنا في قطر</p>
          <p className={styles.contactTagline}>لطلب الكميات التواصل على الرقم 71777515</p>
        </div>
      </div>
      <div className={styles.headerGlow}></div>
    </header>
  );
}
