'use client';

import { useState, useCallback } from 'react';
import { Message, ChatState } from '@/lib/types';
import { sendMessage } from '@/lib/chat-api';

export function useChat(initialApiKey: string = '') {
  const [apiKey, setApiKey] = useState<string>(initialApiKey);
  const [state, setState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: null
  });

  const addMessage = useCallback((content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date()
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
      error: null
    }));

    // Send message to API
    sendMessage(apiKey, [...state.messages, userMessage])
      .then(assistantMessage => {
        setState(prev => ({
          ...prev,
          messages: [...prev.messages, assistantMessage],
          isLoading: false
        }));
      })
      .catch(error => {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: error.message
        }));
      });
  }, [apiKey, state.messages]);

  const clearChat = useCallback(() => {
    setState({
      messages: [],
      isLoading: false,
      error: null
    });
  }, []);

  return {
    apiKey,
    setApiKey,
    messages: state.messages,
    isLoading: state.isLoading,
    error: state.error,
    addMessage,
    clearChat
  };
}