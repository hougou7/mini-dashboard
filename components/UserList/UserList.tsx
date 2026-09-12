import type { ReactNode } from "react";

import styles from "./UserList.module.css";

export type User = {
  id: number;
  name: string;
  email: string;
};

type UserListProps = {
  users: User[];
  searchQuery?: string;
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
  isMutating?: boolean;
};

function HighlightedText({ text, query }: { text: string; query: string }): ReactNode {
  if (!query) {
    return text;
  }

  const parts: ReactNode[] = [];
  const normalizedText = text.toLowerCase();
  const normalizedQuery = query.toLowerCase();
  let currentIndex = 0;
  let matchIndex = normalizedText.indexOf(normalizedQuery, currentIndex);

  while (matchIndex !== -1) {
    if (matchIndex > currentIndex) {
      parts.push(text.slice(currentIndex, matchIndex));
    }

    parts.push(
      <strong key={`${matchIndex}-${query}`}>
        {text.slice(matchIndex, matchIndex + query.length)}
      </strong>,
    );
    currentIndex = matchIndex + query.length;
    matchIndex = normalizedText.indexOf(normalizedQuery, currentIndex);
  }

  if (currentIndex < text.length) {
    parts.push(text.slice(currentIndex));
  }

  return parts.length > 0 ? parts : text;
}

export default function UserList({
  users,
  searchQuery = "",
  onEdit,
  onDelete,
  isMutating = false,
}: UserListProps) {
  return (
    <ul className={styles.list}>
      {users.map((user) => (
        <li className={styles.item} key={user.id}>
          <div className={styles.userDetails}>
            <strong><HighlightedText text={user.name} query={searchQuery} /></strong>
            <span><HighlightedText text={user.email} query={searchQuery} /></span>
          </div>
          {(onEdit || onDelete) && (
            <div className={styles.actions}>
              {onEdit && <button type="button" onClick={() => onEdit(user)}>Edit</button>}
              {onDelete && (
                <button type="button" onClick={() => onDelete(user)} disabled={isMutating}>
                  Delete
                </button>
              )}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
