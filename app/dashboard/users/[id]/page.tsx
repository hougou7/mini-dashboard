import { notFound } from "next/navigation";

import { getUser } from "@/app/api/users/store";
import UserDetails from "@/components/UserDetails/UserDetails";

export const dynamic = "force-dynamic";

export default async function UserDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const userId = Number(id);
  if (!Number.isInteger(userId) || userId <= 0) notFound();

  const user = getUser(userId);
  if (!user) notFound();

  return <UserDetails initialUser={user} userId={userId} />;
}
