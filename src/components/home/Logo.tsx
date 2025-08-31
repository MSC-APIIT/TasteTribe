import Image from 'next/image';
import Link from 'next/link';
import { Alfa_Slab_One } from 'next/font/google';

const alfa_Slab_One = Alfa_Slab_One({ subsets: ['latin'], weight: '400' });

export default function Logo() {
  return (
    <Link href="/" className="flex items-center space-x-4">
      <Image
        src="/logo.png"
        alt="TasteTribe Logo"
        width={40}
        height={40}
        className="ml-10 relative "
      />
      <span
        className={`text-2xl font-bold text-gray-900 dark:text-white truncate ${alfa_Slab_One.className}`}
      >
        TasteTribe
      </span>
    </Link>
  );
}

