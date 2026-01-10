import Header from '@/components/Header';
import LinkItem from '@/components/LinkItem';
import PageTracker from '@/components/PageTracker';
import styles from './page.module.css';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

async function getLinks() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'links.json');
    if (!fs.existsSync(filePath)) return [];
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error("Error reading links:", error);
    return [];
  }
}

export default async function Home() {
  const links = await getLinks();

  // Separate catalog PDFs from other links
  const catalogLinks = links.filter(link => link.type === 'pdf');
  const otherLinks = links.filter(link => link.type !== 'pdf');

  return (
    <>
      <PageTracker />
      <div className={styles.container}>
        <Header />
        <main className={styles.main}>
          {/* Catalog Section - Full Width for all PDFs */}
          {catalogLinks.length > 0 && (
            <div className={styles.catalogSection}>
              {catalogLinks.map((link) => (
                <LinkItem key={link.id} link={link} />
              ))}
            </div>
          )}

          {/* Other Links Section - Grid Layout */}
          {otherLinks.length > 0 && (
            <div className={styles.linksSection}>
              <div className={styles.iconsGrid}>
                {otherLinks.map((link) => (
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
