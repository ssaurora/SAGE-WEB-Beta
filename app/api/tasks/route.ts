import { NextResponse } from 'next/server';
import { taskListMock } from '@/lib/mock/task';

export async function GET() {
  return NextResponse.json(taskListMock);
}
