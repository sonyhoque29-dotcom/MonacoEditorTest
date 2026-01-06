import { useRef, useImperativeHandle, forwardRef } from 'react';
import { useDiffDecorations } from './useDiffDecorations';
import Editor from '@monaco-editor/react';
import type { OpenFile, MonacoEditorHandle } from './types';

interface Props {
    file: OpenFile;
    onChange: (id: string, content: string) => void;
    onSave: (id: string) => void;
    theme?: string;
    options?: any;
}

const MonacoEditorWrapper = forwardRef<MonacoEditorHandle, Props>(
    ({ file, onChange, onSave, theme = 'vs-light', options = {} }, ref) => {
        const editorRef = useRef<any>(null);
        const monacoRef = useRef<any>(null);

        // Expose methods to parent via ref
        useImperativeHandle(ref, () => ({
            getValue: () => editorRef.current?.getValue(),
            setValue: (value: string) => editorRef.current?.setValue(value),
            focus: () => editorRef.current?.focus(),
            save: () => onSave(file.id),
            onEdit: (value: string) => {
                editorRef.current?.setValue(value);
                onChange(file.id, value);
            }
        }));

        // Use custom hook for diff decorations
        useDiffDecorations(editorRef, monacoRef, file.originalContent, file.currentContent);

        return (
            <Editor
                height="100%"
                theme={theme}
                path={file.path}
                defaultLanguage={file.language}
                value={file.currentContent}
                onChange={(value) => value !== undefined && onChange(file.id, value)}
                onMount={(editor, monaco) => {
                    editorRef.current = editor;
                    monacoRef.current = monaco;
                    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => onSave(file.id));
                    editor.focus();
                }}
                options={options}
            />
        );
    }
);

MonacoEditorWrapper.displayName = 'MonacoEditorWrapper';

export default MonacoEditorWrapper;
