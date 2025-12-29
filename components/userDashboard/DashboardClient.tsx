"use client";

import { useState } from "react";
import GroupList from "@/components/userDashboard/GroupList";
import BalanceList from "@/components/userDashboard/BalanceList";
import {
  GroupWithDetails,
  ExpenseWithDetails,
  PaymentWithDetails,
} from "../../types/groupQuery";

type DashboardClientProps = {
  groups: GroupWithDetails[];
  currentUserId: string;
  expenses: ExpenseWithDetails[];
  payments: PaymentWithDetails[];
};

export default function DashboardClient({
  groups,
  currentUserId,
  expenses,
  payments,
}: DashboardClientProps) {
  const [activeTab, setActiveTab] = useState<"groups" | "balances">("balances");
  return activeTab === "groups" ? (
    <GroupList groups={groups} setActiveTab={setActiveTab} />
  ) : (
    <BalanceList
      currentUserId={currentUserId}
      expenses={expenses}
      payments={payments}
      setActiveTab={setActiveTab}
    />
  );
}
