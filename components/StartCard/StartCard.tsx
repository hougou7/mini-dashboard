import styles from "./StartCard.module.css"

type StartCardProps = {
    title : string;
    value : string;
}

export default function StartCard({
    title,
    value,
}:StartCardProps){
    return(
        <div className={styles.card}>
                <p className={styles.title}>{title}</p>
                <p className={styles.value}>{value}</p>
        </div>
    )
}