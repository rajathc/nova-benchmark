// File: src/components/SideBySideDiff.tsx
'use client';

import React from 'react';

function parseLines(text: string) {
    return text.split('\n').map((line) => {
        const match = line.match(/^\[(.*?)\]\s+(Speaker \d+):\s+(.*)$/);
        if (!match) return { timestamp: '', speaker: '', text: line };
        return {
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
        <div className="grid grid-cols-2 gap-2 bg-white/30 dark:bg-white/10 border border-white/40 p-4 rounded-xl text-sm font-mono">
            <div className="text-blue-500 font-semibold mb-1">Nova 2</div>
            <div className="text-green-500 font-semibold mb-1">Nova 3</div>

            {Array.from({ length: maxLines }).map((_, i) => {
                const leftLine = leftParsed[i] || { timestamp: '', speaker: '', text: '' };
                const rightLine = rightParsed[i] || { timestamp: '', speaker: '', text: '' };

                const isMissing = leftLine.text && !rightLine.text;
                const isAdded = !leftLine.text && rightLine.text;
                const isDiff = leftLine.text !== rightLine.text && !isMissing && !isAdded;

                const leftStyle = isMissing ? 'bg-red-100 text-red-800' : isDiff ? 'bg-yellow-100' : '';
                const rightStyle = isAdded ? 'bg-green-100 text-green-800' : isDiff ? 'bg-yellow-100' : '';

                return (
                    <React.Fragment key={i}>
                        <div className={`whitespace-pre-wrap p-2 rounded ${leftStyle}`}>
                            {leftLine.timestamp && (
                                <span className="text-gray-400">[{leftLine.timestamp}] </span>
                            )}
                            <span className="font-semibold text-blue-600">{leftLine.speaker}</span>
                            {': '}{leftLine.text}
                        </div>
                        <div className={`whitespace-pre-wrap p-2 rounded ${rightStyle}`}>
                            {rightLine.timestamp && (
                                <span className="text-gray-400">[{rightLine.timestamp}] </span>
                            )}
                            <span className="font-semibold text-green-600">{rightLine.speaker}</span>
                            {': '}{rightLine.text}
                        </div>
                    </React.Fragment>
                );
            })}
        </div>
    );
}