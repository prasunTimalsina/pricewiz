import { NextResponse } from 'next/server';
import { runTask, shouldRun } from '@/lib/automation/task';

const INTERVAL = 60 * 1000; // 1 minute

export async function GET() {
    if (shouldRun(INTERVAL)) {
        const msg = runTask();
        return NextResponse.json({ status: 'ran', message: msg });
    }
    return NextResponse.json({ status: 'skipped' });
}

