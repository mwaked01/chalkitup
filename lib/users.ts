import { prisma } from "./prisma";

// export type ExternalPost = {
//   userId: number;
//   id: number;
//   title: string;
//   body: string;
// };

// export async function fetchExternalPosts(): Promise<ExternalPost[]> {
//   const res = await fetch("https://jsonplaceholder.typicode.com/posts");
//   const data = (await res.json()) as ExternalPost[];
//   return data;
// }

// export async function saveExternalPosts(posts: ExternalPost[]) {
//   // createMany with skipDuplicates is efficient
//   const mapped = posts.map((p) => ({
//     remoteId: p.id,
//     userId: p.userId,
//     title: p.title,
//     body: p.body,
//   }));

//   // use createMany to batch insert
//   const result = await prisma.post.createMany({
//     data: mapped,
//     skipDuplicates: true,
//   });

//   return result.count;
// }

export async function getUsers() {
  return prisma.user.findMany({ orderBy: { id: "desc" }, take: 100 });
}

export async function createPost(payload: {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}) {
  return prisma.user.create({
    data: {
      id: String(payload.id),
      name: payload.name,
      email: payload.email,
      createdAt: payload.createdAt,
    },
  });
}
