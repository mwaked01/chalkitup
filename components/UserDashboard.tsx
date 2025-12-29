import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { createGroup } from "./actions";
import Group from "@/app/group/[id]/page";
import GroupList from "./userDashboard/GroupList";
type UserDashboardProps = {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
  };
};

export default async function UserDashboard({ user}: UserDashboardProps) {



  
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Welcome, {user.name}</h1>
      <GroupList userId={user.id} />
      {/* 
      <form action={async (formData) => {
        'use server';
        await createGroup(formData.get('name') as string);
      }} className="flex gap-2 mb-8">
        <input name="name" placeholder="New Group Name" className="border p-2 rounded" required />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Create Group</button>
      </form>

      <div className="grid gap-4">
        {groups.map(group => {
          // Simple logic: Am I owed money or do I owe?
          // (Detailed calc is complex, simpler version here)
          const myId = session.user.id;
          let netBalance = 0;

          // 1. Expenses I paid (people owe me)
          group.expenses.filter(e => e.payerId === myId).forEach(e => {
            // Sum of shares of OTHERS
            e.shares.forEach(s => {
               if(s.userId !== myId) netBalance += s.amount;
            });
          });

          // 2. Expenses others paid (I owe them)
          group.expenses.filter(e => e.payerId !== myId).forEach(e => {
            const myShare = e.shares.find(s => s.userId === myId);
            if(myShare) netBalance -= myShare.amount;
          });
          
          // 3. Payments logic omitted here for brevity, included in Detail view
          
          return (
            <Link key={group.id} href={`/groups/${group.id}`} className="block border p-4 rounded hover:bg-gray-50">
              <div className="flex justify-between">
                <span className="font-semibold">{group.name}</span>
                <span className={netBalance >= 0 ? "text-green-600" : "text-red-600"}>
                  {netBalance >= 0 ? `You are owed $${netBalance.toFixed(2)}` : `You owe $${Math.abs(netBalance).toFixed(2)}`}
                </span>
              </div>
            </Link>
          );
        })}
      </div> */}
    </div>
  );
}