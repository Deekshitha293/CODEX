import { useState } from 'react';
import { Card } from '../components/ui';
import { aiService } from '../services/aiService';

type Msg = { from: 'ai' | 'user'; text: string; time: string };
type SpeechRecognitionType = { lang: string; start: () => void; onresult: ((event: any) => void) | null };

declare global {
  interface Window {
    webkitSpeechRecognition?: new () => SpeechRecognitionType;
    SpeechRecognition?: new () => SpeechRecognitionType;
  }
}

export default function AIAssistant() {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Msg[]>([
    { from: 'ai', text: 'Hello! Ask about sales, stock, expiry, demand or reorder planning.', time: new Date().toLocaleTimeString() }
  ]);

  const ask = async (q: string) => {
    if (!q.trim()) return;
    setMessages((m) => [...m, { from: 'user', text: q, time: new Date().toLocaleTimeString() }]);
    setQuery('');
    try {
      const result = await aiService.query(q);
      setMessages((m) => [...m, { from: 'ai', text: result?.reply || 'No response', time: new Date().toLocaleTimeString() }]);
    } catch {
      setMessages((m) => [...m, { from: 'ai', text: 'Assistant service unavailable right now.', time: new Date().toLocaleTimeString() }]);
    }
  };

  const startVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.onresult = (event) => setQuery(event.results[0][0].transcript);
    recognition.start();
  };

  return (
    <main className='max-w-md mx-auto min-h-screen bg-brand-light p-4'>
      <h1 className='font-bold text-lg'>AI Assistant</h1>
      <div className='space-y-3 mt-4 pb-24'>
        {messages.map((m, i) => (
          <div key={i} className={`max-w-[85%] rounded-2xl p-3 text-sm ${m.from === 'user' ? 'ml-auto bg-brand-primary text-white' : 'bg-white shadow-soft'}`}>
            <p className='whitespace-pre-line'>{m.text}</p>
            <p className='text-[10px] mt-1 opacity-70'>{m.time}</p>
          </div>
        ))}
      </div>
      <Card className='fixed bottom-0 left-0 right-0 max-w-md mx-auto p-3 rounded-none'>
        <div className='flex gap-2 items-center'>
          <input value={query} onChange={(e) => setQuery(e.target.value)} className='flex-1 border rounded-xl px-3 py-2 text-sm' placeholder='Type a business query...' onKeyDown={(e) => e.key === 'Enter' && ask(query)} />
          <button className='text-brand-primary' onClick={() => ask(query)}>➤</button>
          <button onClick={startVoice}>🎤</button>
        </div>
      </Card>
    </main>
  );
}
