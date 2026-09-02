import styles from "./dashbordlayout.module.css"
import Sidebar from "@/components/Sidebar/Sidebar"
import Header from "@/components/Header/Header"

export default function DashboardLayout({
    children,
}:{
    children: React.ReactNode;
}){
    return(
        <div className={styles.layout}>
            <Sidebar />
            <div className={styles.content}>
                <Header />
                <main className={styles.main}>
                    {children}
                </main>
            </div>
        </div>
    );
}