export interface FileNode {
    id: string;
    name: string;
    type: 'file' | 'folder';
    path: string;
    language?: string;
    content?: string;
    children?: FileNode[];
}

export interface OpenFile {
    id: string;
    name: string;
    path: string;
    language: string;
    originalContent: string;
    currentContent: string;
    isDirty: boolean;
    viewMode?: 'text' | 'ui';
}

// Minimal type definitions for File System Access API if not globally available
export interface FileSystemHandle {
    kind: 'file' | 'directory';
    name: string;
}

export interface FileSystemFileHandle extends FileSystemHandle {
    kind: 'file';
    getFile(): Promise<File>;
    createWritable(): Promise<FileSystemWritableFileStream>;
}

export interface FileSystemDirectoryHandle extends FileSystemHandle {
    kind: 'directory';
    entries(): AsyncIterableIterator<[string, FileSystemHandle]>;
    // resolve(possibleDescendant: FileSystemHandle): Promise<string[] | null>;
}

export interface FileSystemWritableFileStream extends WritableStream {
    write(data: string | BufferSource | Blob): Promise<void>;
    close(): Promise<void>;
}

// Monaco Editor imperative handle interface
export interface MonacoEditorHandle {
    getValue: () => string | undefined;
    setValue: (value: string) => void;
    focus: () => void;
    save: () => void;
    onEdit: (content: string) => void;
}
