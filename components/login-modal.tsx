"use client";
import { useState } from "react";
import { Mail, X, Chrome } from "lucide-react";
import { signIn } from "next-auth/react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) {
    return null;
  }

  // Handle outside click to close the modal
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  /**
   * Handles the submission for the Email sign-in.
   */
  const handleEmailSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Call NextAuth's signIn function with the 'email' provider
    // and provide the redirect: false option to prevent automatic redirection
    // after the sign-in link is sent.
    const result = await signIn("email", {
      email: email,
      redirect: false,
      callbackUrl: "/user",
    });
    setLoading(false);

    if (result) {
      if (result.error) {
        setError(result.error);
      } else {
        alert(`Success! Check your inbox at ${email} for a sign-in link.`);
      }
    } else {
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/10  backdrop-blur-xs transition-opacity duration-300"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-modal-title"
    >
      {/* Modal Container */}
      <div className="relative w-full max-w-md m-4 transform overflow-hidden rounded-xl bg-white p-6 text-left shadow-2xl transition-all">
        {/* Close Button */}
        <button
          type="button"
          className="absolute right-4 top-4 rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
          onClick={onClose}
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="text-center">
          <h2
            id="login-modal-title"
            className="text-2xl font-bold text-gray-900"
          >
            Sign in to ChalkItUp
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Continue with your preferred method.
          </p>
        </div>

        {/* Social Login Buttons */}
        <div className="mt-6 space-y-3">
          <button
            onClick={() => signIn("google",{ callbackUrl: "/user" })}
            className="flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <Chrome className="h-5 w-5 mr-3" />
            Sign in with Google
          </button>

          {/* Add more social buttons here if needed */}
        </div>

        {/* Separator */}
        <div className="relative mt-6">
          <div
            className="absolute inset-0 flex items-center"
            aria-hidden="true"
          >
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-3 text-gray-500">Or</span>
          </div>
        </div>

        {/* Email Sign-in Option */}
        <form onSubmit={handleEmailSignIn} className="space-y-4">
          <div>
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="block w-full rounded-lg border-0 py-2.5 pl-10 pr-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                disabled={loading}
              />
            </div>
          </div>

          {/* Error message display */}
          {error && <p className="text-sm font-medium text-red-600">{error}</p>}

          <button
            type="submit"
            className="flex w-full justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
            disabled={loading || email.length === 0}
          >
            {loading ? "Sending link..." : "Email me a sign-in link"}
          </button>
        </form>

        {/* Footer Text */}
        <p className="mt-6 text-xs text-center text-gray-500">
          By signing in, you agree to our{" "}
          <a href="#" className="font-medium text-indigo-600 hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="font-medium text-indigo-600 hover:underline">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
}
