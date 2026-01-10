"use client";

import styles from './Header.module.css';
import { useEffect, useState } from 'react';

export default function Header() {
  const [headerImage, setHeaderImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
      } finally {
        setIsLoading(false);
      }
    };
    fetchConfig();
  }, []);

  return (
    <header className={styles.header}>
      {headerImage && (
        <img 
          src={headerImage} 
          alt="Header" 
          className={styles.headerImg}
        />
      )}
      {!headerImage && !isLoading && (
        <div className={styles.defaultHeader}>
          <div className={styles.logoText}>
            <span className={styles.brandName}>أطايب التمور</span>
            <span className={styles.brandSub}>Atayeb Altomor</span>
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
