'use server'

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Updates a user's name and forces a session refresh.

 */
export async function updateUserName(userId: string, name: string) {
  if (!name || name.trim().length === 0) {
    return { error: 'Name cannot be empty.' };
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { name: name.trim() },
    });

    return { success: true };
  } catch (e) {
    console.error("Error updating user name:", e);
    return { error: 'Failed to update user name due to a server error.' };
  }
}

// Create Group
export async function createGroup(name: string) {
  const session = await getServerSession(authOptions);
  if (!session) return;

  await prisma.group.create({
    data: {
      name,
      members: { connect: { id: session.user.id } }
    }
  });
  revalidatePath('/');
}

// Add Expense (Handles Even, Uneven, Exclude logic via the 'shares' array)
// shares: { userId: string, amount: number }[]
export async function addExpense(groupId: string, description: string, amount: number, shares: { userId: string, amount: number }[]) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Not authenticated");

  await prisma.expense.create({
    data: {
      description,
      amount,
      groupId,
      payerId: session.user.id,
      shares: {
        create: shares.map(share => ({
          userId: share.userId,
          amount: share.amount
        }))
      }
    }
  });
  revalidatePath(`/groups/${groupId}`);
}

// Settle Up (Record Payment)
export async function recordPayment(groupId: string, receiverId: string, amount: number) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Not authenticated");

  await prisma.payment.create({
    data: {
      amount,
      groupId,
      senderId: session.user.id,
      receiverId,
    }
  });
  revalidatePath(`/groups/${groupId}`);
}

export async function addMemberToGroup(groupId: string, newMemberEmail: string) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Not authenticated");

  // 1. Find the user based on the provided email
  const newMember = await prisma.user.findUnique({
    where: { email: newMemberEmail },
    select: { id: true, name: true }
  });

  if (!newMember) {
    throw new Error(`User with email ${newMemberEmail} not found.`);
  }

  // 2. Add the user to the group
  try {
    await prisma.group.update({
      where: { id: groupId },
      data: {
        members: {
          connect: { id: newMember.id }
        }
      }
    });
    
    revalidatePath(`/groups/${groupId}`);
    return { success: true, message: `${newMember.name} was added to the group.` };

  } catch (error) {
    console.error("Error adding member:", error);
    // This often catches the case where the user is already a member
    throw new Error("Could not add member. They might already be in the group.");
  }
}