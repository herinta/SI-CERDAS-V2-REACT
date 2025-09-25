
import React, { useState, useRef, useEffect } from 'react';
import { callGemini } from '../api/gemini';

const TanyaAiPage = () => {
  const [messages, setMessages] = useState([
    { from: 'ai', text: 'Halo! Ada yang bisa saya bantu terkait informasi kesehatan hari ini?' },
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { from: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    const prompt = `Anda adalah Asisten Kesehatan AI yang ramah untuk kader WARGA MAWAS+ & CARGIEVER. Jawab pertanyaan berikut dengan jelas dan sederhana. Selalu sertakan disclaimer di akhir jawaban bahwa informasi ini tidak menggantikan nasihat medis profesional. Pertanyaan: "${input}"`;
    const result = await callGemini(prompt);
    
    let aiResponse;
    if (result) {
        aiResponse = { from: 'ai', text: result.text };
    } else {
        aiResponse = { from: 'ai', text: 'Maaf, terjadi kesalahan. Silakan coba lagi.' };
    }
    setMessages(prev => [...prev, aiResponse]);
  };

  return (
    <div className="bg-white rounded-lg shadow-md flex flex-col" style={{ height: '70vh' }}>
      <div className="p-4 border-b text-center">
        <i className="fas fa-comments text-3xl text-indigo-500"></i>
        <h3 className="text-xl font-bold text-slate-800 mt-2">Asisten Kesehatan AI</h3>
        <p className="text-sm text-slate-500">Tanyakan apa saja seputar kesehatan.</p>
      </div>
      <div className="flex-1 p-4 space-y-4 overflow-y-auto flex flex-col">
        {messages.map((msg, index) => (
          <div key={index} className={`chat-bubble ${msg.from === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}`}>
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input type="text" value={input} onChange={e => setInput(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Ketik pertanyaan Anda..." />
          <button type="submit" className="bg-indigo-600 text-white rounded-full w-10 h-10 flex-shrink-0 flex items-center justify-center hover:bg-indigo-700">
            <i className="fas fa-paper-plane"></i>
          </button>
        </form>
      </div>
    </div>
  );
};

const ChatBubble = ({ from, text }) => {
    const isUser = from === 'user';
    const bubbleClass = isUser ? 'bg-indigo-600 text-white self-end' : 'bg-slate-200 text-slate-800 self-start';
    return (
        <div className={`max-w-md p-3 rounded-lg ${bubbleClass}`}>
            {text}
        </div>
    );
};


export default TanyaAiPage;
