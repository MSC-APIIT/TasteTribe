'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProfileCard, Profile } from '@/components/ui/profile-card';
import { StallCard, Stall } from '@/components/ui/stall-card';
import { CreateStallCard } from '@/components/ui/create-stall-card';
import { Modal } from '@/components/ui/modal';
import { StallForm } from '@/components/ui/stall-form';
import { ProfileForm } from '@/components/ui/profile-form';
import { useAuth } from '../../../hooks/userAuth';

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

export default function ProfilePage() {
  const router = useRouter();
  const { user, accessToken } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [stalls, setStalls] = useState(initialStalls);
  const [isStallModalOpen, setIsStallModalOpen] = useState(false);

  useEffect(() => {

    console.log(accessToken)
    const fetchProfile = async () => {
      try {
        console.log(accessToken)
        const res = await fetch('/api/profile', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`, // token
            
          },
        });
        console.log(accessToken)
        if (!res.ok) {
          console.error('Failed to fetch profile:', res.status, res.statusText);
          return;
        }
        const data = await res.json();
        setProfile({
          name: data.name,
          bio: data.bio || 'Add bio',
          profilePicture: data.profileImage || '/default-profile.png',
        });
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    };

    fetchProfile();
  }, [accessToken]);

  const handleProfileUpdate = async (updated: Profile) => {
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          name: updated.name,
          bio: updated.bio,
          profileImage: updated.profilePicture,
        }),
      });

      if (!res.ok) {
        console.error('Failed to update profile:', res.statusText);
        return;
      }

      const data = await res.json();
      setProfile({
        name: data.name,
        bio: data.bio || 'Add bio',
        profilePicture: data.profileImage || '/default-profile.png',
      });
      setIsProfileModalOpen(false);
    } catch (err) {
      console.error('Error updating profile:', err);
    }
  };

  const handleCreateStall = (stall: Stall) => {
    setStalls((prev) => [...prev, stall]);
    setIsStallModalOpen(false);
  };

  return (
    <div style={{ paddingTop: '128px' }} className="container mx-auto py-8">
      {profile && (
        <>
          <ProfileCard
            profile={profile}
            onEdit={() => setIsProfileModalOpen(true)}
          />
          <Modal
            isOpen={isProfileModalOpen}
            onClose={() => setIsProfileModalOpen(false)}
          >
            <ProfileForm initialData={profile} onSubmit={handleProfileUpdate} />
          </Modal>
        </>
      )}

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
}
