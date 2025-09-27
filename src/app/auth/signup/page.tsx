'use client';

import { useRouter } from 'next/navigation';
import SignUp from '@/components/Auth/SignUp';

const SignUpPage = () => {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-screen bg-black/50">
      <div className="w-full max-w-md mx-auto bg-card text-card-foreground backdrop-blur-md rounded-lg px-8 pt-14 pb-8">
        <SignUp onSuccess={() => router.push('/pages/profile')} />
      </div>
    </div>
  );
};

export default SignUpPage;
