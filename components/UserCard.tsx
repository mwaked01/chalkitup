type User = {
  id: string;
  name: string;
  email: string;
  createdAt?: string | Date;
};

type Props = {
  user: User;
};


export default function PostCard({ user }: Props) {
  const created = user.createdAt ? new Date(user.createdAt).toLocaleString() : "";

  return (
    <article style={{ border: "1px solid #ddd", padding: 12, borderRadius: 6 }}>
      <h3 style={{ margin: 0 }}>{user.name}</h3>
      <p style={{ margin: "8px 0", color: "#333" }}>{user.email}</p>
      <small style={{ color: "#666" }}>
        #{user.id} • user {user.id} {created && `• ${created}`}
      </small>
    </article>
  );
}