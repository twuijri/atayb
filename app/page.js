import Header from '@/components/Header';
import LinkItem from '@/components/LinkItem';
import PageTracker from '@/components/PageTracker';
import styles from './page.module.css';
import { supabaseServer } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

async function getLinks() {
  try {
    const { data, error } = await supabaseServer
      .from('links')
      .select('*')
      .order('order');
    
    if (error) {
      console.error("Error reading links from Supabase:", error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Error fetching links:", error);
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
