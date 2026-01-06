import React from 'react';
import { Box } from '@mui/material';
import MonacoEditorWrapper from './MonacoEditorWrapper';
import { getEditorOptions } from './MonacoEditorOperation';
import type { OpenFile } from './types';

interface Props {
    file: OpenFile;
    onChange: (id: string, content: string) => void;
    onSave?: (id: string) => void;
}

const PlainTextEditor: React.FC<Props> = ({ file, onChange, onSave }) => {
    // We use a simplified options set for "UI" mode but run it via Monaco
    // to get the decorations/highlights for free.
    const options = {
        ...getEditorOptions(file),
        minimap: { enabled: false }, // Hide minimap for "Plain" feel
        lineNumbers: 'off',          // Hide line numbers
        glyphMargin: true,           // KEEP glyph margin for dirty indicators!
        folding: false,
    };

    // We don't strictly need imperative handle here if we just want rendering + editing
    // but the wrapper expects onSave. We can pass a dummy or real save.
    // EditorArea passes onSave to PlainTextEditor? No, currently it doesn't.
    // We should allow saving here too via Ctrl+S.

    // Check if EditorArea passes onSave. It didn't in the original code. 
    // We will just pass a no-op or we need to update EditorArea to pass it.
    // For now, let's look at EditorArea usage: <PlainTextEditor file={file} onChange={onEditorChange} />
    // It does NOT pass onSave.

    const handleSave = (id: string) => {
        if (onSave) onSave(id);
    };

    return (
        <Box sx={{ height: '100%', width: '100%', boxSizing: 'border-box' }}>
            <MonacoEditorWrapper
                file={file}
                onChange={onChange}
                onSave={handleSave} // Shortcut support enabled
                theme="vs-light"
                options={options as any}
            />
        </Box>
    );
};

export default PlainTextEditor;
