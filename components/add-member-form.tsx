'use client';

import { useState } from 'react';
import { addMemberToGroup } from '@/components/actions';
import { UserPlus, Loader2, XCircle } from 'lucide-react';

interface AddMemberFormProps {
  groupId: string;
}

export function AddMemberForm({ groupId }: AddMemberFormProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setMessage('');
    setIsError(false);

    try {
      const result = await addMemberToGroup(groupId, email);
      setMessage(result.message);
      setEmail(''); // Clear the input on success
      
    } catch (error) {
      // Server Action will throw an error string or object
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      setMessage(errorMessage);
      setIsError(true);
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-3 flex items-center">
        <UserPlus className="w-5 h-5 mr-2" /> Add New Member
      </h3>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter user's email address"
          required
          className="flex-grow border p-2 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-150 flex items-center"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <UserPlus className="w-5 h-5 mr-2" />}
          {loading ? 'Adding...' : 'Add Member'}
        </button>
      </form>
      
      {message && (
        <p className={`mt-2 p-2 text-sm rounded ${isError ? 'bg-red-100 text-red-700 flex items-center' : 'bg-green-100 text-green-700'}`}>
          {isError && <XCircle className="w-4 h-4 mr-1" />}
          {message}
        </p>
      )}
    </div>
  );
}