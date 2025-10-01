'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Profile, ProfileCard } from '@/components/ui/profile-card';
import { StallCard, Stall } from '@/components/ui/stall-card';
import { CreateStallCard } from '@/components/ui/create-stall-card';
import { Modal } from '@/components/ui/modal';
import { StallForm } from '@/components/ui/stall-form';
import { ProfileForm } from '@/components/ui/profile-form';
import { useAuth } from '@/hooks/userAuth';
import { useApi } from '@/hooks/useApi';
import { toast } from 'react-hot-toast';
import { StallDto } from '../../types/stall';
import { Card, CardContent, CardHeader } from '@mui/material';
import { ProfileView } from '@/app/types/profileView';

export default function ProfilePage() {
  const router = useRouter();
  const { accessToken, updateUser } = useAuth();
  const api = useApi(accessToken ?? undefined);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [stalls, setStalls] = useState<StallDto[]>([]);
  const [isStallModalOpen, setIsStallModalOpen] = useState(false);
  const [loadingStalls, setLoadingStalls] = useState(true);

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

    //Stall
    const fetchStalls = async () => {
      try {
        setLoadingStalls(true);
        const data =
          await api.get<(StallDto & { _id?: string })[]>('/api/stall');
        const validStalls = data
          .filter((s) => s.stallName)
          .map((s) => ({
            ...s,
            id: s.id ?? s._id ?? '',
          }));
        setStalls(validStalls);
      } catch (err) {
        console.error('Failed to fetch stall:', err);
      } finally {
        setLoadingStalls(false);
      }
    };

    if (accessToken) {
      fetchProfile();
      fetchStalls();
    }
  }, [accessToken, api]);

  // Handle profile update
  const handleProfileUpdate = async (updated: Profile, file?: File) => {
    try {
      const formData = new FormData();
      formData.append('name', updated.name);
      formData.append('bio', updated.bio || '');
      if (file) {
        formData.append('avatar', file);
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

  const handleCreateStall = async (stall: Stall) => {
    try {
      const data = await api.post<StallDto>('/api/stall', stall);
      setStalls((prev) => [...prev, data]);
      setIsStallModalOpen(false);
      toast.success('Stall created successfully!');
    } catch (err) {
      console.error('Failed to create stall:', err);
      toast.error('Failed to create stall.');
    }
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
          {loadingStalls ? (
            // Skeleton cards
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-40 w-full bg-slate-500 dark:bg-slate-700 rounded" />
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="h-6 w-32 bg-slate-500 dark:bg-slate-700 rounded" />
                  <div className="h-4 w-48 bg-slate-500 dark:bg-slate-700 rounded" />
                  <div className="h-10 w-24 bg-slate-500 dark:bg-slate-700 rounded" />
                </CardContent>
              </Card>
            ))
          ) : stalls.length > 0 ? (
            stalls.map((stall) => (
              <StallCard
                key={stall.id}
                stall={stall}
                //onClick={() => router.push(`/pages/stall-profile?id=${stall.id}`)}

                onClick={() => {
                  router.push(`stall-profile/${stall.id}`);
                }}
              />
            ))
          ) : (
            <p className="text-muted">You have not created any stalls yet.</p>
          )}

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
