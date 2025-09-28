'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProfileCard, ProfileView } from '@/components/ui/profile-card';
import { StallCard, Stall } from '@/components/ui/stall-card';
import { CreateStallCard } from '@/components/ui/create-stall-card';
import { Modal } from '@/components/ui/modal';
import { StallForm } from '@/components/ui/stall-form';
import { ProfileForm } from '@/components/ui/profile-form';
import { useAuth } from '@/hooks/userAuth';
import { useApi } from '@/hooks/useApi';
import { toast } from 'react-hot-toast';
import { StallDto } from '../../types/stall';

export default function ProfilePage() {
  const router = useRouter();
  const { accessToken } = useAuth();
  const api = useApi(accessToken ?? undefined);

  const [profile, setProfile] = useState<ProfileView | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [stalls, setStalls] = useState<StallDto[]>([]);
  const [isStallModalOpen, setIsStallModalOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await api.get<ProfileView>('/api/profile');
        setProfile({
          name: data.name,
          bio: data.bio || 'Add bio',
          profileImage: data.profileImage || '/logo.png',
        });
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      }
    };

    //Stall
    const fetchStalls = async () => {
      try {
        const data = await api.get<(StallDto & { _id?: string })[]>('/api/stall');
        const validStalls = data
          .filter((s) => s.stallName)
          .map((s) => ({
            ...s,
            id: s.id ?? s._id ?? '',
          }));
        setStalls(validStalls);
      } catch (err) {
        console.error('Failed to fetch stall:', err);
      }
    };

    if (accessToken) {
      fetchProfile();
      fetchStalls();
    }
  }, [accessToken, api]);

  // Handle profile update
  const handleProfileUpdate = async (updated: ProfileView) => {
    try {
      const data = await api.put<ProfileView>('/api/profile', {
        name: updated.name,
        bio: updated.bio,
        profileImage: updated.profileImage,
      });

      setProfile({
        name: data.name,
        bio: data.bio || 'Add bio',
        profileImage: data.profileImage || '/logo.png',
      });
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
          {stalls.length > 0 ? (
            stalls.map((stall) => (
              <StallCard
                key={stall.id}
                stall={stall}
                //onClick={() => router.push(`/pages/stall-profile?id=${stall.id}`)}

                onClick={() => {
                  console.log('Navigating to stall:', stall.id);
                  router.push(`stall-profile/${stall.id}`);
                }}
              />
            ))
          ) : (
            <p className="text-muted">You haven't created any stalls yet.</p>
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
