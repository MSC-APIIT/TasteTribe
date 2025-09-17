import { NextRequest, NextResponse } from 'next/server';
import { ProfileService } from '@/server/modules/profile/service';
import { findUserById } from '@/server/modules/auth/repository';
import { authenticateRequest } from '@/server/modules/auth/service';

//GET
export async function GET(req: NextRequest) {
  const auth = await authenticateRequest(req);
  if (auth instanceof NextResponse) return auth;

  const profile = await findUserById(auth.userId);
  if (!profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
  }

  return NextResponse.json({
    name: profile.name || 'Unknown User',
    bio: profile.bio || '',
    profileImage: profile.profileImage || '',
  });
}

//PUT
export async function PUT(req: NextRequest) {
  const auth = await authenticateRequest(req);
  if (auth instanceof NextResponse) return auth;

  const { name, bio, profileImage } = await req.json();

  try {
    const updated = await ProfileService.updateProfile(auth.userId, { name, bio, profileImage });
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

//POST
export async function POST(req: NextRequest) {
  const auth = await authenticateRequest(req);
  if (auth instanceof NextResponse) return auth;

  const { bio, profileImage } = await req.json();

  try {
    const profile = await ProfileService.createProfile(auth.userId, bio, profileImage);
    return NextResponse.json(profile, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
