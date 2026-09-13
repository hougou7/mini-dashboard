import UserSection from "@/components/UserSection/UserSection";
import type { User } from "@/components/UserList/UserList";
import { listUsers } from "@/app/api/users/store";

import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export default function UserPage(){
    const users: User[] = listUsers();

    return(
        <div className={styles.page}>
            <h1>Users</h1>

            <UserSection initialUsers={users} />
        </div>
    );
}
