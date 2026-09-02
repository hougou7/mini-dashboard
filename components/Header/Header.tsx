"use client"

import { useState } from "react"
import Link from "next/link"

import styles from "./Header.module.css"

export default function Header(){

    const [showNotification, setNotification] = useState(false);
    const [showProfile, setShowProfile] = useState(false);

    const toggleNotifications = () => {
        setNotification((isVisible) => !isVisible);
        setShowProfile(false);
    };

    const toggleProfile = () => {
        setShowProfile((isVisible) => !isVisible);
        setNotification(false);
    };

    return(
        <header className={styles.header}>
            <h1>Dashboard</h1>

            <div className={styles.actions}>
                <button
                    type="button"
                    aria-label="Notifications"
                    aria-expanded={showNotification}
                    onClick={toggleNotifications}
                >🔔</button>
                {showNotification&&(
                    <div className={styles.notificationPanel}>
                        <strong>Notifications</strong>
                        <p>You have 3 new notifications.</p>
                    </div>
                )}
                <button
                    type="button"
                    aria-label="Account menu"
                    aria-expanded={showProfile}
                    onClick={toggleProfile}
                >👤</button>
                {showProfile && (
                    <div className={styles.profilePanel}>
                        <strong>Account</strong>
                        <Link href="/dashboard/user">View users</Link>
                    </div>
                )}
            </div>
        </header>
    )
}
