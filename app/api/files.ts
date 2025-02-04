type FileEntry = {
    name: string;
    path: string;
    type: 'file' | 'folder';
    size: number;
  };

  export async function listDirectoryContents(path: string): Promise<FileEntry[]> {
    try {
      const response = await fetch('/api/list-directory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ path }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch directory contents');
      }
  
      const data = await response.json();
      return data.entries;
    } catch (error) {
      console.error('Error listing directory:', error);
      return [];
    }
  }