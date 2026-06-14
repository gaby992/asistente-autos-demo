'use client';

import { Send, CarFront, Loader2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import styles from './Chat.module.css';

type Message = { id: string; role: 'user' | 'assistant'; content: string };

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '¡Hola! Soy Max, te ayudo a encontrar tu próximo auto. ¿Buscas nuevo o seminuevo?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const onFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });

      if (!response.ok) throw new Error(response.statusText);

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';

      setMessages(prev => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: 'assistant', content: '' }
      ]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          
          // Parse Vercel AI SDK text stream format (0:"text")
          const lines = chunk.split('\n');
          for (const line of lines) {
            if (line.startsWith('0:')) {
              try {
                const textChunk = JSON.parse(line.substring(2));
                assistantContent += textChunk;
                setMessages(prev => {
                  const newMsgs = [...prev];
                  newMsgs[newMsgs.length - 1] = { ...newMsgs[newMsgs.length - 1], content: assistantContent };
                  return newMsgs;
                });
              } catch (e) {
                // Ignore parse errors for incomplete chunks
              }
            }
          }
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatHeader}>
        <div className={styles.headerAvatar}>
          <CarFront size={20} />
        </div>
        <div className={styles.headerInfo}>
          <h2>Max</h2>
          <span className={styles.status}>En línea</span>
        </div>
      </div>

      <div className={styles.messagesArea}>
        {messages.map((m) => (
          <div
            key={m.id}
            className={`${styles.messageWrapper} ${
              m.role === 'user' ? styles.wrapperUser : styles.wrapperAssistant
            }`}
          >
            {m.role === 'assistant' && (
              <div className={styles.messageAvatar}>
                <CarFront size={16} />
              </div>
            )}
            <div
              className={`${styles.messageBubble} ${
                m.role === 'user' ? styles.bubbleUser : styles.bubbleAssistant
              }`}
            >
              <p>{m.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className={`${styles.messageWrapper} ${styles.wrapperAssistant}`}>
            <div className={styles.messageAvatar}>
              <CarFront size={16} />
            </div>
            <div className={`${styles.messageBubble} ${styles.bubbleAssistant}`}>
              <Loader2 size={16} className={styles.typingIndicator} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={onFormSubmit} className={styles.inputArea}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe tu mensaje..."
          className={styles.inputField}
          disabled={isLoading}
        />
        <button 
          type="submit" 
          className={styles.sendButton} 
          disabled={!input.trim() || isLoading}
          aria-label="Enviar mensaje"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
