import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });

    const arrayBuffer = await file.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: file.type });

    const fetchTranscript = async (model: string) => {
        const response = await fetch(`https://api.deepgram.com/v1/listen?model=${model}&diarize=true&punctuate=true&smart_format=true`, {
            method: 'POST',
            headers: {
                Authorization: `Token ${process.env.DEEPGRAM_API_KEY}`,
                'Content-Type': file.type,
            },
            body: blob,
        });

        const json = await response.json();
        console.log(`Deepgram ${model}:`, JSON.stringify(json, null, 2));

        // Use utterances if available
        const utterances = json.results?.utterances;
        if (utterances && utterances.length > 0) {
            return utterances.map((u: any) => {
                const start = formatTimestamp(u.start);
                const end = formatTimestamp(u.end);
                return `[${start} - ${end}] Speaker ${u.speaker}: ${u.transcript.trim()}`;
            }).join('\n');
        }

        // Fallback to transcript if diarization failed
        const transcript = json.results?.channels?.[0]?.alternatives?.[0]?.transcript;
        return transcript || 'No transcript available';
    };

    const formatTimestamp = (seconds: number) => {
        const d = new Date(0);
        d.setSeconds(seconds);
        return d.toISOString().substr(11, 8); // HH:MM:SS
    };

    const [nova2, nova3] = await Promise.all([
        fetchTranscript('nova-2'),
        fetchTranscript('nova-3'),
    ]);

    return NextResponse.json({ nova2, nova3 });
}
