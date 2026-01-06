import { forwardRef, useImperativeHandle, useRef } from 'react';
import MonacoEditorWrapper from './MonacoEditorWrapper';
import type { OpenFile, MonacoEditorHandle } from './types';


// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get Monaco editor options based on file type
 */
export const getEditorOptions = (file: OpenFile) => {
    const baseOptions = {
        minimap: { enabled: true },
        fontSize: 14,
        wordWrap: 'on' as const,
        automaticLayout: true,
        scrollBeyondLastLine: false,
        renderWhitespace: 'selection' as const,
        tabSize: 2,
        insertSpaces: true,
        glyphMargin: true, // Enable glyph margin for dirty indicators
    };

    // Customize options based on file type
    if (file.language === 'json') {
        return {
            ...baseOptions,
            formatOnPaste: true,
            formatOnType: true,
        };
    }

    if (file.language === 'markdown') {
        return {
            ...baseOptions,
            wordWrap: 'on' as const,
            lineNumbers: 'on' as const,
        };
    }

    return baseOptions;
};

export const getEditorTheme = (darkMode: boolean = true): string => {
    return darkMode ? 'vs-dark' : 'vs-light';
};


interface MonacoEditorOperationProps {
    file: OpenFile;
    onChange: (id: string, content: string) => void;
    onSave: (id: string) => void;
}


const MonacoEditorOperation = forwardRef<MonacoEditorHandle, MonacoEditorOperationProps>(
    ({ file, onChange, onSave }, ref) => {
        const wrapperRef = useRef<MonacoEditorHandle>(null);

        // Expose methods to parent via ref
        useImperativeHandle(ref, () => ({
            getValue: () => wrapperRef.current?.getValue(),
            setValue: (value: string) => wrapperRef.current?.setValue(value),
            focus: () => wrapperRef.current?.focus(),
            save: () => wrapperRef.current?.save(),
            onEdit: (value: string) => wrapperRef.current?.onEdit(value)
        }));


        return (
            <MonacoEditorWrapper
                ref={wrapperRef}
                file={file}
                onChange={onChange}
                onSave={onSave}
                theme='vs-light'
                options={getEditorOptions(file)}
            />
        );
    }
);

MonacoEditorOperation.displayName = 'MonacoEditorOperation';

export default MonacoEditorOperation;
