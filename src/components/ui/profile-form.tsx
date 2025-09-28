'use client';

import { useState } from 'react';
import { Input } from './input';
import { Label } from './label';
import { Button } from './button';
import { ProfileView } from './profile-card';


export function ProfileForm({
  onSubmit,
  initialData,
}: {
  // eslint-disable-next-line no-unused-vars
  onSubmit: (profile: ProfileView) => void;
  initialData: ProfileView;
}) {
  const [name, setName] = useState(initialData.name);
  const [bio, setBio] = useState(initialData.bio);
  const [profileImage, setprofileImage] = useState(
    initialData.profileImage
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, bio, profileImage });
  };

  const handleProfilePictureChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setprofileImage(event.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="bio">Bio</Label>
        <Input
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="profileImage">Profile Picture</Label>
        <Input
          id="profileImage"
          type="file"
          accept="image/*"
          onChange={handleProfilePictureChange}
        />
        {profileImage && (
          <img
            src={profileImage}
            alt="Profile"
            className="mt-4 h-32 w-32 object-cover rounded-full"
          />
        )}
      </div>
      <Button type="submit">Save</Button>
    </form>
  );
}
