"use client";

import Link from "next/link";

import styles from "./error.module.css";

export default function Error({
  reset,
}: {
  reset: () => void;
}) {
  return (
    <section className={styles.error} role="alert">
      <div className={styles.panel}>
        <p className={styles.code}>Dashboard error</p>
        <h1>Dashboard 加载失败</h1>
        <p className={styles.message}>数据暂时无法显示，请重试或返回 Dashboard 首页。</p>
        <div className={styles.actions}>
          <button type="button" onClick={reset}>
            重试
          </button>
          <Link href="/dashboard">返回 Dashboard</Link>
        </div>
      </div>
    </section>
  );
}
