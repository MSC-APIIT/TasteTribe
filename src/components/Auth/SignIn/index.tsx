'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import SocialSignIn from '../SocialSignIn';
import { loginUser } from '../../../lib/authClient';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

type SignInProps = {
  onSuccess?: () => void;
};

const Signin: React.FC<SignInProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await loginUser({ email, password });

    if (result.error) {
      setError(result.error);
      toast.error(result.error);
    } else {
      toast.success('Login successfull!');
      onSuccess?.(); // Close the modal
      router.push('');
    }
  };
  return (
    <>
      <div className="text-2xl mb-10 text-center mx-auto inline-block">
        Login
      </div>

      <SocialSignIn />

      <div className="relative my-6 text-center">
        <span className="absolute left-0 top-1/2 w-[40%] h-px bg-muted -translate-y-1/2"></span>
        <span className="relative z-10 px-3 text-muted-foreground">OR</span>
        <span className="absolute right-0 top-1/2 w-[40%] h-px bg-muted -translate-y-1/2"></span>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-[22px]">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-solid bg-transparent px-5 py-3 text-base text-dark outline-hidden transition focus:border-primary focus-visible:shadow-none"
          />
        </div>
        <div className="mb-[22px]">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-solid bg-transparent px-5 py-3 text-base text-dark outline-hidden transition focus:border-primary focus-visible:shadow-none"
          />
        </div>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <div className="mb-9">
          <button
            type="submit"
            className="w-full py-2 rounded-md bg-primary text-primary-foreground font-medium border border-primary hover:bg-muted hover:text-primary transition duration-300 ease-in-out"
          >
            Sign In
          </button>
        </div>
      </form>

      <Link
        href="/forgot-password"
        className="text-body-secondary text-base hover:underline"
      >
        Forgot Password?
      </Link>
      <p className="text-body-secondary text-base">
        Not a member yet?{' '}
        <Link href="/signup" className="text-primary hover:underline">
          Sign Up
        </Link>
      </p>
    </>
  );
};

export default Signin;
