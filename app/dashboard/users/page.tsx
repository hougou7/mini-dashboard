import { listUsers } from "@/app/api/users/store";
import UserSection from "@/components/UserSection/UserSection";
import { USER_PAGE_SIZE } from "@/types/user";

import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export default function UsersPage() {
  const initialPage = listUsers({ search: "", page: 1, pageSize: USER_PAGE_SIZE });

  return (
    <div className={styles.page}>
      <div className={styles.heading}>
        <h1>All users</h1>
        <code>queryKey: [&quot;users&quot;, &quot;list&quot;, params]</code>
      </div>
      <UserSection initialPage={initialPage} />
    </div>
  );
}
