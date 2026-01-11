import Header from '@/components/Header';
import LinkItem from '@/components/LinkItem';
import PageTracker from '@/components/PageTracker';
import styles from './page.module.css';
import getDatabase from '@/lib/database';

export const dynamic = 'force-dynamic';

async function getLinks() {
  try {
    const db = getDatabase();
    const links = db.prepare('SELECT * FROM links WHERE is_active = 1 ORDER BY display_order ASC').all();
    return links;
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

export default async function Home() {
  const links = await getLinks();

  // Separate links by type and display style
  const catalogLinks = links.filter(link => link.type === 'pdf' && link.display_style !== 'horizontal');
  const horizontalLinks = links.filter(link => link.display_style === 'horizontal');
  const iconLinks = links.filter(link => link.type !== 'pdf' && link.display_style !== 'horizontal');

  return (
    <>
      <PageTracker />
      <div className={styles.container}>
        <Header />
        <main className={styles.main}>
          {/* Horizontal Cards Section - Full Width */}
          {horizontalLinks.length > 0 && (
            <div className={styles.catalogSection}>
              {horizontalLinks.map((link) => (
                <LinkItem key={link.id} link={link} />
              ))}
            </div>
          )}

          {/* Catalog Section - Full Width for PDF Cards */}
          {catalogLinks.length > 0 && (
            <div className={styles.catalogSection}>
              {catalogLinks.map((link) => (
                <LinkItem key={link.id} link={link} />
              ))}
            </div>
          )}

          {/* Icon Links Section - Grid Layout */}
          {iconLinks.length > 0 && (
            <div className={styles.linksSection}>
              <div className={styles.iconsGrid}>
                {iconLinks.map((link) => (
                  <LinkItem key={link.id} link={link} />
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
