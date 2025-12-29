import { ExpenseWithDetails, PaymentWithDetails, BalanceResult } from "../types/groupQuery";

type User = {
    name: string | null;
    id: string;
    email: string;
    emailVerified: Date | null;
    image: string | null;
}

export function calculateUserBalances(
  currentUserId: string,
  expenses: ExpenseWithDetails[],
  payments: PaymentWithDetails[]
): BalanceResult {
  const balances: BalanceResult = {};

  // Helper to initialize a user in the map if they don't exist
  const initUser = (user: User) => {
    if (!balances[user.id]) {
      balances[user.id] = { amount: 0, user };
    }
  };

  // 1. Process Expenses
  expenses.forEach((expense) => {
    const isPayer = expense.payerId === currentUserId;

    if (isPayer) {
      // I paid. Everyone in the shares list owes me.
      expense.shares.forEach((share) => {
        if (share.userId !== currentUserId) {
          initUser(share.user);
          balances[share.userId].amount += share.amount;
        }
      });
    } else {
      // Someone else paid. I might owe them.
      const myShare = expense.shares.find((s) => s.userId === currentUserId);
      if (myShare) {
        // I owe the payer
        initUser(expense.payer);
        balances[expense.payerId].amount -= myShare.amount;
      }
    }
  });

  // 2. Process Payments (Settlements)
  payments.forEach((payment) => {
    const isSender = payment.senderId === currentUserId;
    const isReceiver = payment.receiverId === currentUserId;

    if (isSender) {
      // I sent money to someone (paying off debt or lending)
      // This increases their balance relative to me (reduces my debt to them)
      if (payment.receiver) { // Check existence due to potential nulls in some schemas
         initUser(payment.receiver);
         balances[payment.receiverId].amount += payment.amount;
      }
    } else if (isReceiver) {
      // I received money (they are paying me back)
      // This decreases their balance (reduces their debt to me)
       if (payment.sender) {
         initUser(payment.sender);
         balances[payment.senderId].amount -= payment.amount;
       }
    }
  });

  return balances;
}