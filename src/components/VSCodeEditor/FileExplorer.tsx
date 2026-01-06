import React from 'react';
import { Box, Paper, Typography, Button } from '@mui/material';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import FolderIcon from '@mui/icons-material/Folder';
import DescriptionIcon from '@mui/icons-material/Description';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import type { FileNode } from './types';

interface FileExplorerProps {
    fileSystem: FileNode[];
    activeFileId: string | null;
    onFileClick: (node: FileNode) => void;
    onOpenFolder: () => void;
    onGenerateBigFile: () => void;
    onOpenRemoteFile: () => void;
}

const FileExplorer: React.FC<FileExplorerProps> = ({
    fileSystem,
    activeFileId,
    onFileClick,
    onOpenFolder,
    onGenerateBigFile,
    onOpenRemoteFile
}) => {

    const renderTree = (nodes: FileNode[]) => (
        nodes.map((node) => (
            <TreeItem
                key={node.id}
                itemId={node.id}
                label={
                    <Box sx={{ display: 'flex', alignItems: 'center', py: 0.5 }}>
                        {node.type === 'folder' ? (
                            <Box component="span" sx={{ mr: 1, display: 'flex' }}><FolderIcon color="primary" fontSize="small" /></Box>
                        ) : (
                            <Box component="span" sx={{ mr: 1, display: 'flex' }}><DescriptionIcon color="action" fontSize="small" /></Box>
                        )}
                        <Typography variant="body2" sx={{ fontFamily: 'Inter, sans-serif', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {node.name}
                        </Typography>
                    </Box>
                }
                onClick={node.type === 'file' ? (e) => { e.stopPropagation(); if (node.name.endsWith('.json')) { onFileClick(node); } } : undefined}
            >
                {Array.isArray(node.children) ? renderTree(node.children) : null}
            </TreeItem>
        ))
    );

    return (
        <Paper
            sx={{
                width: 250,
                flexShrink: 0,
                bgcolor: '#252526',
                color: '#cccccc',
                borderRadius: 0,
                borderRight: '1px solid #333',
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
            }}
        >
            <Box sx={{ p: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', letterSpacing: 1, color: '#888' }}>
                    EXPLORER
                </Typography>
            </Box>

            <Box sx={{ px: 1, mb: 2 }}>
                <Button
                    variant="outlined"
                    size="small"
                    startIcon={<CreateNewFolderIcon />}
                    onClick={onOpenFolder}
                    fullWidth
                    sx={{
                        color: '#cccccc',
                        borderColor: '#3e3e42',
                        textTransform: 'none',
                        '&:hover': {
                            borderColor: '#007acc',
                            bgcolor: '#3e3e42'
                        }
                    }}
                >
                    Open Folder
                </Button>
            </Box>

            <Box sx={{ px: 1, mb: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="caption" sx={{ color: '#666', fontWeight: 'bold' }}>SERVER ACTIONS</Typography>
                <Button
                    variant="outlined"
                    size="small"
                    onClick={onGenerateBigFile}
                    fullWidth
                    sx={{ color: '#cccccc', borderColor: '#3e3e42', textTransform: 'none' }}
                >
                    Generate Big JSON
                </Button>
                <Button
                    variant="outlined"
                    size="small"
                    onClick={onOpenRemoteFile}
                    fullWidth
                    sx={{ color: '#cccccc', borderColor: '#3e3e42', textTransform: 'none' }}
                >
                    Load Big JSON (SSR)
                </Button>
            </Box>

            <Box sx={{ flex: 1, overflowY: 'auto' }}>
                {fileSystem.length > 0 ? (
                    <SimpleTreeView
                        slots={{
                            expandIcon: ChevronRightIcon,
                            collapseIcon: ExpandMoreIcon,
                        }}
                        selectedItems={activeFileId || null}
                    >
                        {renderTree(fileSystem)}
                    </SimpleTreeView>
                ) : (
                    <Box sx={{ p: 2, textAlign: 'center', opacity: 0.6 }}>
                        <Typography variant="body2">No folder opened.</Typography>
                    </Box>
                )}
            </Box>
        </Paper>
    );
};

export default FileExplorer;
