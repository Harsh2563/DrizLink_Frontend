// Update the FileList component
import { FileEntry } from '../interfaces/interfaces';
import { FolderIcon, DocumentIcon } from './icons';

interface FileListProps {
  files: FileEntry[];
  className?: string;
}

export default function FileList({ files, className }: FileListProps) {
  return (
    <div className={`w-full p-4 overflow-y-auto max-h-96 ${className}`}>
      <div className="grid grid-cols-1 gap-2">
        {files.map((file) => (
          <div
            key={file.path}
            className="flex items-center p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700/70 cursor-pointer"
          >
            <div className="mr-3">
              {file.type === 'folder' ? (
                <FolderIcon className="w-6 h-6 text-yellow-400" />
              ) : (
                <DocumentIcon className="w-6 h-6 text-blue-400" />
              )}
            </div>
            <div className="min-w-0">
              <div className="text-gray-300 font-medium truncate">{file.name}</div>
              <div className="text-gray-500 text-sm">
                {file.type === 'file' ? `${(file.size / 1024).toFixed(2)} KB` : 'Folder'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}