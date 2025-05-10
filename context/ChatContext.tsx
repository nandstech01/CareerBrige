'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useChat } from '@/hooks/useChat';
import { Message } from '@/lib/types';

interface ChatContextType {
  apiKey: string;
  setApiKey: (key: string) => void;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  addMessage: (content: string) => void;
  clearChat: () => void;
  hasApiKey: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const {
    apiKey,
    setApiKey,
    messages,
    isLoading,
    error,
    addMessage,
    clearChat
  } = useChat();

  const hasApiKey = Boolean(apiKey);

  return (
    <ChatContext.Provider
      value={{
        apiKey,
        setApiKey,
        messages,
        isLoading,
        error,
        addMessage,
        clearChat,
        hasApiKey
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useAppChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useAppChat must be used within a ChatProvider');
  }
  return context;
}