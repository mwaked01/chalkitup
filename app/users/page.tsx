import { getUsers } from "@/lib/users";
import UserCard from "@/components/UserCard";

export default async function PostsPage() {
  const users = await getUsers();

  return (
    <div>
      <h2>Users</h2>
      <div style={{ display: "grid", gap: 12 }}>
        {users.map((p) => (
          <UserCard key={p.id} user={p} />
        ))}
      </div>
    </div>
  );
}
