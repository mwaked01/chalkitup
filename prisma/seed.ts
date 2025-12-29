import 'dotenv/config';
import { prisma } from '../lib/prisma.js'; 

async function clearDatabase() {
  console.log("🧹 Clearing existing data...");

  // Deletion must happen in dependency order to avoid foreign key constraints (even if CASCADE is set)
  await prisma.expenseShare.deleteMany({});
  await prisma.expense.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.group.deleteMany({});
  
  // Clear NextAuth models last
  await prisma.verificationToken.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.account.deleteMany({});
  await prisma.user.deleteMany({}); 

  console.log("✅ Database cleared.");
}

async function seedData() {
  console.log("🌱 Starting seed data creation...");

  // --- 1. Create Users ---
  const alice = await prisma.user.create({
    data: { name: 'Alice', email: 'alice@example.com', emailVerified: new Date(), image: 'https://i.pravatar.cc/150?img=1' },
  });
  const bob = await prisma.user.create({
    data: { name: 'Bob', email: 'bob@example.com', emailVerified: new Date(), image: 'https://i.pravatar.cc/150?img=2' },
  });
  const charlie = await prisma.user.create({
    data: { name: 'Charlie', email: 'charlie@example.com', emailVerified: new Date(), image: 'https://i.pravatar.cc/150?img=3' },
  });

  const allUsers = [alice, bob, charlie];
  const userIds = allUsers.map(u => ({ id: u.id }));

  console.log(`- Created ${allUsers.length} users: Alice, Bob, Charlie.`);

  // --- 2. Create Group ---
  const tripGroup = await prisma.group.create({
    data: {
      name: 'Trip to Mexico',
      members: { connect: userIds },
    },
  });

  console.log(`- Created group: ${tripGroup.name}`);
  
  // --- 3. Create Expense (Alice pays $300 for Hotel, split evenly 3 ways) ---
  const totalAmount = 300.00;
  const shareAmount = parseFloat((totalAmount / allUsers.length).toFixed(2)); // $100.00 each

  const hotelExpense = await prisma.expense.create({
    data: {
      description: 'Hotel for 3 nights',
      amount: totalAmount,
      groupId: tripGroup.id,
      payerId: alice.id,
      shares: {
        create: allUsers.map(user => ({
          userId: user.id,
          amount: shareAmount,
        })),
      },
    },
  });
  
  console.log(`- Created expense: "${hotelExpense.description}" (Total: $${hotelExpense.amount.toFixed(2)})`);
  console.log(`  -> Alice is owed $${(totalAmount - shareAmount).toFixed(2)} from the others.`);


  // --- 4. Create Payment (Bob settles half his debt to Alice) ---
  const bobPayment = 50.00; // Bob owes $100, pays $50

  await prisma.payment.create({
    data: {
      amount: bobPayment,
      groupId: tripGroup.id,
      senderId: bob.id,
      receiverId: alice.id,
    },
  });
  
  console.log(`- Recorded payment: Bob sent $${bobPayment.toFixed(2)} to Alice.`);
  console.log(`  -> Bob's remaining debt to Alice: $${(shareAmount - bobPayment).toFixed(2)}`);

  console.log("✨ Seed completed successfully.");
}


async function main() {
  try {
    // Run the two main steps sequentially
    await clearDatabase();
    await seedData();
  } catch (e) {
    console.error("Seed Error:", e);
    process.exit(1);
  } finally {
    // Ensure the client disconnects after operation
    await prisma.$disconnect();
  }
}

main();