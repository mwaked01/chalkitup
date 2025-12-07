import 'dotenv/config';
import { PrismaClient } from '../generated/client/client.ts';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('Missing DATABASE_URL environment variable.');
  process.exit(1);
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });


async function main() {

  // --- New seeding for User, Group, Expense, ExpenseSplit ---
  // Create some example users, groups and expenses
  try {
    // Create users (use upsert so the script is idempotent)
    const alice = await prisma.user.upsert({
      where: { email: 'alice@example.com' },
      update: {},
      create: { name: 'Alice Example', email: 'alice@example.com' },
    });

    const bob = await prisma.user.upsert({
      where: { email: 'bob@example.com' },
      update: {},
      create: { name: 'Bob Example', email: 'bob@example.com' },
    });

    const carol = await prisma.user.upsert({
      where: { email: 'carol@example.com' },
      update: {},
      create: { name: 'Carol Example', email: 'carol@example.com' },
    });

    console.log('Users upserted:', alice.email, bob.email, carol.email);

    // Create a group and connect users
    const roommates = await prisma.group.upsert({
      where: { name: 'Roommates' },
      update: {},
      create: {
        name: 'Roommates',
        users: {
          connect: [{ id: alice.id }, { id: bob.id }, { id: carol.id }],
        },
      },
    });

    console.log('Group upserted:', roommates.name);

    // Create an expense with splits
    const groceries = await prisma.expense.upsert({
      where: { description: 'Groceries - shared' },
      update: {},
      create: {
        description: 'Groceries - shared',
        amount: '120.00',
        groupId: roommates.id,
        recordedById: alice.id,
        paidById: bob.id,
        splits: {
          create: [
            { user: { connect: { id: alice.id } }, amountOwed: '40.00' },
            { user: { connect: { id: bob.id } }, amountOwed: '40.00' },
            { user: { connect: { id: carol.id } }, amountOwed: '40.00' },
          ],
        },
      },
    });

    // Another expense where one person paid for dinner
    const dinner = await prisma.expense.upsert({
      where: { description: 'Dinner out' },
      update: {},
      create: {
        description: 'Dinner out',
        amount: '75.00',
        groupId: roommates.id,
        recordedById: carol.id,
        paidById: alice.id,
        splits: {
          create: [
            { user: { connect: { id: alice.id } }, amountOwed: '25.00' },
            { user: { connect: { id: bob.id } }, amountOwed: '25.00' },
            { user: { connect: { id: carol.id } }, amountOwed: '25.00' },
          ],
        },
      },
    });

    console.log('Inserted expenses:', groceries.description, dinner.description);
  } catch (err) {
    console.error('Error seeding users/groups/expenses:', err);
    throw err;
  }
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exitCode = 1;
  })
  .finally(async () => {
    try {
      await prisma.$disconnect();
    } catch (e) {
      console.error('Error disconnecting prisma:', e);
    }
    try {
      await pool.end();
    } catch (e) {
      console.error('Error closing pg pool:', e);
    }
  });
