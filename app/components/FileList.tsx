// Update the FileList component
import { useState } from 'react';
import { FileEntry } from '../interfaces/interfaces';
import { FolderIcon, DocumentIcon } from './icons';
import { useUserStore } from '../store/userStore';

interface FileListProps {
  files: FileEntry[];
  className?: string;
  userId: string | null;
}

export default function FileList({ files, className, userId }: FileListProps) {
  const { webSocket, id } = useUserStore()
  const [selectedFile, setSelectedFile] = useState<FileEntry | null>(null)
  const handleFileClick = (file: FileEntry) => {
    if (file.type === 'folder') return
    setSelectedFile(file)
  }

  const handleDownloadConfirm = () => {
    if (!webSocket || !selectedFile || !id) return

    // Create file request payload
    const request = {
      type: 'file-request',
      payload: {
        recipientId: userId,
        senderId: id,
        filename: selectedFile.name,
        filesize: selectedFile.size,
        filePath: selectedFile.path
      }
    }

    webSocket.send(JSON.stringify(request))
    setSelectedFile(null)
  }
  return (
    <div className={`w-full p-4 max-h-96 ${className}`}>
      <div className="grid grid-cols-1 gap-2">
        {files.map((file) => (
          <div
            key={file.path}
            onClick={() => handleFileClick(file)}
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

      {/* Download Confirmation Dialog */}
      {selectedFile && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800/90 rounded-xl border border-gray-700/50 p-6 w-96">
            <h2 className="text-gray-300 text-lg font-semibold mb-4">
              Download File
            </h2>
            <p className="text-gray-400 mb-4">
              Download "{selectedFile.name}" ({selectedFile.type}, {
                selectedFile.type === 'file' ?
                  `${(selectedFile.size / 1024).toFixed(2)} KB` : 'Folder'
              })?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setSelectedFile(null)}
                className="px-4 py-2 bg-gray-500/20 text-gray-300 rounded-lg hover:bg-gray-500/30"
              >
                Cancel
              </button>
              <button
                onClick={handleDownloadConfirm}
                className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30"
              >
                Confirm Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}