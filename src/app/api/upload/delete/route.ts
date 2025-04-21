import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

import { cloudinaryConfig } from '@/lib/cloudinary';
import { getCurrentUser } from '@/lib/jwt';
import { deleteImageServer } from '@/lib/upload/server';

cloudinary.config(cloudinaryConfig);

export async function DELETE(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const publicId = searchParams.get('public_id');

    if (!publicId) {
      return NextResponse.json(
        { error: 'No public_id provided' },
        { status: 400 }
      );
    }

    await deleteImageServer(publicId);
    return NextResponse.json({ result: 'ok' });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
