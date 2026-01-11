"use client";

import styles from './Header.module.css';
import { useEffect, useState } from 'react';

export default function Header() {
  const [headerImage, setHeaderImage] = useState(null);
  const [siteTitle, setSiteTitle] = useState('Link Manager');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch('/api/config');
        const config = await res.json();
        if (config.logo) {
          setHeaderImage(config.logo);
        }
        if (config.siteTitle) {
          setSiteTitle(config.siteTitle);
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
            <span className={styles.brandName}>{siteTitle}</span>
          </div>

          <div className={styles.decorativeLine}></div>

          <div className={styles.taglineContainer}>
            <p className={styles.mainTagline}>Link Management System</p>
            <p className={styles.contactTagline}>Professional QR & Link Sharing</p>
          </div>
        </div>
      )}
    </header>
  );
}
