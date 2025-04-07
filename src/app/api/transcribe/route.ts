import { writeFileSync } from "fs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file)
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

  const arrayBuffer = await file.arrayBuffer();
  const blob = new Blob([arrayBuffer], { type: file.type });

  const fetchTranscript = async (model: string) => {
    const response = await fetch(
      `https://api.deepgram.com/v1/listen?model=${model}&diarize=true&punctuate=true&smart_format=true`,
      {
        method: "POST",
        headers: {
          Authorization: `Token ${process.env.DEEPGRAM_API_KEY}`,
          "Content-Type": file.type,
        },
        body: blob,
      }
    );

    const json = await response.json();
    const finalOutput: {
      speaker: number;
      text: string;
      start: string;
      end: string;
    }[] = [];

    json.results?.channels[0]?.alternatives?.forEach?.((alternative: any) => {
      alternative?.words?.forEach?.((wordInfo: any) => {
        const speaker =
          typeof wordInfo.speaker === "number" ? wordInfo.speaker : "Unknown";
        const word = wordInfo.word;
        const start = wordInfo.start.toFixed(2);
        const end = wordInfo.end.toFixed(2);
        const lastEl = finalOutput[finalOutput.length - 1];

        if (lastEl && lastEl.speaker === speaker) {
          lastEl.end = end;
          lastEl.text += ` ${word}`;
        } else finalOutput.push({ speaker, text: word, start, end });
      });
    });

    return finalOutput
      .map(
        (el) => `[${el.start}s - ${el.end}s] [Speaker ${el.speaker}]: ${el.text}`
      )
      .join("\n");
  };

  const formatTimestamp = (seconds: number) => {
    const d = new Date(0);
    d.setSeconds(seconds);
    return d.toISOString().substr(11, 8); // HH:MM:SS
  };

  const [nova2, nova3] = await Promise.all([
    fetchTranscript("nova-2"),
    fetchTranscript("nova-3"),
  ]);

  return NextResponse.json({ nova2, nova3 });
}
