import type { OpenFile, FileNode } from './types';

/**
 * Read file content from File object
 */
export const readFileContent = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target?.result as string;
            resolve(content || '');
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsText(file);
    });
};

/**
 * Write content to file using File System Access API
 */
export const writeFileContent = async (
    fileHandle: FileSystemFileHandle,
    content: string
): Promise<void> => {
    try {
        const writable = await fileHandle.createWritable();
        await writable.write(content);
        await writable.close();
    } catch (error) {
        console.error('Error writing file:', error);
        throw new Error('Failed to write file');
    }
};

/**
 * Validate file content
 */
export const validateFileContent = (content: string, fileType: string): { valid: boolean; error?: string } => {
    // JSON validation
    if (fileType === 'json') {
        try {
            JSON.parse(content);
            return { valid: true };
        } catch (error) {
            return {
                valid: false,
                error: `Invalid JSON: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    }

    // Add more validation rules as needed
    return { valid: true };
};

/**
 * Format file content based on type
 */
export const formatFileContent = (content: string, fileType: string): string => {
    try {
        if (fileType === 'json') {
            const parsed = JSON.parse(content);
            return JSON.stringify(parsed, null, 2);
        }
        return content;
    } catch (error) {
        console.error('Error formatting content:', error);
        return content;
    }
};

/**
 * Get file size in human-readable format
 */
export const getFileSize = (content: string): string => {
    const bytes = new Blob([content]).size;

    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

/**
 * Get line count from content
 */
export const getLineCount = (content: string): number => {
    return content.split('\n').length;
};

/**
 * Check if file has unsaved changes
 */
export const hasUnsavedChanges = (file: OpenFile): boolean => {
    return file.isDirty;
};

/**
 * Create a new OpenFile object
 */
export const createOpenFile = (
    fileNode: FileNode,
    content: string
): OpenFile => {
    return {
        id: fileNode.id,
        name: fileNode.name,
        path: fileNode.path,
        language: fileNode.language || 'plaintext',
        originalContent: content,
        currentContent: content,
        isDirty: false,
        viewMode: 'text'
    };
};

/**
 * Update file content and mark as dirty
 */
export const updateFileContent = (
    file: OpenFile,
    newContent: string
): OpenFile => {
    return {
        ...file,
        currentContent: newContent,
        isDirty: newContent !== file.originalContent
    };
};

/**
 * Mark file as saved (sync original with current)
 */
export const markFileAsSaved = (file: OpenFile): OpenFile => {
    return {
        ...file,
        originalContent: file.currentContent,
        isDirty: false
    };
};

/**
 * Revert file to original content
 */
export const revertFileContent = (file: OpenFile): OpenFile => {
    return {
        ...file,
        currentContent: file.originalContent,
        isDirty: false
    };
};

/**
 * Get file extension
 */
export const getFileExtension = (filename: string): string => {
    return filename.split('.').pop()?.toLowerCase() || '';
};

/**
 * Check if file is binary
 */
export const isBinaryFile = (filename: string): boolean => {
    const binaryExtensions = [
        'png', 'jpg', 'jpeg', 'gif', 'bmp', 'ico', 'svg',
        'pdf', 'zip', 'tar', 'gz', 'rar',
        'exe', 'dll', 'so', 'dylib',
        'mp3', 'mp4', 'avi', 'mov', 'wav'
    ];

    const ext = getFileExtension(filename);
    return binaryExtensions.includes(ext);
};

/**
 * Check if file is text-editable
 */
export const isTextEditable = (filename: string): boolean => {
    return !isBinaryFile(filename);
};

/**
 * Get file icon based on type
 */
export const getFileIcon = (filename: string): string => {
    const ext = getFileExtension(filename);

    const iconMap: Record<string, string> = {
        'js': '📜',
        'jsx': '⚛️',
        'ts': '📘',
        'tsx': '⚛️',
        'json': '📋',
        'html': '🌐',
        'css': '🎨',
        'md': '📝',
        'py': '🐍',
        'java': '☕',
        'cpp': '⚙️',
        'go': '🐹',
        'rs': '🦀',
    };

    return iconMap[ext] || '📄';
};

/**
 * Search text in file content
 */
export const searchInFile = (
    content: string,
    searchTerm: string,
    caseSensitive: boolean = false
): { line: number; column: number; match: string }[] => {
    const lines = content.split('\n');
    const results: { line: number; column: number; match: string }[] = [];

    const searchRegex = new RegExp(
        searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
        caseSensitive ? 'g' : 'gi'
    );

    lines.forEach((line, lineIndex) => {
        let match;
        while ((match = searchRegex.exec(line)) !== null) {
            results.push({
                line: lineIndex + 1,
                column: match.index + 1,
                match: match[0]
            });
        }
    });

    return results;
};
