export const colorSpeakerLines = (text: string) => {
    const speakerColors = ['text-blue-500', 'text-green-500', 'text-yellow-500', 'text-pink-500'];
    const lines = text.split('\n');

    return lines.map((line, idx) => {
        const match = line.match(/^Speaker (\\d+):/);
        if (match) {
            const speaker = parseInt(match[1]);
            const color = speakerColors[speaker % speakerColors.length];
            return `<span class="${color} font-semibold">Speaker ${speaker}:</span>${line.replace(/^Speaker \\d+:/, '')}`;
        }
        return line;
    }).join('<br>');
};
