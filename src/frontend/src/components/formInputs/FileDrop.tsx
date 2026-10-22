import { useCallback, useState } from 'react';

interface FileDropProps {
  inputTitle: string;
  onFilesChange: (files: File[]) => void;
  id: string;
}

export function FileDrop({ inputTitle, onFilesChange, id }: FileDropProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);

  const addFiles = useCallback(
    (incoming: FileList | null) => {
      if (!incoming) return;
      const merged = [...files, ...Array.from(incoming)];
      setFiles(merged);
      onFilesChange(merged);
    },
    [files, onFilesChange],
  );

  const removeFile = (index: number) => {
    const updated = files.filter((_, i) => i !== index);
    setFiles(updated);
    onFilesChange(updated);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <label>{inputTitle}</label>

      {/* Drop Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => document.getElementById(id)?.click()}
        style={{
          backgroundColor: dragging ? '#3a3a3a' : '#2d2d2d',
          border: `2px dashed ${dragging ? '#888' : '#555'}`,
          borderRadius: '8px',
          padding: '30px',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          marginTop: '4px',
        }}
      >
        <p style={{ color: '#aaa', margin: 0, fontSize: '14px' }}>
          {dragging
            ? 'Drop files here...'
            : 'Drag & drop files here, or click to browse'}
        </p>
        <input
          id={id}
          type="file"
          multiple
          style={{ display: 'none' }}
          onChange={(e) => addFiles(e.target.files)}
        />
      </div>

      {/* File List */}
      {files.length > 0 && (
        <ul style={{ listStyle: 'none', padding: 0, marginTop: '10px' }}>
          {files.map((file, index) => (
            <li
              key={`${file.name}-${index}`}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#3a3a3a',
                borderRadius: '6px',
                padding: '6px 10px',
                marginBottom: '6px',
                fontSize: '13px',
                color: '#cfcfcf',
              }}
            >
              <span>{file.name}</span>
              <button
                type="button"
                onClick={() => removeFile(index)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ff6b6b',
                  cursor: 'pointer',
                  fontSize: '16px',
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
