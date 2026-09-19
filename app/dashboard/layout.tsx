import styles from "./dashbordlayout.module.css"
import Sidebar from "@/components/Sidebar/Sidebar"
import Header from "@/components/Header/Header"
import QueryProvider from "@/components/QueryProvider/QueryProvider"

export default function DashboardLayout({
    children,
}:{
    children: React.ReactNode;
}){
    return(
        <QueryProvider>
            <div className={styles.layout}>
                <Sidebar />
                <div className={styles.content}>
                    <Header />
                    <main className={styles.main}>
                        {children}
                    </main>
                </div>
            </div>
        </QueryProvider>
    );
}
