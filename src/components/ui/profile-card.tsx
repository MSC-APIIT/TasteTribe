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
import { ProfileView } from '../../app/types/profileView';

export function ProfileCard({
  profile,
  onEdit,
}: {
  profile: ProfileView;
  onEdit: () => void;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-24 w-24">
          <AvatarImage src={profile.profileImage} alt={profile.name} />
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
export type { ProfileView };