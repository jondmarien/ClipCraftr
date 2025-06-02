import { authOptions } from '../auth-options';
import { NextResponse } from 'next/server';

export async function GET() {
  const providers = authOptions.providers || [];
  return NextResponse.json(providers);
}
