'use client';

import { useAppChat } from '@/context/ChatContext';
import { MessageList } from '@/components/MessageList';
import { MessageInput } from '@/components/MessageInput';
import { ApiKeyForm } from '@/components/ApiKeyForm';
import { ChatHeader } from '@/components/ChatHeader';

export function ChatInterface() {
  const { hasApiKey, error } = useAppChat();

  if (!hasApiKey) {
    return <ApiKeyForm />;
  }

  return (
    <div className="flex flex-col h-screen">
      <ChatHeader />
      
      {error && (
        <div className="bg-destructive/10 text-destructive px-4 py-2 text-sm text-center">
          Error: {error}
        </div>
      )}
      
      <MessageList />
      <MessageInput />
    </div>
  );
}