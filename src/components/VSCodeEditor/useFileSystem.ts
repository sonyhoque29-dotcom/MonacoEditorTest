import { useState, useRef } from 'react';
import type { FileNode, OpenFile, FileSystemDirectoryHandle, FileSystemFileHandle } from './types';

// Helper to construct FileNode from FileSystemHandle
const buildFileTree = async (
    handle: FileSystemDirectoryHandle,
    path: string
): Promise<FileNode> => {
    const children: FileNode[] = [];

    // @ts-ignore - entries() is an async iterable in recent browsers
    for await (const [name, entry] of handle.entries()) {
        const entryPath = `${path}/${name}`;
        if (entry.kind === 'directory') {
            children.push(await buildFileTree(entry as FileSystemDirectoryHandle, entryPath));
        } else {
            children.push({
                id: entryPath, // Use path as ID for simplicity
                name,
                type: 'file',
                path: entryPath,
                language: getLanguageFromExtension(name),
            });
        }
    }

    // Sort: folders first, then files
    children.sort((a, b) => {
        if (a.type === b.type) return a.name.localeCompare(b.name);
        return a.type === 'folder' ? -1 : 1;
    });

    return {
        id: path,
        name: handle.name,
        type: 'folder',
        path: path,
        children,
    };
};

const getLanguageFromExtension = (filename: string): string => {
    if (filename.endsWith('.tsx') || filename.endsWith('.ts')) return 'typescript';
    if (filename.endsWith('.jsx') || filename.endsWith('.js')) return 'javascript';
    if (filename.endsWith('.css')) return 'css';
    if (filename.endsWith('.html')) return 'html';
    if (filename.endsWith('.json')) return 'json';
    if (filename.endsWith('.md')) return 'markdown';
    return 'plaintext';
};

const API_URL = 'http://localhost:3001';

export const useFileSystem = () => {
    const [fileSystem, setFileSystem] = useState<FileNode[]>([]);
    const [openFiles, setOpenFiles] = useState<OpenFile[]>([]);
    const [activeFileId, setActiveFileId] = useState<string | null>(null);
    const [fileContents, setFileContents] = useState<Record<string, string>>({});

    // Store handles to allow lazy reading/writing
    const fileHandles = useRef<Record<string, FileSystemFileHandle>>({});

    // Recursive helper to collect all file handles into the ref
    const cacheHandles = async (dirHandle: FileSystemDirectoryHandle, path: string) => {
        // @ts-ignore
        for await (const [name, entry] of dirHandle.entries()) {
            const entryPath = `${path}/${name}`;
            if (entry.kind === 'file') {
                fileHandles.current[entryPath] = entry as FileSystemFileHandle;
            } else if (entry.kind === 'directory') {
                await cacheHandles(entry as FileSystemDirectoryHandle, entryPath);
            }
        }
    };

    const openFolder = async () => {
        try {
            // @ts-ignore - showDirectoryPicker is experimental/new
            const dirHandle = await window.showDirectoryPicker();

            // Build tree
            const rootNode = await buildFileTree(dirHandle, dirHandle.name); // path starts with dir name

            // Cache handles for reading/writing
            fileHandles.current = {}; // clear old
            await cacheHandles(dirHandle, dirHandle.name);

            setFileSystem([rootNode]);
            setOpenFiles([]);
            setActiveFileId(null);
            setFileContents({});

        } catch (err) {
            console.error('Error opening folder:', err);
            // User likely cancelled
        }
    };

    const openFile = async (node: FileNode) => {
        if (node.type !== 'file') return;

        // Check if already open
        const existing = openFiles.find(f => f.id === node.id);
        if (existing) {
            setActiveFileId(node.id);
            return;
        }

        // Read content if not in memory
        let content = fileContents[node.id];
        if (content === undefined) {
            const handle = fileHandles.current[node.id];
            if (handle) {
                try {
                    const file = await handle.getFile();
                    content = await file.text();
                } catch (e) {
                    console.error("Failed to read file", e);
                    content = "// Failed to read file";
                }
            } else {
                content = "// File content not available (Mock or Error)";
            }

            // Update memory cache
            setFileContents(prev => ({ ...prev, [node.id]: content }));
        }

        const newFile: OpenFile = {
            id: node.id,
            name: node.name,
            path: node.path,
            language: node.language || 'plaintext',
            originalContent: content,
            currentContent: content,
            isDirty: false,
            viewMode: node.language === 'json' ? 'text' : undefined,
        };

        setOpenFiles(prev => [...prev, newFile]);
        setActiveFileId(node.id);
    };

    const updateFileViewMode = (id: string, mode: 'text' | 'ui') => {
        setOpenFiles(prev => prev.map(f => f.id === id ? { ...f, viewMode: mode } : f));
    };

    const closeFile = (id: string) => {
        if (activeFileId === id) {
            const idx = openFiles.findIndex(f => f.id === id);
            if (openFiles.length > 1) {
                const newIdx = idx > 0 ? idx - 1 : idx + 1;
                setActiveFileId(openFiles[newIdx].id);
            } else {
                setActiveFileId(null);
            }
        }
        setOpenFiles(prev => prev.filter(f => f.id !== id));
    };

    const updateFileContent = (id: string, content: string) => {
        setOpenFiles(prev => prev.map(f => {
            if (f.id === id) {
                return {
                    ...f,
                    currentContent: content,
                    isDirty: content !== f.originalContent
                };
            }
            return f;
        }));
    };

    const saveFile = async (id: string) => {
        const file = openFiles.find(f => f.id === id);
        if (!file) return;

        try {
            // Check if it's a REMOTE file
            if (id.startsWith('remote://')) {
                const filename = id.replace('remote://', '');
                const response = await fetch(`${API_URL}/file/${filename}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'text/plain' },
                    body: file.currentContent
                });

                if (!response.ok) throw new Error('Failed to save to server');
            } else {
                // Local File System Access
                const handle = fileHandles.current[id];
                if (handle) {
                    const writable = await handle.createWritable();
                    await writable.write(file.currentContent);
                    await writable.close();
                } else {
                    console.warn("No handle found for file, cannot save to disk (Mock mode?)");
                }
            }

            // Update state to reflect save
            setFileContents(prev => ({ ...prev, [id]: file.currentContent }));
            setOpenFiles(prev => prev.map(f => {
                if (f.id === id) {
                    return { ...f, originalContent: f.currentContent, isDirty: false };
                }
                return f;
            }));

        } catch (err) {
            console.error("Error saving file:", err);
            alert("Failed to save file!");
        }
    };


    // --- SSR / API Actions ---

    const generateBigFile = async () => {
        try {
            await fetch(`${API_URL}/generate-big-json`, { method: 'POST' });
            alert('Big file generated on server (big-data.json)');
        } catch (e) {
            console.error(e);
            alert('Failed to generate file. Is server running on 3001?');
        }
    };

    const openRemoteFile = async (filename: string) => {
        const id = `remote://${filename}`;

        // Check if open
        const existing = openFiles.find(f => f.id === id);
        if (existing) {
            setActiveFileId(id);
            return;
        }

        try {
            // "SSR" Fetch
            const res = await fetch(`${API_URL}/file/${filename}`);
            if (!res.ok) throw new Error('File not found API');

            const content = await res.text();

            setFileContents(prev => ({ ...prev, [id]: content }));

            const newFile: OpenFile = {
                id,
                name: filename,
                path: `/server/${filename}`,
                language: 'json',
                originalContent: content,
                currentContent: content,
                isDirty: false,
                viewMode: 'text',
            };

            setOpenFiles(prev => [...prev, newFile]);
            setActiveFileId(id);

        } catch (e) {
            console.error(e);
            alert('Failed to fetch remote file');
        }
    };

    return {
        fileSystem,
        openFiles,
        activeFileId,
        setActiveFileId,
        openFolder,
        openFile,
        closeFile,
        updateFileContent,
        saveFile,

        // Remote
        generateBigFile,
        openRemoteFile,
        updateFileViewMode
    };
};
