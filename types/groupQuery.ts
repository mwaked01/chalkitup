import { Prisma, Expense,ExpenseShare, Payment, User } from '@prisma/client';

// Define the exact shape of your query's inclusion list
export const groupWithDetails = Prisma.validator<Prisma.GroupDefaultArgs>()({
  include: { 
    members: true, // We need this for the GroupList loop if you use it
    expenses: { include: { shares: true } },
    payments: { include: { sender: true, receiver: true } }
  }
});

export const expenseWithDetails = Prisma.validator<Prisma.ExpenseDefaultArgs>()({
  include: { 
    shares: {include: { user: true } },
    payer: true
  }
});

export type GroupWithDetails = Prisma.GroupGetPayload<typeof groupWithDetails>;

export type ExpenseWithDetails = Expense & {
  shares: (ExpenseShare & { user: User })[];
  payer: User;
};

export type PaymentWithDetails = Payment & {
  sender: User;
  receiver: User;
};

export type BalanceResult = {
  [userId: string]: {
    amount: number; // Positive = They owe you; Negative = You owe them
    user: User;     // Store user details for easy display
  };
};

