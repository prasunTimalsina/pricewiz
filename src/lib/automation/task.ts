import fs from 'fs';
import path from 'path';

const FILE_PATH = path.resolve(process.cwd(), 'src/lib/lastRun.txt');

export function shouldRun(intervalMs: number): boolean {
  try {
    const lastRun = parseInt(fs.readFileSync(FILE_PATH, 'utf-8'));
    return Date.now() - lastRun >= intervalMs;
  } catch {
    return true;
  }
}

export function runTask(): string {
  const time = new Date().toLocaleString();
  fs.writeFileSync(FILE_PATH, Date.now().toString(), 'utf-8');
  const msg = `✅ Automated Task executed at ${time}`;
  console.log(msg);
  return msg;
}

