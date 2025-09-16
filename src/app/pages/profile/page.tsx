'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProfileCard, Profile } from '@/components/ui/profile-card';
import { StallCard, Stall } from '@/components/ui/stall-card';
import { CreateStallCard } from '@/components/ui/create-stall-card';
import { Modal } from '@/components/ui/modal';
import { StallForm } from '@/components/ui/stall-form';

const initialProfile: Profile = {
  name: 'John Doe',
  bio: 'Lover of food and travel.',
  profilePicture: '/logo.png',
};

const initialStalls: Stall[] = [
  {
    id: '1',
    name: 'My Awesome Stall',
    description: 'The best food in town!',
    coverImages: ['/logo.png'],
  },
  {
    id: '2',
    name: 'Another Great Stall',
    description: 'You have to try our new menu!',
    coverImages: ['/logo.png'],
  },
];

const ProfilePage = () => {
  const router = useRouter();
  const [stalls, setStalls] = useState(initialStalls);
  const [isStallModalOpen, setIsStallModalOpen] = useState(false);

  const handleCreateStall = (stall: Stall) => {
    setStalls([...stalls, stall]);
    setIsStallModalOpen(false);
  };

  return (
    <div style={{ paddingTop: '128px' }} className="container mx-auto py-8">
      <ProfileCard initialProfile={initialProfile} />
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">My Stalls</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stalls.map((stall) => (
            <StallCard
              key={stall.id}
              stall={stall}
              onClick={() => router.push('/pages/stall-profile')}
            />
          ))}
          <CreateStallCard onClick={() => setIsStallModalOpen(true)} />
        </div>
      </div>

      <Modal
        isOpen={isStallModalOpen}
        onClose={() => setIsStallModalOpen(false)}
      >
        <StallForm onSubmit={handleCreateStall} />
      </Modal>
    </div>
  );
};

export default ProfilePage;
