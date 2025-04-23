import type { NextRequest } from 'next/server';

import { verifyToken } from './jwt';

export async function authenticateToken(request: NextRequest) {
  const token = request.headers.get('Authorization')?.split(' ')[1];
  if (!token) return null;

  const payload = await verifyToken(token);
  return payload;
}
