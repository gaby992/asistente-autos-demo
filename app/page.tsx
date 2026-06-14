import Chat from '@/components/Chat';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.chatWrapper}>
          <Chat />
        </div>
      </main>
    </div>
  );
}
