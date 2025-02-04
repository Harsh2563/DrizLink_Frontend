import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { FileEntry } from '@/app/interfaces/interfaces';

async function listDirectoryContents(StoreFilePath: string): Promise<FileEntry[]> {
  try {
    const cleanPath = path.normalize(StoreFilePath).replace(/^(\.\.(\/|\\|$))+/, '');
    const absolutePath = path.resolve(cleanPath);

    const stats = await fs.promises.stat(absolutePath);
    if (!stats.isDirectory()) {
      throw new Error('Path is not a directory');
    }

    const entries = await fs.promises.readdir(absolutePath, { withFileTypes: true });

    return await Promise.all(entries.map(async (dirent) => {
      const entryPath = path.join(absolutePath, dirent.name);
      const stats = await fs.promises.stat(entryPath);

      return {
        name: dirent.name,
        path: entryPath,
        type: dirent.isDirectory() ? 'folder' : 'file',
        size: stats.size
      };
    }));
  } catch (error) {
    console.error('Directory listing error:', error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { path: dirPath } = await request.json();
    const entries = await listDirectoryContents(dirPath);
    
    return NextResponse.json({ entries });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to list directory contents' },
      { status: 500 }
    );
  }
}
