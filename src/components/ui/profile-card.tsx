'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './card';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { Button } from './button';

export interface Profile {
  name: string;
  bio: string;
  profilePicture: string;
}

export function ProfileCard({
  profile,
  onEdit,
}: {
  profile: Profile;
  onEdit: () => void;
}) {
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
        <Button onClick={onEdit}>Edit Profile</Button>
      </CardContent>
    </Card>
  );
}
