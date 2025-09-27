'use client';

import { useRouter } from 'next/navigation';
import Signin from '@/components/Auth/SignIn';

const SignInPage = () => {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-screen bg-black/50">
      <div className="w-full max-w-md mx-auto bg-card text-card-foreground backdrop-blur-md rounded-lg px-8 pt-14 pb-8">
        <Signin onSuccess={() => router.push('/')} />
      </div>
    </div>
  );
};

export default SignInPage;
