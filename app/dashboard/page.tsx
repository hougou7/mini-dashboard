import StatCard from "@/components/StartCard/StartCard";

import styles from "./page.module.css";

export default function DashboardPage() {
  return (
    <div>
      <div className={styles.heading}>
        <h1>Dashboard</h1>

        <p>
          Overview of your application.
        </p>
      </div>

      <div className={styles.stats}>
        <StatCard
          title="Users"
          value="1,248"
        />

        <StatCard
          title="Orders"
          value="356"
        />

        <StatCard
          title="Revenue"
          value="$12,480"
        />
      </div>

      <section className={styles.activity}>
        <h2>Recent Activity</h2>

        <ul>
          <li>Alice logged in</li>
          <li>Bob purchased a product</li>
          <li>Tom created an account</li>
        </ul>
      </section>
    </div>
  );
}
