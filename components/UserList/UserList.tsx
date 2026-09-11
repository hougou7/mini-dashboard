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

export default function UserList({ users, searchQuery = "" }: UserListProps) {
  return (
    <ul className={styles.list}>
      {users.map((user) => (
        <li className={styles.item} key={user.id}>
          <span><HighlightedText text={user.name} query={searchQuery} /></span>
          <span><HighlightedText text={user.email} query={searchQuery} /></span>
        </li>
      ))}
    </ul>
  );
}
