import Chat from '@/components/Chat';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <div className={styles.logoDot}></div>
          Max · Asistente de Ventas
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.hero}>
          <h1 className={styles.title}>Tu asesor de autos, disponible 24/7</h1>
          <p className={styles.subtitle}>
            Cuéntame qué buscas y te conecto con tu asesor para cerrar el trato.
          </p>
        </div>
        
        <div className={styles.chatWrapper}>
          <Chat />
        </div>
      </main>

      <footer className={styles.footer}>
        Demo — Arroyo
      </footer>
    </div>
  );
}
