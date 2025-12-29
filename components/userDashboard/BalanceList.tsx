import { ExpenseWithDetails, PaymentWithDetails } from "@/types/groupQuery";
import { calculateUserBalances } from "@/lib/finance";
import { Users } from "lucide-react";
import BalanceListItem from "./BalanceListItem";

interface BalanceListProps {
  currentUserId: string;
  expenses: ExpenseWithDetails[];
  payments: PaymentWithDetails[];
  setActiveTab?: (tab: "groups" | "balances") => void;
}

export default function BalanceList({
  currentUserId,
  expenses,
  payments,
  setActiveTab,
}: BalanceListProps) {
  // 1. Calculate Balances
  const balanceMap = calculateUserBalances(currentUserId, expenses, payments);
  const balanceEntries = Object.values(balanceMap);

  if (balanceEntries.length === 0) {
    return (
      <div className="p-8 text-center bg-gray-50 rounded-lg border border-dashed text-gray-500">
        You are all settled up!
      </div>
    );
  }
  const totalBalances = balanceEntries.reduce((accumulator, currentValue) => {
    return accumulator + currentValue.amount;
  }, 0);
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold mb-4">
          Overall You {totalBalances > 0 ? "are Owed" : "Owe"} $
          {Math.abs(totalBalances).toFixed(2)}
        </h1>
        <button onClick={() => setActiveTab && setActiveTab("groups")}>
          <Users className="w-4 h-4 mr-2" />
          Group List
        </button>
      </div>
      {balanceEntries.map(({ user, amount }) => {
        // Skip rendering if balance is effectively zero (floating point safety)
        if (Math.abs(amount) < 0.01) return null;

        return <BalanceListItem key={user.id} user={user} amount={amount} />;
      })}
    </div>
  );
}
