'use client';

import { Send } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import styles from './Chat.module.css';

type Message = { id: string; role: 'user' | 'assistant' | 'error'; content: string };

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

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input.trim() };
    const historyToSent = [...messages, userMsg].filter(m => m.role !== 'error');
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: historyToSent }),
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
        let buffer = '';
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';
          
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
                // Ignore parse errors
              }
            } else if (line.trim() !== '' && !line.match(/^[0-9]+:/)) {
               // Fallback for raw text streams
               assistantContent += line + '\n';
               setMessages(prev => {
                const newMsgs = [...prev];
                newMsgs[newMsgs.length - 1] = { ...newMsgs[newMsgs.length - 1], content: assistantContent };
                return newMsgs;
              });
            }
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [
        ...prev,
        { id: Date.now().toString(), role: 'error', content: 'Tuve un problema para responder, inténtalo de nuevo.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatHeader}>
        <div className={styles.headerAvatar}>
          M
        </div>
        <div className={styles.headerInfo}>
          <h2>Max</h2>
          <span className={styles.subtitle}>Asistente de Ventas</span>
          <span className={styles.status}>En línea</span>
        </div>
      </div>

      <div className={styles.messagesArea}>
        {messages.map((m) => {
          const isAssistant = m.role === 'assistant' || m.role === 'error';
          return (
            <div
              key={m.id}
              className={`${styles.messageWrapper} ${
                isAssistant ? styles.wrapperAssistant : styles.wrapperUser
              }`}
            >
              {isAssistant && (
                <div className={styles.messageAvatar}>
                  M
                </div>
              )}
              <div
                className={`${styles.messageBubble} ${
                  m.role === 'user' ? styles.bubbleUser : (m.role === 'error' ? styles.bubbleError : styles.bubbleAssistant)
                }`}
              >
                <div style={{ margin: 0 }}>
                  {m.content
                    // Safely add newlines before list items (" - ") without breaking words like "V-Drive"
                    .replace(/\s+-\s+(?=[a-zA-Z*])/g, '\n- ')
                    // Add newline before ¿ or ¡ if it follows text
                    .replace(/([a-zA-Z0-9.,?!])\s*(¿|¡)/g, '$1\n\n$2')
                    .split('\n')
                    .map((line, i) => (
                      <span key={i}>
                        {line.split(/[*]{1,2}([^*]+)[*]{1,2}/g).map((part, j) => (
                          j % 2 === 1 ? <strong key={j}>{part}</strong> : part
                        ))}
                        <br />
                      </span>
                    ))}
                </div>
              </div>
            </div>
          );
        })}
        {isLoading && (
          <div className={`${styles.messageWrapper} ${styles.wrapperAssistant}`}>
            <div className={styles.messageAvatar}>
              M
            </div>
            <div className={`${styles.messageBubble} ${styles.bubbleAssistant}`}>
              <div className={styles.typingIndicator}>
                <span></span><span></span><span></span>
              </div>
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
