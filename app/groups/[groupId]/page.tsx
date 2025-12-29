import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { GroupWithDetails } from "../../../types/groupQuery";
import { groupWithDetails } from "../../../types/groupQuery";
import { User, DollarSign, Users, Calendar } from "lucide-react";

// Utility placeholder (assumed to be imported or defined here)
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};
const formatDate = (date: Date) => date.toLocaleDateString();
const getMemberNames = (group: GroupWithDetails, currentUserId: string) => {
  return group.members
    .map((m) => (m.id === currentUserId ? "You" : m.name))
    .join(", ");
};

const getPayerName = (group: GroupWithDetails, PayerId: string) => {
  return group.members.map((m) => m.id === PayerId && m.name);
};

interface GroupDetailsProps {
  params: Promise<{
    groupId: string;
  }>;
}

export default async function GroupDetails({ params }: GroupDetailsProps) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return redirect("/"); // or return <p>Please log in</p>
  }
  const { groupId } = await params;
  const group = await prisma.group.findFirst({
    where: {
      id: groupId, // 1. Must match the URL ID
      members: {
        some: {
          id: session.user.id, // 2. AND must have the current user as a member
        },
      },
    },
    ...groupWithDetails, // Include expenses/payments logic
  });

  // If the group doesn't exist OR the user isn't a member, 'group' will be null.
  if (!group) {
    // Securely handle unauthorized access.
    // Using notFound() is often better than redirecting because it doesn't
    // leak whether the group exists or not.
    return notFound();
  }
  const totalExpenses = group.expenses.reduce(
    (sum, exp) => sum + exp.amount,
    0
  );
  const isOwed = totalExpenses > 0; // Simplified
  const balanceAmount = 50.0; //
  const sortedExpenses = [...group.expenses].sort(
    (a, b) => b.date.getTime() - a.date.getTime()
  );

  return (
    <div className="min-h-screen  pb-12">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold text-gray-900">
            {group.name}
          </h1>
          <p className="text-sm text-gray-500 mt-1 flex items-center">
            <Users className="w-4 h-4 mr-2" />
            Members: {getMemberNames(group, session.user.id)}
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto mt-8 px-4 sm:px-6 lg:px-8">
        {/* 1. Summary Card */}
        <section className="bg-white shadow-lg rounded-xl overflow-hidden mb-8">
          <div
            className={`p-6 flex justify-between items-center ${
              isOwed ? "bg-green-50" : "bg-red-50"
            }`}
          >
            <div>
              <p className="text-sm font-medium text-gray-600">
                Your Group Balance
              </p>
              <h2
                className={`text-4xl font-bold ${
                  isOwed ? "text-green-600" : "text-red-600"
                }`}
              >
                {isOwed
                  ? formatCurrency(balanceAmount)
                  : `-${formatCurrency(balanceAmount)}`}
              </h2>
              <p className="text-sm mt-1">
                {isOwed ? "You are owed" : "You owe"} from this group.
              </p>
            </div>
            <div className="space-y-2">
              <button className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow transition">
                <DollarSign className="inline w-4 h-4 mr-2" /> Add Expense
              </button>
              <button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow transition">
                Pay Up
              </button>
            </div>
          </div>
        </section>

        {/* 2. Expenses and Activity Tabs (simplified for display) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Activity Column */}
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
              Group Activity ({group.expenses.length} Expenses)
            </h3>
            <div className="space-y-4">
              {sortedExpenses.map((expense) => {
                const userShare = expense.shares.find(
                  (s) => s.userId === session.user.id
                );
                return (
                  <div
                    key={expense.id}
                    className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition border border-gray-100"
                  >
                    <div className="flex justify-between items-center">
                      <p className="text-lg font-semibold text-gray-800">
                        {expense.description}
                      </p>
                      <p className="text-xl font-bold text-red-600">
                        {formatCurrency(expense.amount)}
                      </p>
                    </div>

                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <p className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        Paid by:{" "}
                        {expense.payerId === session.user.id
                          ? "You"
                          : getPayerName(group, expense.payerId)}
                      </p>
                      <p className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(expense.date)}
                      </p>
                    </div>

                    {expense.payerId !== session.user.id && (
                      <p className="text-xs text-gray-400 mt-2">
                       You owe: {userShare  && userShare.amount > 0 && formatCurrency(userShare.amount)}
                      </p>
                      
                    )}

                    <p className="text-xs text-gray-400 mt-2">
                      Shares: {expense.shares.length} people involved.
                    </p>
                  </div>
                );
              })}

              {/* List payments (simplified) */}
              {group.payments.map((payment) => (
                <div
                  key={payment.id}
                  className="bg-blue-50 p-4 rounded-lg shadow-sm border border-blue-200"
                >
                  <p className="text-md font-medium text-blue-800">
                    Payment Recorded
                  </p>
                  <p className="text-sm mt-1">
                    {payment.sender.id === session.user.id
                      ? "You"
                      : payment.sender.name}{" "}
                    paid
                    <span className="font-bold text-green-600 ml-1">
                      {" "}
                      {formatCurrency(payment.amount)}
                    </span>{" "}
                    to
                    {payment.receiver.id === session.user.id
                      ? " You"
                      : payment.receiver.name}
                    .
                  </p>
                </div>
              ))}

              {group.expenses.length === 0 && group.payments.length === 0 && (
                <p className="text-gray-500 text-center py-8">
                  No activity yet. Add your first expense!
                </p>
              )}
            </div>
          </div>

          {/* Sidebar (Balances/Members) */}
          <div className="md:col-span-1">
            <div className="sticky top-4">
              <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
                Group Members
              </h3>
              <div className="bg-white p-4 rounded-lg shadow-md space-y-2">
                {group.members.map((member) => (
                  <div
                    key={member.id}
                    className="flex justify-between items-center border-b pb-2 last:border-b-0"
                  >
                    <p className="font-medium">
                      {member.id === session.user.id ? "You" : member.name}
                    </p>
                    <span className="text-sm font-semibold text-gray-600">
                      {formatCurrency(10.5)}{" "}
                      {/* Placeholder balance owed/owing */}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
