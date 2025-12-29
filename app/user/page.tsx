import DashboardClient from "@/components/userDashboard/DashboardClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import UserOnboardingForm from "@/components/UserOnboardingForm";
import { prisma } from "@/lib/prisma";
import { groupWithDetails, expenseWithDetails } from "@/types/groupQuery";

export default async function UserDashboard() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return <div className="p-8">Please Sign In</div>;
    // return <AuthLandingPage />;
  }
  if (!session.user.name) {
    return (
      <UserOnboardingForm userId={session.user.id} email={session.user.email} />
    );
  }

  const groupsData = prisma.group.findMany({
    where: { members: { some: { id: session.user.id } } },
    ...groupWithDetails,
  });

  const expensesData = prisma.expense.findMany({
    where: {
      OR: [
        { payerId: session.user.id },
        { shares: { some: { userId: session.user.id } } },
      ],
    },
    ...expenseWithDetails,
    orderBy: {
      date: "desc",
    },
  });

  const paymentsData = prisma.payment.findMany({
    where: {
      OR: [
        { senderId: session.user.id }, // Money I sent
        { receiverId: session.user.id }, // Money I received
      ],
    },
    include: { sender: true, receiver: true },
    orderBy: { date: "desc" },
  });

  const [groups, expenses, payments] = await Promise.all([
    groupsData,
    expensesData,
    paymentsData,
  ]);

 
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <DashboardClient
        groups={groups}
        currentUserId={session.user.id}
        expenses={expenses}
        payments={payments}
      />
    </div>
  );
}
