import styles from "./loading.module.css";

export default function Loading() {
  return (
    <div className={styles.loading} role="status" aria-live="polite">
      <div className={styles.heading}>
        <span className={styles.title} />
        <span className={styles.subtitle} />
      </div>

      <div className={styles.stats}>
        <span className={styles.card} />
        <span className={styles.card} />
        <span className={styles.card} />
      </div>

      <section className={styles.activity}>
        <span className={styles.activityTitle} />
        <span className={styles.activityRow} />
        <span className={styles.activityRow} />
        <span className={styles.activityRow} />
      </section>

      <span className={styles.srOnly}>Loading dashboard...</span>
    </div>
  );
}
