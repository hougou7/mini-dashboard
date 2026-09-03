"use client";
import { useState } from "react";
import type { User } from "@/components/UserList/UserList";
import styles from "./UserManager.module.css";

type UserManagerProps = {
  initialUsers: User[];
  onUsersChange: (users: User[]) => void;
};

export default function UserManager({ initialUsers, onUsersChange }: UserManagerProps) {
    const users = initialUsers;

    const[name, setName] = useState("");
    const[email, setEmail] = useState("");
    function handleAddUser() {
        if(!name.trim() || !email.trim()) return;
        const newUser: User = {
            id: Math.max(0, ...users.map((user) => user.id)) + 1,
            name: name.trim(),
            email: email.trim(),
        }
        onUsersChange([...users, newUser]);
        setName("");
        setEmail("");
    }

    function handleDeleteUser(id: number) {
        onUsersChange(users.filter((user) => user.id !== id));
    }
    return (
        <div className={styles.manager}>
            <div className={styles.form}>
                <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)} 
                />
                <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)} 
                />
                <button type="button" onClick={handleAddUser}>Add User</button>
            </div>
            <p className={styles.total}>Total users: {users.length}</p>
            <div className={styles.list}>
                {users.map((user) => (
                    <div className={styles.item} key={user.id}>
                        <div>
                            <strong>{user.name}</strong>
                            <p>{user.email}</p>
                        </div>
                        <button type="button" onClick={() => handleDeleteUser(user.id)}>
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
