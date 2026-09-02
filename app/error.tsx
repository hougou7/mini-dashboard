"use client";

import Link from "next/link";

import styles from "./error.module.css";

export default function Error({
  reset,
}: {
  reset: () => void;
}) {
  return (
    <main className={styles.error} role="alert">
      <div className={styles.panel}>
        <p className={styles.eyebrow}>Something went wrong</p>
        <h1>页面加载失败</h1>
        <p className={styles.message}>暂时无法显示此页面，请重试。</p>
        <div className={styles.actions}>
          <button type="button" onClick={reset}>
            重试
          </button>
          <Link href="/">返回首页</Link>
        </div>
      </div>
    </main>
  );
}
