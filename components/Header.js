"use client";

import styles from './Header.module.css';
import { useEffect, useState } from 'react';

export default function Header() {
  const [headerImage, setHeaderImage] = useState(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch('/api/config');
        const config = await res.json();
        if (config.logo) {
          setHeaderImage(config.logo);
        }
      } catch (error) {
        console.error('Error fetching config:', error);
      }
    };
    fetchConfig();
  }, []);

  return (
    <header 
      className={styles.header}
      style={headerImage ? { backgroundImage: `url(${headerImage})` } : {}}
    >
      {!headerImage && (
        <div className={styles.headerContent}>
          <div className={styles.logoContainer}>
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
      )}
    </header>
  );
}
