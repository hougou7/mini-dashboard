"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import styles from "./Sidebar.module.css"

export default function Sidebar(){

    const [isopen, setIsopen] = useState(true);
    const pathname = usePathname();

    const links = [
        { href: "/dashboard", label: "Dashboard" },
        { href: "/dashboard/user", label: "Users" },
        { href: "/dashboard/orders", label: "Orders" },
        { href: "/dashboard/settings", label: "Settings" },
    ];

    return(
        <aside className={`${styles.sidebar} ${isopen ? styles.open : styles.closed}`}>
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
                    >
                        {link.label}
                    </Link>
                ))}
            </nav>
        </aside>
    )
}
