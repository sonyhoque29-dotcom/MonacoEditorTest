import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import { useFileSystem } from './useFileSystem';
import FileExplorer from './FileExplorer';
import EditorArea from './EditorArea';

const VSCodeEditor: React.FC = () => {
    const {
        fileSystem,
        openFiles,
        activeFileId,
        setActiveFileId,
        openFolder,
        openFile,
        closeFile,
        updateFileContent,
        saveFile,
        generateBigFile,
        openRemoteFile,
        updateFileViewMode
    } = useFileSystem();

    // Optional: Log state for debugging
    useEffect(() => {
        // console.log('Open Files:', openFiles);
        // console.log('Active ID:', activeFileId);
    }, [openFiles, activeFileId]);

    return (
        <Box sx={{ height: '100vh', display: 'flex', bgcolor: '#1e1e1e', color: '#d4d4d4' }}>
            <FileExplorer
                fileSystem={fileSystem}
                activeFileId={activeFileId}
                onFileClick={openFile}
                onOpenFolder={openFolder}
                onGenerateBigFile={generateBigFile}
                onOpenRemoteFile={() => openRemoteFile('big-data.json')}
            />

            <EditorArea
                openFiles={openFiles}
                activeFileId={activeFileId}
                onTabChange={setActiveFileId}
                onCloseTab={closeFile}
                onEditorChange={updateFileContent}
                onSave={saveFile}
                onToggleViewMode={updateFileViewMode}
            />
        </Box>
    );
};

export default VSCodeEditor;
