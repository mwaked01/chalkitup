'use client';

import { useState } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { LogIn, LogOut, User } from 'lucide-react';
import Image from 'next/image';
import { LoginModal } from './login-modal';

export function AuthButton() {
  const { data: session, status } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (status === 'loading') {
    return <div className="p-2">Loading...</div>;
  }

  // --- LOGGED IN STATE ---
  if (session) {
    return (
      <div className="flex items-center space-x-3">
        {session.user.image && (
          <Image
            src={session.user.image}
            alt={session.user.name || 'User'}
            width={32}
            height={32}
            className="rounded-full"
          />
        )}
        <span className="text-sm font-medium hidden sm:inline">{session.user.name}</span>
        <button
          onClick={() => signOut({ callbackUrl: '/' })} // Redirects to home page after logout
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </button>
      </div>
    );
  }

  // --- LOGGED OUT STATE ---
  return (
    <div>
        {isModalOpen ?
        <LoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    :<button
    //   onClick={() => signIn('google')}
    onClick={() => setIsModalOpen(true)}
    className="font-bold py-2 px-4 rounded-lg inline-flex items-center transition duration-150"
    >
      <LogIn className="w-4 h-4 mr-2" />
      Log In
    </button>
}
        </div>
  );
}