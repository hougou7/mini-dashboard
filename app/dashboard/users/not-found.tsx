import Link from "next/link";

import styles from "../error.module.css";

export default function NotFound() {
  return (
    <section className={styles.error}>
      <div className={styles.panel}>
        <p className={styles.code}>404</p>
        <h1>User not found</h1>
        <p className={styles.message}>The requested user does not exist.</p>
        <div className={styles.actions}><Link href="/dashboard/users">Back to all users</Link></div>
      </div>
    </section>
  );
}
