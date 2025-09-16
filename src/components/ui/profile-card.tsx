'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './card';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { Button } from './button';
import { Modal } from './modal';
import { ProfileForm } from './profile-form';

export interface Profile {
  name: string;
  bio: string;
  profilePicture: string;
}

export function ProfileCard({ initialProfile }: { initialProfile: Profile }) {
  const [profile, setProfile] = useState(initialProfile);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleProfileUpdate = (updatedProfile: Profile) => {
    setProfile(updatedProfile);
    setIsModalOpen(false);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-24 w-24">
          <AvatarImage src={profile.profilePicture} alt={profile.name} />
          <AvatarFallback>{profile.name[0]}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle>{profile.name}</CardTitle>
          <CardDescription>{profile.bio}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <Button onClick={() => setIsModalOpen(true)}>Edit Profile</Button>
      </CardContent>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ProfileForm onSubmit={handleProfileUpdate} initialData={profile} />
      </Modal>
    </Card>
  );
}
