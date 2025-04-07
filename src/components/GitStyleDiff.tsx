'use client';

import { Diff, diffLines } from 'diff';
import React from 'react';

export default function GitStyleDiff({ oldText, newText }: { oldText: string; newText: string }) {
    const diffs: Diff[] = diffLines(oldText, newText);

    return (
        <pre className="text-sm font-mono whitespace-pre-wrap p-4 rounded-xl border border-white/40 bg-white/30 dark:bg-white/10">
            {diffs.map((part, i) => {
                const color =
                    part.added ? 'text-green-500' :
                        part.removed ? 'text-red-500' : 'text-gray-800 dark:text-gray-200';

                const prefix = part.added ? '+' : part.removed ? '-' : ' ';
                return (
                    <div key={i} className={color}>
                        {part.value.split('\n').map((line, j) => (
                            line && <div key={j}>{prefix}{line}</div>
                        ))}
                    </div>
                );
            })}
        </pre>
    );
}
