export const colorSpeakerLines = (text: string) => {
    const speakerColors = [
        'text-blue-500',
        'text-green-500',
        'text-yellow-500',
        'text-pink-500',
        'text-purple-500',
        'text-red-500',
    ];

    return text.split('\n').map((line) => {
        const match = line.match(/^\[(.*?)\]\s+(Speaker (\d+)):\s+(.*)$/);
        if (!match) return `<span>${line}</span>`;

        const timestamp = match[1];
        const speakerLabel = match[2]; // "Speaker 0"
        const speakerNum = parseInt(match[3], 10); // 0
        const content = match[4];

        const colorClass = speakerColors[speakerNum % speakerColors.length];

        return `<span class="text-gray-400">[${timestamp}] </span><span class="${colorClass} font-semibold">${speakerLabel}:</span> ${content}`;
    }).join('<br>');
};