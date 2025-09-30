'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProfileCard, Profile } from '@/components/ui/profile-card';
import { StallCard, Stall } from '@/components/ui/stall-card';
import { CreateStallCard } from '@/components/ui/create-stall-card';
import { Modal } from '@/components/ui/modal';
import { StallForm } from '@/components/ui/stall-form';
import { ProfileForm } from '@/components/ui/profile-form';
import { useAuth } from '@/hooks/userAuth';
import { useApi } from '@/hooks/useApi';
import { ProfileView } from '@/app/types/profileView';
import { Card, CardContent, CardHeader } from '@mui/material';

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
  const { accessToken, updateUser } = useAuth();
  const api = useApi(accessToken ?? undefined);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [stalls, setStalls] = useState(initialStalls);
  const [isStallModalOpen, setIsStallModalOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await api.get<ProfileView>('/api/profile');
        setProfile({
          name: data.name,
          bio: data.bio || 'Add bio',
          profilePicture: data.profileImage || '/default-profile.png',
        });
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      }
    };

    if (accessToken) fetchProfile();
  }, [accessToken, api]);

  // Handle profile update
  const handleProfileUpdate = async (updated: Profile, file?: File) => {
    try {
      const formData = new FormData();
      formData.append('name', updated.name);
      formData.append('bio', updated.bio || '');
      if (file) {
        formData.append('avatar', file); // image file from form
      }

      const data = await api.put<ProfileView>('/api/profile', formData);

      const updatedProfile = {
        name: data.name,
        bio: data.bio || 'Add bio',
        profilePicture: data.profileImage || '/default-profile.png',
      };

      setProfile(updatedProfile);

      if (updateUser) {
        updateUser({
          name: data.name,
          profileImage: data.profileImage,
        });
      }

      setIsProfileModalOpen(false);
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  };

  const handleCreateStall = (stall: Stall) => {
    setStalls((prev) => [...prev, stall]);
    setIsStallModalOpen(false);
  };

  return (
    <div style={{ paddingTop: '128px' }} className="container mx-auto py-8">
      {!profile ? (
        <Card className="animate-pulse">
          <CardHeader className="flex flex-row items-center gap-4">
            {/* Avatar skeleton */}
            <div className="h-24 w-24 rounded-full bg-slate-500 dark:bg-slate-700" />

            <div className="flex flex-col gap-3 flex-1">
              {/* Name skeleton */}
              <div className="h-6 w-32 bg-slate-500 dark:bg-slate-700 rounded" />

              {/* Bio skeleton */}
              <div className="space-y-2">
                <div className="h-4 w-48 bg-slate-500 dark:bg-slate-700 rounded" />
                <div className="h-4 w-36 bg-slate-500 dark:bg-slate-700 rounded" />
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {/* Button skeleton */}
            <div className="h-10 w-28 bg-slate-500 dark:bg-slate-700 rounded" />
          </CardContent>
        </Card>
      ) : (
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
