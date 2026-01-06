import { useEffect, useRef } from 'react';
import * as Diff from 'diff';


/**
 * Custom hook to manage diff decorations in Monaco Editor
 */
export const useDiffDecorations = (
    editorRef: React.MutableRefObject<any>,
    monacoRef: React.MutableRefObject<any>,
    originalContent: string,
    currentContent: string
) => {
    const decorationsRef = useRef<string[]>([]);

    useEffect(() => {
        if (!editorRef.current || !monacoRef.current) return;

        // Calculate diff
        const diff = Diff.diffLines(originalContent, currentContent);
        const newDecorations: any[] = [];
        let lineNumber = 1;

        diff.forEach((part) => {
            if (part.added) {
                const count = part.count || 0;
                const endLine = lineNumber + count - 1;
                newDecorations.push({
                    range: new monacoRef.current.Range(lineNumber, 1, endLine, 1),
                    options: {
                        isWholeLine: true,
                        className: 'dirty-line-highlight',
                        glyphMarginClassName: 'dirty-line-gutter'
                    }
                });
                lineNumber += count;
            } else if (!part.removed) {
                lineNumber += (part.count || 0);
            }
        });

        // Apply decorations using deltaDecorations (oldDecorations, newDecorations)
        decorationsRef.current = editorRef.current.deltaDecorations(decorationsRef.current, newDecorations);

    }, [currentContent, originalContent, editorRef, monacoRef]);
};
