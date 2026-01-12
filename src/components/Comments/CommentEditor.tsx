import React, { useState } from 'react';
import {
    Box,
    Paper,
    IconButton,
    Button,
    TextField,
    Divider,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
} from '@mui/material';
import {
    FormatBold,
    FormatItalic,
    FormatUnderlined,
    FormatColorText,
    InsertLink,
    AttachFile,
    FormatListBulleted,
    FormatListNumbered,
    SentimentSatisfiedAlt,
    Add as AddIcon,
    UnfoldMore,
    Undo,
    Redo,
    Lock,
    ArrowDropDown,
} from '@mui/icons-material';

const CommentEditor: React.FC = () => {
    const [viewMode, setViewMode] = useState('visual');


    // Identify common icon styles for toolbar
    const iconButtonStyle = { padding: '4px', color: '#555' };

    return (
        <Box sx={{ p: 2, maxWidth: 800 }}>
            {/* Label above the editor */}
            <Typography variant="subtitle2" sx={{ mb: 0.5, fontWeight: 600, color: '#444' }}>
                Comment
            </Typography>

            <Paper
                elevation={0}
                sx={{
                    border: '1px solid #ddd',
                    borderRadius: 1,
                }}
            >
                {/* --- HEADER / TOOLBAR --- */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        p: 0.5,
                        borderBottom: '1px solid #eee',
                        bgcolor: '#fcfcfc',
                        gap: 0.5,
                    }}
                >
                    {/* Style Dropdown Mock */}
                    <Button
                        size="small"
                        endIcon={<ArrowDropDown />}
                        sx={{ textTransform: 'none', color: '#333', minWidth: 'auto', px: 1 }}
                    >
                        Style
                    </Button>

                    <Divider orientation="vertical" flexItem sx={{ mx: 0.5, height: 20, alignSelf: 'center' }} />

                    {/* Formatting Group 1 */}
                    <IconButton size="small" sx={iconButtonStyle}><FormatBold fontSize="small" /></IconButton>
                    <IconButton size="small" sx={iconButtonStyle}><FormatItalic fontSize="small" /></IconButton>
                    <IconButton size="small" sx={iconButtonStyle}><FormatUnderlined fontSize="small" /></IconButton>
                    <IconButton size="small" sx={iconButtonStyle}>
                        <FormatColorText fontSize="small" sx={{ color: 'red' }} />
                        <ArrowDropDown fontSize="small" sx={{ ml: -0.5, color: '#555' }} />
                    </IconButton>
                    <IconButton size="small" sx={iconButtonStyle}>
                        <FormatColorText fontSize="small" />
                        <ArrowDropDown fontSize="small" sx={{ ml: -0.5, color: '#555' }} />
                    </IconButton>

                    <Divider orientation="vertical" flexItem sx={{ mx: 0.5, height: 20, alignSelf: 'center' }} />

                    {/* Links & Attachments */}
                    <IconButton size="small" sx={iconButtonStyle}>
                        <InsertLink fontSize="small" />
                        <ArrowDropDown fontSize="small" sx={{ ml: -0.5, color: '#555' }} />
                    </IconButton>
                    <IconButton size="small" sx={iconButtonStyle}>
                        <AttachFile fontSize="small" sx={{ transform: 'rotate(45deg)' }} />
                        <ArrowDropDown fontSize="small" sx={{ ml: -0.5, color: '#555' }} />
                    </IconButton>

                    <Divider orientation="vertical" flexItem sx={{ mx: 0.5, height: 20, alignSelf: 'center' }} />

                    {/* Lists */}
                    <IconButton size="small" sx={iconButtonStyle}><FormatListBulleted fontSize="small" /></IconButton>
                    <IconButton size="small" sx={iconButtonStyle}><FormatListNumbered fontSize="small" /></IconButton>

                    <Divider orientation="vertical" flexItem sx={{ mx: 0.5, height: 20, alignSelf: 'center' }} />

                    {/* Media / Extra */}
                    <IconButton size="small" sx={iconButtonStyle}>
                        <SentimentSatisfiedAlt fontSize="small" />
                        <ArrowDropDown fontSize="small" sx={{ ml: -0.5, color: '#555' }} />
                    </IconButton>
                    <IconButton size="small" sx={iconButtonStyle}>
                        <AddIcon fontSize="small" />
                        <ArrowDropDown fontSize="small" sx={{ ml: -0.5, color: '#555' }} />
                    </IconButton>

                    <Box sx={{ flexGrow: 1 }} />

                    {/* Expand Icon at far right of header */}
                    <IconButton size="small" sx={iconButtonStyle}>
                        <UnfoldMore fontSize="small" />
                    </IconButton>
                </Box>

                {/* --- BODY / TEXT AREA --- */}
                <Box sx={{ position: 'relative' }}>
                    <TextField
                        multiline
                        minRows={4}
                        fullWidth
                        variant="standard"
                        placeholder=""
                        InputProps={{
                            disableUnderline: true,
                            sx: {
                                p: 2,
                                fontSize: '0.95rem',
                                '& textarea': {
                                    minHeight: '100px'
                                }
                            },
                        }}
                    />
                    {/* Grammarly-like icon mock in bottom right of text area */}
                    <Box sx={{ position: 'absolute', bottom: 8, right: 8 }}>
                        <Box
                            sx={{
                                width: 24,
                                height: 24,
                                bgcolor: 'teal',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: 14,
                                fontWeight: 'bold'
                            }}
                        >
                            G
                        </Box>
                    </Box>
                </Box>

                {/* --- FOOTER --- */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderTop: '1px solid #eee',
                        bgcolor: '#f9f9f9',
                        p: 1,
                    }}
                >
                    {/* LEFT: Visual / Text Toggle */}
                    <ToggleButtonGroup
                        value={viewMode}
                        exclusive
                        onChange={(_e, newMode) => newMode && setViewMode(newMode)}
                        size="small"
                        sx={{ height: 32 }}
                    >
                        <ToggleButton
                            value="visual"
                            sx={{
                                textTransform: 'none',
                                px: 2,
                                fontSize: '0.85rem',
                                bgcolor: viewMode === 'visual' ? '#e3f2fd' : 'transparent',
                                '&.Mui-selected': { bgcolor: '#e3f2fd', color: '#1976d2' }
                            }}
                        >
                            Visual
                        </ToggleButton>
                        <ToggleButton
                            value="text"
                            sx={{
                                textTransform: 'none',
                                px: 2,
                                fontSize: '0.85rem',
                                bgcolor: viewMode === 'text' ? '#e3f2fd' : 'transparent',
                                '&.Mui-selected': { bgcolor: '#e3f2fd', color: '#1976d2' }
                            }}
                        >
                            Text
                        </ToggleButton>
                    </ToggleButtonGroup>

                    {/* RIGHT GROUP: Undo - Redo - Viewable - Add - Cancel */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {/* Center-Right: Undo/Redo */}
                        <Box sx={{ display: 'flex', gap: 0.5, mr: 1 }}>
                            <Button size="small" sx={{ minWidth: 'auto', px: 1, color: '#555' }}>
                                <Undo fontSize="small" />
                            </Button>
                            <Button size="small" sx={{ minWidth: 'auto', px: 1, color: '#555' }}>
                                <Redo fontSize="small" />
                            </Button>
                        </Box>
                        <Divider orientation="vertical" flexItem sx={{ height: 24, alignSelf: 'center', mx: 1 }} />

                        {/* Viewable Dropdown */}
                        <Button
                            size="small"
                            startIcon={<Lock fontSize="small" sx={{ color: '#5f6368' }} />}
                            endIcon={<ArrowDropDown fontSize="small" />}
                            sx={{
                                textTransform: 'none',
                                color: '#444',
                                fontSize: '0.85rem',
                                minWidth: 'auto',
                            }}
                        >
                            Viewable by All Users
                        </Button>

                        {/* Add Button */}
                        <Button
                            variant="contained"
                            disableElevation
                            sx={{
                                textTransform: 'none',
                                bgcolor: '#f0f0f0',
                                color: '#aaa',
                                fontWeight: 600,
                                fontSize: '0.85rem',
                                '&:hover': { bgcolor: '#e0e0e0' },
                                height: 32,
                            }}
                        >
                            Add
                        </Button>

                        {/* Cancel Button */}
                        <Button
                            sx={{
                                textTransform: 'none',
                                color: '#1976d2',
                                fontSize: '0.85rem',
                                minWidth: 'auto',
                                height: 32,
                            }}
                        >
                            Cancel
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
};

export default CommentEditor;
