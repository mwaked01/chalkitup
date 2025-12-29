'use client';

import { useState } from 'react';
import { updateUserName } from './actions';
import { useSession } from 'next-auth/react'; 
import { useRouter } from 'next/navigation';

interface Props {
  userId: string;
  email: string;
}

export default function UserOnboardingForm({ userId, email }: Props) {
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const { update } = useSession();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (!name.trim()) {
      setError('Please enter your full name.');
      setIsSubmitting(false);
      return;
    }

    // Call the Server Action
    const result = await updateUserName(userId, name);
    
    if (result.error) {
      setError(result.error);
    } else {
      await update(); 
      router.push('/user');
    }

    setIsSubmitting(false);
  };

  return (
    <div className=" flex flex-col items-center justify-center min-h-screen">
      <div className="bg-[#222121] p-8 shadow-xl rounded-xl max-w-sm w-full text-center">
        <h1 className="text-2xl font-bold mb-2 text-[#c9aa44]">Welcome to Chalk It Up!</h1>
        <p className="text-[#e6e6e6] mb-6">
          You signed in as <span className="font-medium">{email}</span>. Please complete your profile.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Enter your Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-[#c9aa44] rounded-lg focus:ring-[#c9aa44] focus:border-[#c9aa44] text-[#c9aa44]"
            required
            disabled={isSubmitting}
          />
          
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !name.trim()}
            className="w-full bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Continue to Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}