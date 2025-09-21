import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/server/middleware/auth';
import { ProfileService } from '@/server/modules/profile/service';
import { findUserById } from '@/server/modules/auth/repository';

export async function GET(req: NextRequest) {
  const auth = authenticateRequest(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const result = await ProfileService.getProfile(auth.userId);
    if (!result) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const { profile, name } = result;

    return NextResponse.json({
      name,
      bio: profile.bio || '',
      profileImage: profile.profileImage || '',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const auth = authenticateRequest(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const { name, bio, profileImage } = await req.json();

    if (name) {
      await ProfileService.updateUserName(auth.userId, name);
    }

    const updated = await ProfileService.updateProfile(auth.userId, {
      bio,
      profileImage,
    });

    return NextResponse.json({
      name,
      bio: updated?.bio || '',
      profileImage: updated?.profileImage || '',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = authenticateRequest(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const { bio, profileImage } = await req.json();

    const profile = await ProfileService.createProfile(auth.userId, bio, profileImage);
    const user = await findUserById(auth.userId);

    return NextResponse.json({
      name: user?.name || 'Unknown User',
      bio: profile.bio || '',
      profileImage: profile.profileImage || '',
    }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
