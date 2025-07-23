// middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { shouldRunTask, runTask } from './src/lib/automation/task';

export function middleware(request: NextRequest) {
  const interval = 60 * 1000; // 1 minute (for demo), set to 4 * 60 * 60 * 1000 for 4 hrs

  if (shouldRunTask(interval)) {
    runTask();
  }

  return NextResponse.next();
}

