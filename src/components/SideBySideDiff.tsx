// File: src/components/SideBySideDiff.tsx
'use client';

import React from 'react';

function parseLines(text: string) {
    return text.split('\n').map((line, index) => {
        const match = line.match(/^\[(.*?)\]\s+(Speaker \d+):\s+(.*)$/);
        if (!match) return { lineNumber: index + 1, timestamp: '', speaker: '', text: line };
        return {
            lineNumber: index + 1,
            timestamp: match[1],
            speaker: match[2],
            text: match[3],
        };
    });
}

export default function SideBySideDiff({ left, right }: { left: string; right: string }) {
    const leftParsed = parseLines(left);
    const rightParsed = parseLines(right);

    const maxLines = Math.max(leftParsed.length, rightParsed.length);

    return (
        <div className="grid grid-cols-[40px_1fr_40px_1fr] gap-2 bg-white/30 dark:bg-white/10 border border-white/40 p-4 rounded-xl text-sm font-mono">
            <div className="text-xs font-bold">#</div>
            <div className="text-blue-500 font-semibold mb-1">Nova 2</div>
            <div className="text-xs font-bold">#</div>
            <div className="text-green-500 font-semibold mb-1">Nova 3</div>

            {Array.from({ length: maxLines }).map((_, i) => {
                const leftLine = leftParsed[i] || { lineNumber: i + 1, timestamp: '', speaker: '', text: '' };
                const rightLine = rightParsed[i] || { lineNumber: i + 1, timestamp: '', speaker: '', text: '' };

                const isMissing = leftLine.text && !rightLine.text;
                const isAdded = !leftLine.text && rightLine.text;
                const isDiff = leftLine.text !== rightLine.text && !isMissing && !isAdded;

                const leftStyle = isMissing ? 'bg-red-100 text-red-800' : isDiff ? 'bg-yellow-100' : '';
                const rightStyle = isAdded ? 'bg-green-100 text-green-800' : isDiff ? 'bg-yellow-100' : '';

                return (
                    <React.Fragment key={i}>
                        <div className="text-xs text-gray-500 pt-1">{leftLine.lineNumber}</div>
                        <div className={`whitespace-pre-wrap p-2 rounded ${leftStyle}`}>
                            {leftLine.timestamp && (
                                <span className="text-gray-400">[{leftLine.timestamp}] </span>
                            )}
                            {leftLine.speaker && (
                                <span className="font-semibold text-blue-600">{leftLine.speaker}</span>
                            )}
                            {leftLine.speaker && ': '}{leftLine.text}
                        </div>
                        <div className="text-xs text-gray-500 pt-1">{rightLine.lineNumber}</div>
                        <div className={`whitespace-pre-wrap p-2 rounded ${rightStyle}`}>
                            {rightLine.timestamp && (
                                <span className="text-gray-400">[{rightLine.timestamp}] </span>
                            )}
                            {rightLine.speaker && (
                                <span className="font-semibold text-green-600">{rightLine.speaker}</span>
                            )}
                            {rightLine.speaker && ': '}{rightLine.text}
                        </div>
                    </React.Fragment>
                );
            })}
        </div>
    );
}
