// app/balance/[userId]/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // Update path if needed
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns"; // Recommended for date formatting

export default async function BalanceSummaryPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/api/auth/signin");

  const { userId: friendId } = await params;
  const currentUserId = session.user.id;

  // 1. Fetch Friend Details
  const friend = await prisma.user.findUnique({
    where: { id: friendId },
  });

  if (!friend) return <div>User not found</div>;

  // 2. Fetch Expenses involving BOTH users
  const expenses = await prisma.expense.findMany({
    where: {
      OR: [
        // Case A: I paid, Friend is in shares
        {
          payerId: currentUserId,
          shares: { some: { userId: friendId } },
        },
        // Case B: Friend paid, I am in shares
        {
          payerId: friendId,
          shares: { some: { userId: currentUserId } },
        },
      ],
    },
    include: {
      payer: true,
      shares: { include: { user: true } },
    },
    orderBy: { date: "desc" },
  });

  // 3. Fetch Payments directly between users
  const payments = await prisma.payment.findMany({
    where: {
      OR: [
        { senderId: currentUserId, receiverId: friendId },
        { senderId: friendId, receiverId: currentUserId },
      ],
    },
    include: { sender: true, receiver: true },
    orderBy: { date: "desc" },
  });

  // 4. Calculate Net Balance
  // We can reuse logic or calculate simply here since scope is limited
  let netBalance = 0; // Positive = They owe me

  expenses.forEach((exp) => {
    if (exp.payerId === currentUserId) {
      // I paid. Add what friend owes.
      const share = exp.shares.find((s) => s.userId === friendId);
      if (share) netBalance += share.amount;
    } else {
      // Friend paid. Subtract what I owe.
      const share = exp.shares.find((s) => s.userId === currentUserId);
      if (share) netBalance -= share.amount;
    }
  });

  payments.forEach((pay) => {
    if (pay.senderId === currentUserId) {
      // I paid them. Debt reduces (moves positive).
      netBalance += pay.amount;
    } else {
      // They paid me. Debt reduces (moves negative).
      netBalance -= pay.amount;
    }
  });

  // 5. Merge and Sort History
  const history = [
    ...expenses.map((e) => ({ ...e, type: "EXPENSE" as const })),
    ...payments.map((p) => ({ ...p, type: "PAYMENT" as const })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const isOwed = netBalance > 0;

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <Link href="/user" className="text-sm text-gray-500 hover:underline">
          &larr; Back to Dashboard
        </Link>
        <div className="flex justify-between items-end mt-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              {friend.name}
            </h1>
            <p className="text-gray-500 mt-1">Transaction History</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500 uppercase tracking-wide">
              Net Balance
            </p>
            <p
              className={`text-3xl font-bold ${
                netBalance === 0
                  ? "text-gray-400"
                  : isOwed
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {netBalance === 0
                ? "Settled"
                : `${isOwed ? "+" : "-"}$${Math.abs(netBalance).toFixed(2)}`}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-8">
        <button className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
          Settle Up
        </button>
      </div>

      {/* History List */}
      <div className="space-y-4">
        {history.map((item) => {
          const isExpense = item.type === "EXPENSE";
          
          return (
            <div
              key={`${item.type}-${item.id}`}
              className="flex justify-between items-center p-4 bg-white border border-gray-100 rounded-lg shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-xl
                  ${isExpense ? "bg-orange-100 text-orange-600" : "bg-green-100 text-green-600"}`}
                >
                  {isExpense ? "🧾" : "💸"}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">
                    {isExpense 
                      ? item.description 
                      : "Payment"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {isExpense
                      ? `${item.payerId === currentUserId ? "You" : friend.name} paid`
                      : `${item.senderId === currentUserId ? "You" : friend.name} sent money`}
                    {" • "}
                    {format(new Date(item.date), "MMM d, yyyy")}
                  </p>
                </div>
              </div>
              
              <div className="font-bold text-gray-700">
                ${item.amount.toFixed(2)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}