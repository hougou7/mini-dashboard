import styles from "./ActivityList.module.css";

const activities = [
  {
    user: "Alice",
    action: "Logged in",
    time: "2 minutes ago",
  },
  {
    user: "Bob",
    action: "Purchased a product",
    time: "10 minutes ago",
  },
  {
    user: "Tom",
    action: "Created an account",
    time: "30 minutes ago",
  },
];

export default function ActivityList() {
  return (
    <div className={styles.list}>
      {activities.map((activity) => (
        <div className={styles.item} key={activity.user}>
          <div>
            <strong>{activity.user}</strong>
            <span>{activity.action}</span>
          </div>

          <time>{activity.time}</time>
        </div>
      ))}
    </div>
  );
}