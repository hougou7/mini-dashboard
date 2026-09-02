import styles from "./loading.module.css";

export default function Loading() {
  return (
    <main className={styles.loading} role="status" aria-live="polite">
      <span className={styles.spinner} aria-hidden="true" />
      <span className={styles.label}>Loading...</span>
    </main>
  );
}
