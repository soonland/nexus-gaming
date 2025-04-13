import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

import { cloudinaryConfig } from '@/lib/cloudinary';
import { getCurrentUser } from '@/lib/jwt';

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

    const result = await new Promise<{ result: string }>((resolve, reject) => {
      cloudinary.uploader.destroy(
        publicId,
        (error: Error | undefined, result: { result: string }) => {
          if (error) {
            console.error('Cloudinary delete error:', error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
