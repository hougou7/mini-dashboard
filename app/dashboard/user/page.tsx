import UserSection from "@/components/UserSection/UserSection";
import type { User } from "@/components/UserList/UserList";

import styles from "./page.module.css";

async function getUsers(): Promise<User[]> {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");

    if (!response.ok) {
        throw new Error("Failed to fetch users");
    }

    return (await response.json()) as User[];
}

export default async function UserPage(){
    const users = await getUsers();

    return(
        <div className={styles.page}>
            <h1>Users</h1>

            <UserSection initialUsers={users} />
        </div>
    );
}
