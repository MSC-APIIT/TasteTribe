'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SocialSignUp from '../SocialSignUp';
import { registerUser } from '../../../lib/authClient'; // adjust path if needed
import toast from 'react-hot-toast';

// type definition
type SignUpProps = {
  onSuccess?: () => void;
};

const SignUp: React.FC<SignUpProps> = ({ onSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await registerUser({ name, email, password }); // name can be added if backend supports it

    if (result.error) {
      setError(result.error);
      toast.error(result.error);
    } else {
      toast.success('User registered successfully!');
      onSuccess?.(); // Close the modal
      router.push('');
    }
  };

  return (
    <>
      <div className="text-2xl mb-10 text-center mx-auto inline-block">
        Create Account
      </div>

      <SocialSignUp />

      <div className="relative my-6 text-center">
        <span className="absolute left-0 top-1/2 w-[40%] h-px bg-muted -translate-y-1/2"></span>
        <span className="relative z-10 px-3 text-muted-foreground">OR</span>
        <span className="absolute right-0 top-1/2 w-[40%] h-px bg-muted -translate-y-1/2"></span>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-[22px]">
          <input
            type="text"
            placeholder="Name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full rounded-md border border-solid bg-transparent px-5 py-3 text-base text-dark outline-hidden transition focus:border-primary focus-visible:shadow-none"
          />
        </div>
        <div className="mb-[22px]">
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-md border border-solid bg-transparent px-5 py-3 text-base text-dark outline-hidden transition focus:border-primary focus-visible:shadow-none"
          />
        </div>
        <div className="mb-[22px]">
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-md border border-solid bg-transparent px-5 py-3 text-base text-dark outline-hidden transition focus:border-primary focus-visible:shadow-none"
          />
        </div>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <div className="mb-9">
          <button
            type="submit"
            className="w-full py-2 rounded-md bg-primary text-primary-foreground font-medium border border-primary hover:bg-muted hover:text-primary transition duration-300 ease-in-out"
          >
            Sign Up
          </button>
        </div>
      </form>

      {/* <p className="text-body-secondary mb-4 text-base">
        By creating an account you agree with our{' '}
        <a href="/" className="text-primary hover:underline">
          Privacy
        </a>{' '}
        and{' '}
        <a href="/" className="text-primary hover:underline">
          Policy
        </a>
      </p> */}

      <p className="text-body-secondary text-base">
        Already have an account?
        <Link href="/signin" className="pl-2 text-primary hover:underline">
          Sign In
        </Link>
      </p>
    </>
  );
};

export default SignUp;
