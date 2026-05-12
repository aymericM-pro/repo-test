import { readdirSync, statSync } from 'fs';
import { join } from 'path';

function collectFiles(dir: string, pattern: RegExp): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) return collectFiles(full, pattern);
    if (pattern.test(entry)) return [full];
    return [];
  });
}

export async function loadHandlers(...dirs: string[]): Promise<void> {
  const files = dirs.flatMap((dir) => collectFiles(dir, /\.handler\.(ts|js)$/));
  await Promise.all(files.map((file) => import(file)));
  console.log(`[mediator] ${files.length} handler(s) loaded`);
}
