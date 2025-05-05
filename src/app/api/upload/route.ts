import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

import { cloudinaryConfig } from '@/lib/cloudinary';
import { getCurrentUser } from '@/lib/jwt';
import { uploadImageServer } from '@/lib/upload/server';

cloudinary.config(cloudinaryConfig);

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const folder = formData.get('folder') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await uploadImageServer(buffer, folder || 'default');

    if (!result.public_id) {
      console.error('Missing public_id in uploadImageServer result');
      return NextResponse.json(
        { error: 'Invalid upload response' },
        { status: 500 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
