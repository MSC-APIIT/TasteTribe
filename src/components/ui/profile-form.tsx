'use client';

import { useState } from 'react';
import { Input } from './input';
import { Label } from './label';
import { Button } from './button';
import { Profile } from './profile-card';

export function ProfileForm({
  onSubmit,
  initialData,
}: {
  onSubmit: (profile: Profile) => void;
  initialData: Profile;
}) {
  const [name, setName] = useState(initialData.name);
  const [bio, setBio] = useState(initialData.bio);
  const [profilePicture, setProfilePicture] = useState(
    initialData.profilePicture
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, bio, profilePicture });
  };

  const handleProfilePictureChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfilePicture(event.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="profileName">Name</Label>
        <Input
          id="profileName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="profileBio">Bio</Label>
        <Input
          id="profileBio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="profilePicture">Profile Picture</Label>
        <Input
          id="profilePicture"
          type="file"
          accept="image/*"
          onChange={handleProfilePictureChange}
        />
        {profilePicture && (
          <img
            src={profilePicture}
            alt="Profile"
            className="mt-4 h-32 w-32 object-cover rounded-full"
          />
        )}
      </div>
      <Button type="submit">Save</Button>
    </form>
  );
}
