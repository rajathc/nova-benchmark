// File: src/app/page.tsx
'use client';

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import SideBySideDiff from '@/components/SideBySideDiff';
import { colorSpeakerLines } from '@/utils/colorSpeakerLines';
import { toast } from 'sonner';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [nova2Text, setNova2Text] = useState('');
  const [nova3Text, setNova3Text] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    toast.loading('Uploading and transcribing...', { duration: 2000 });

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      setNova2Text(data.nova2 || '');
      setNova3Text(data.nova3 || '');
      toast.success('Transcription completed', { duration: 3000 });
    } catch (error) {
      toast.error('Something went wrong with transcription', { duration: 3000 });
      console.error('Transcription error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setNova2Text('');
    setNova3Text('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-200 dark:from-black dark:to-gray-900 flex items-center justify-center py-10 px-4 text-gray-900 dark:text-gray-100">
      <div className="w-full max-w-6xl bg-white/40 dark:bg-white/10 p-10 rounded-3xl shadow-2xl border border-white/30 backdrop-blur-2xl">
        <h1 className="text-4xl font-extrabold text-center mb-8">Deepgram Benchmark Tool</h1>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          <label className="relative cursor-pointer bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 px-5 py-2 rounded-full border border-blue-300 shadow-md backdrop-blur hover:bg-blue-200 dark:hover:bg-blue-800 transition-all">
            Choose File
            <input
              type="file"
              accept="audio/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </label>

          <button
            onClick={handleUpload}
            disabled={loading || !file}
            className="relative bg-green-500 text-white px-6 py-2 rounded-xl shadow-md hover:bg-green-600 transition-all disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Transcribing...
              </span>
            ) : 'Transcribe'}
          </button>
        </div>

        {file && (
          <div className="mb-6">
            <div className="inline-flex items-center bg-gray-100 dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-200 px-4 py-1 rounded-full">
              <span>{file.name}</span>
              <button onClick={handleRemoveFile} className="ml-2 text-red-500 hover:text-red-700">×</button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="font-semibold mb-1">Nova 2 Transcript</h2>
            <div
              className="w-full h-80 overflow-auto font-mono text-sm bg-white/30 dark:bg-white/10 border border-white/50 p-3 rounded"
              dangerouslySetInnerHTML={{ __html: colorSpeakerLines(nova2Text) }}
            />
          </div>
          <div>
            <h2 className="font-semibold mb-1">Nova 3 Transcript</h2>
            <div
              className="w-full h-80 overflow-auto font-mono text-sm bg-white/30 dark:bg-white/10 border border-white/50 p-3 rounded"
              dangerouslySetInnerHTML={{ __html: colorSpeakerLines(nova3Text) }}
            />
          </div>
        </div>

        {nova2Text && nova3Text && (
          <div className="mt-10">
            <h2 className="font-semibold mb-2">Line-by-Line Comparison</h2>
            <SideBySideDiff left={nova2Text} right={nova3Text} />
          </div>
        )}
      </div>
    </div>
  );
}