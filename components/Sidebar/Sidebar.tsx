"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import styles from "./Sidebar.module.css"

const SIDEBAR_STATE_KEY = "mini-dashboard.sidebar-open";

export default function Sidebar(){

    const [isopen, setIsopen] = useState(true);
    const [hasHydrated, setHasHydrated] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const hydrationTimer = window.setTimeout(() => {
            try {
                const savedState = window.localStorage.getItem(SIDEBAR_STATE_KEY);

                if (savedState !== null) {
                    setIsopen(savedState === "true");
                }
            } catch {
                // Storage may be unavailable in private browsing or with strict browser settings.
            } finally {
                setHasHydrated(true);
            }

        }, 0);

        return () => window.clearTimeout(hydrationTimer);
    }, []);

    useEffect(() => {
        if (!hasHydrated) {
            return;
        }

        try {
            window.localStorage.setItem(SIDEBAR_STATE_KEY, String(isopen));
        } catch {
            // Storage may be unavailable in private browsing or with strict browser settings.
        }
    }, [hasHydrated, isopen]);

    const links: { href: string; label: string; icon: ReactNode }[] = [
        {
            href: "/dashboard",
            label: "Dashboard",
            icon: (
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <rect x="4" y="4" width="6" height="6" rx="1" />
                    <rect x="14" y="4" width="6" height="6" rx="1" />
                    <rect x="4" y="14" width="6" height="6" rx="1" />
                    <rect x="14" y="14" width="6" height="6" rx="1" />
                </svg>
            ),
        },
        {
            href: "/dashboard/user",
            label: "Users",
            icon: (
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <circle cx="9" cy="8" r="3" />
                    <path d="M3.5 19c.7-3 2.6-4.5 5.5-4.5s4.8 1.5 5.5 4.5" />
                    <path d="M16 11a3 3 0 1 0 0-6" />
                    <path d="M16 14.5c2.5.2 4 1.7 4.5 4.5" />
                </svg>
            ),
        },
        {
            href: "/dashboard/orders",
            label: "Orders",
            icon: (
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path d="M6 4h12v16H6z" />
                    <path d="M9 4.5V3h6v1.5M9 9h6M9 13h6M9 17h4" />
                </svg>
            ),
        },
        {
            href: "/dashboard/settings",
            label: "Settings",
            icon: (
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path d="M12 3.5 13.4 5a7.8 7.8 0 0 1 2.1.9l2-.3 1.7 1.7-.3 2a7.8 7.8 0 0 1 .9 2.1l1.5 1.4v2.4l-1.5 1.4a7.8 7.8 0 0 1-.9 2.1l.3 2-1.7 1.7-2-.3a7.8 7.8 0 0 1-2.1.9L12 20.5l-2.1-1.4a7.8 7.8 0 0 1-2.1-.9l-2 .3-1.7-1.7.3-2a7.8 7.8 0 0 1-.9-2.1L2 11.3V8.9l1.5-1.4a7.8 7.8 0 0 1 .9-2.1l-.3-2 1.7-1.7 2 .3a7.8 7.8 0 0 1 2.1-.9L12 3.5Z" />
                    <circle cx="12" cy="12.1" r="2.7" />
                </svg>
            ),
        },
    ];

    return(
        <aside
            className={`${styles.sidebar} ${isopen ? styles.open : styles.closed} ${!hasHydrated ? styles.hydrating : ""}`}
        >
            <button
            type="button"
            className={styles.toggle}
            aria-label={isopen ? "Collapse sidebar" : "Expand sidebar"}
            aria-expanded={isopen}
            onClick={() => setIsopen((isExpanded) => !isExpanded)}
            >
                ☰
            </button>    
            
            <nav className={styles.nav}>
                {links.map((link) => (
                    <Link
                        href={link.href}
                        key={link.href}
                        className={pathname === link.href ? styles.active : undefined}
                        aria-label={!isopen ? link.label : undefined}
                        title={!isopen ? link.label : undefined}
                    >
                        <span className={styles.icon}>{link.icon}</span>
                        <span className={styles.label}>{link.label}</span>
                    </Link>
                ))}
            </nav>
        </aside>
    )
}
