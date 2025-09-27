/* eslint-disable no-console */
import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/server/middleware/auth';
import { ProfileService } from '@/server/modules/profile/service';
import { findUserById } from '@/server/modules/auth/repository';
import { uploadToCloudinary } from '@/server/middleware/upload';

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
    return NextResponse.json(
      { error: err.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const auth = authenticateRequest(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const formData = await req.formData();
    const name = formData.get('name') as string | null;
    const bio = formData.get('bio') as string | null;
    const avatar = formData.get('avatar') as File | null;

    let uploadedUrl: string | undefined;
    console.log('____________________________________1');

    if (avatar) {
      console.log('____________________________________2');

      const result = await uploadToCloudinary(avatar);
      console.log('____________________________________', result);
      uploadedUrl = result.secure_url;
    }

    if (name) {
      await ProfileService.updateUserName(auth.userId, name);
    }

    const updated = await ProfileService.updateProfile(auth.userId, {
      bio: bio || undefined,
      profileImage: uploadedUrl || undefined,
    });

    return NextResponse.json({
      name: name || undefined,
      bio: updated?.bio || '',
      profileImage: updated?.profileImage || '',
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const auth = authenticateRequest(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const formData = await req.formData();
    const bio = formData.get('bio') as string | null;
    const avatar = formData.get('avatar') as File | null;

    let uploadedUrl: string | undefined;

    if (avatar) {
      const result = await uploadToCloudinary(avatar);
      uploadedUrl = result.secure_url;
    }

    const profile = await ProfileService.createProfile(
      auth.userId,
      bio || undefined,
      uploadedUrl
    );
    const user = await findUserById(auth.userId);

    return NextResponse.json(
      {
        name: user?.name || 'Unknown User',
        bio: profile.bio || '',
        profileImage: profile.profileImage || '',
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
