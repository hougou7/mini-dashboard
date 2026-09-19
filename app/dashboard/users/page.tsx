import { listUsers } from "@/app/api/users/store";
import UserSection from "@/components/UserSection/UserSection";

import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export default function UsersPage() {
  const users = listUsers();

  return (
    <div className={styles.page}>
      <div className={styles.heading}>
        <h1>All users</h1>
        <code>queryKey: [&quot;users&quot;]</code>
      </div>
      <UserSection initialUsers={users} />
    </div>
  );
}
