import React, { useRef, createRef } from 'react';
import { Box, Tabs, Tab, IconButton, Typography, Button } from '@mui/material';
import MonacoEditorOperation from './MonacoEditorOperation';
import PlainTextEditor from './PlainTextEditor';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import type { OpenFile, MonacoEditorHandle } from './types';


interface EditorAreaProps {
    openFiles: OpenFile[];
    activeFileId: string | null;
    onTabChange: (fileId: string) => void;
    onCloseTab: (fileId: string) => void;
    onEditorChange: (fileId: string, content: string) => void;
    onSave: (fileId: string) => void;
    onToggleViewMode?: (fileId: string, mode: 'text' | 'ui') => void;
}

const EditorArea: React.FC<EditorAreaProps> = ({
    openFiles,
    activeFileId,
    onTabChange,
    onCloseTab,
    onEditorChange,
    onSave,
    onToggleViewMode
}) => {
    // Store refs for each editor instance
    const editorRefs = useRef<Map<string, React.RefObject<MonacoEditorHandle | null>>>(new Map());

    // Ensure we have a ref for each open file
    openFiles.forEach(file => {
        if (!editorRefs.current.has(file.id)) {
            editorRefs.current.set(file.id, createRef<MonacoEditorHandle>());
        }
    });

    // Clean up refs for closed files
    const openFileIds = new Set(openFiles.map(f => f.id));
    editorRefs.current.forEach((_, fileId) => {
        if (!openFileIds.has(fileId)) {
            editorRefs.current.delete(fileId);
        }
    });

    const handleSaveAll = () => {
        openFiles.forEach(file => {
            onSave(file.id);
        });
    };

    return (
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', bgcolor: '#1e1e1e' }}>
            {/* Tabs Bar */}
            {openFiles.length > 0 ? (
                <Box sx={{ bgcolor: '#2d2d2d', display: 'flex', alignItems: 'center' }}>
                    <Tabs
                        value={activeFileId}
                        onChange={(_, val) => onTabChange(val)}
                        variant="scrollable"
                        scrollButtons="auto"
                        sx={{
                            minHeight: 35,
                            '& .MuiTabs-indicator': {
                                backgroundColor: '#007acc',
                            },
                        }}
                    >
                        {openFiles.map((file) => (
                            <Tab
                                key={file.id}
                                id={`tab-${file.id}`}
                                value={file.id}
                                sx={{
                                    minHeight: 35,
                                    padding: '0 12px',
                                    textTransform: 'none',
                                    color: file.isDirty ? '#e2c08d' : '#909090', // Gold color for dirty files
                                    bgcolor: file.id === activeFileId ? '#1e1e1e' : 'transparent',
                                    borderRight: '1px solid #252526',
                                    borderTop: file.id === activeFileId ? '1px solid #007acc' : 'none', // Add top border for active tab like VS Code
                                    '&.Mui-selected': {
                                        color: file.isDirty ? '#e2c08d' : '#ffffff',
                                    },
                                }}
                                label={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Typography variant="body2" fontSize={13} sx={{ color: 'inherit' }}>
                                            {file.name}
                                        </Typography>
                                        {file.isDirty && (
                                            <Box
                                                sx={{
                                                    width: 8,
                                                    height: 8,
                                                    borderRadius: '50%',
                                                    bgcolor: '#e2c08d', // Dot for dirty state
                                                    ml: 0.5
                                                }}
                                            />
                                        )}
                                        <IconButton
                                            size="small"
                                            onClick={(e) => { e.stopPropagation(); onCloseTab(file.id); }}
                                            sx={{
                                                padding: '2px',
                                                ml: 0.5,
                                                color: 'inherit',
                                                opacity: file.id === activeFileId || file.isDirty ? 1 : 0, // Always show close btn for dirty or active
                                                transition: 'opacity 0.2s',
                                                '&:hover': {
                                                    bgcolor: 'rgba(255,255,255,0.1)',
                                                    color: 'white'
                                                }
                                            }}
                                        >
                                            <CloseIcon sx={{ fontSize: 14 }} />
                                        </IconButton>
                                    </Box>
                                }
                            />
                        ))}
                    </Tabs>
                    <Button
                        startIcon={<SaveIcon />}
                        onClick={handleSaveAll}
                        sx={{
                            color: '#ccccc7',
                            mr: 1,
                            textTransform: 'none',
                            minWidth: 'auto',
                            whiteSpace: 'nowrap',
                            '&:hover': {
                                bgcolor: 'rgba(255,255,255,0.1)',
                            }
                        }}
                    >
                        Save All
                    </Button>
                </Box>
            ) : (
                <Box sx={{ height: 35, bgcolor: '#2d2d2d' }} />
            )}
            {/* Editor Container */}
            <Box sx={{ flex: 1, position: 'relative' }}>
                {openFiles.map(file => (
                    <CustomTabPanel key={file.id} value={activeFileId} index={file.id}>
                        <Box sx={{ height: '100%', width: '100%', position: 'relative' }}>
                            {file.language === 'json' && (
                                <Box sx={{ position: 'absolute', top: 8, right: 12, zIndex: 20, display: 'flex', gap: 1 }}>
                                    <Button
                                        size="small"
                                        variant={file.viewMode === 'text' ? 'contained' : 'outlined'}
                                        onClick={() => onToggleViewMode && onToggleViewMode(file.id, 'text')}
                                    >
                                        Text
                                    </Button>
                                    <Button
                                        size="small"
                                        variant={file.viewMode === 'ui' ? 'contained' : 'outlined'}
                                        onClick={() => onToggleViewMode && onToggleViewMode(file.id, 'ui')}
                                    >
                                        UI
                                    </Button>
                                </Box>
                            )}

                            <Box sx={{ height: '100%', width: '100%' }}>
                                {file.language === 'json' && file.viewMode === 'ui' ? (
                                    <PlainTextEditor file={file} onChange={onEditorChange} onSave={onSave} />
                                ) : (
                                    <MonacoEditorOperation
                                        ref={editorRefs.current.get(file.id)}
                                        file={file}
                                        onChange={onEditorChange}
                                        onSave={onSave}
                                    />
                                )}
                            </Box>
                        </Box>
                    </CustomTabPanel>
                ))}
            </Box>
        </Box>
    );
};

interface TabPanelProps {
    children?: React.ReactNode;
    index: string;
    value: string | null;
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
            {...other}
            style={{
                height: '100%',
                width: '100%',
                display: value === index ? 'block' : 'none'
            }}
        >
            <Box sx={{ height: '100%', width: '100%' }}>
                {children}
            </Box>
        </div>
    );
}

export default EditorArea;
