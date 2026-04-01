import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(__dirname, '../../configs/data/workshops');

function filePath(uid) {
  return path.join(dataDir, `${uid}.json`);
}

export async function readLocalState(uid) {
  try {
    const data = await fs.readFile(filePath(uid), 'utf-8');
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export async function writeLocalState(uid, state) {
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(filePath(uid), JSON.stringify(state, null, 2), 'utf-8');
  return state;
}
