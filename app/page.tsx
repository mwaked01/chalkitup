import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>Welcome</h1>
      <p>
        This app demonstrates fetching posts from an external API and storing
        them in Postgres using Prisma.
      </p>
      <p>
        <Link href="/users">View Users</Link>
      </p>
    </div>
  );
}
